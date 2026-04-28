import { PrismaClient, ChartOfAccounts, Transaction, TransactionDetail } from '@prisma/client';
import { logger } from '../utils/logger.util';

const prisma = new PrismaClient();

export class AccountingService {
  /**
   * Membuat akun chart of accounts baru
   */
  static async createAccount(accountData: {
    accountCode: string;
    accountName: string;
    accountType: string; // ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
    accountGroup: string;
    description?: string;
    normalBalance: string; // DEBIT or CREDIT
    parentId?: string;
  }): Promise<ChartOfAccounts> {
    try {
      const account = await prisma.chartOfAccounts.create({
        data: {
          accountCode: accountData.accountCode,
          accountName: accountData.accountName,
          accountType: accountData.accountType,
          accountGroup: accountData.accountGroup,
          description: accountData.description,
          normalBalance: accountData.normalBalance,
          parentId: accountData.parentId,
          isActive: true
        }
      });

      logger.info(`Akun baru dibuat: ${account.accountCode} - ${account.accountName}`);
      return account;
    } catch (error) {
      logger.error('Error creating account:', error);
      throw error;
    }
  }

  /**
   * Membuat transaksi accounting
   */
  static async createTransaction(transactionData: {
    transactionDate: Date;
    description: string;
    reference?: string;
    journalType: string; // SA = Simple Journal, AJ = Adjusting Journal, CL = Closing Journal
    details: Array<{
      accountId: string;
      debitAmount: number;
      creditAmount: number;
      description?: string;
    }>;
    createdBy: string;
  }): Promise<Transaction> {
    try {
      // Validasi bahwa total debit = total credit
      const totalDebit = transactionData.details.reduce(
        (sum, detail) => sum + detail.debitAmount, 0
      );
      const totalCredit = transactionData.details.reduce(
        (sum, detail) => sum + detail.creditAmount, 0
      );

      if (Math.abs(totalDebit - totalCredit) > 0.01) { // Toleransi pembulatan
        throw new Error(`Transaksi tidak balance: Debit ${totalDebit} vs Credit ${totalCredit}`);
      }

      // Membuat transaksi
      const transaction = await prisma.$transaction(async (tx) => {
        const newTransaction = await tx.transaction.create({
          data: {
            transactionNumber: `TRX-${Date.now()}`,
            transactionDate: transactionData.transactionDate,
            description: transactionData.description,
            reference: transactionData.reference,
            journalType: transactionData.journalType,
            posted: false,
            createdBy: transactionData.createdBy
          }
        });

        // Membuat detail transaksi
        for (const detail of transactionData.details) {
          await tx.transactionDetail.create({
            data: {
              transactionId: newTransaction.id,
              accountId: detail.accountId,
              debitAmount: detail.debitAmount,
              creditAmount: detail.creditAmount,
              description: detail.description
            }
          });
        }

        return newTransaction;
      });

      logger.info(`Transaksi dibuat: ${transaction.transactionNumber}`);
      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Posting transaksi ke ledger
   */
  static async postTransaction(transactionId: string): Promise<Transaction> {
    try {
      // Dapatkan transaksi dan detailnya
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: { transactionDetails: true }
      });

      if (!transaction) {
        throw new Error('Transaksi tidak ditemukan');
      }

      if (transaction.posted) {
        throw new Error('Transaksi sudah diposting sebelumnya');
      }

      // Lakukan posting ke general ledger
      await prisma.$transaction(async (tx) => {
        for (const detail of transaction.transactionDetails) {
          // Tambahkan ke general ledger
          await tx.generalLedger.create({
            data: {
              accountId: detail.accountId,
              transactionId: transaction.id,
              date: transaction.transactionDate,
              description: transaction.description,
              debitAmount: detail.debitAmount,
              creditAmount: detail.creditAmount
            }
          });

          // Update saldo akun di trial balance
          const period = `${transaction.transactionDate.getFullYear()}${String(transaction.transactionDate.getMonth() + 1).padStart(2, '0')}`;
          
          // Cek apakah sudah ada entri trial balance untuk periode ini
          let trialBalance = await tx.trialBalance.findFirst({
            where: {
              period,
              accountId: detail.accountId
            }
          });

          if (trialBalance) {
            // Update trial balance yang sudah ada
            const delta = Number(detail.debitAmount) - Number(detail.creditAmount);
            await tx.trialBalance.update({
              where: { id: trialBalance.id },
              data: {
                debitAmount: { increment: detail.debitAmount },
                creditAmount: { increment: detail.creditAmount },
                closingBalance: { increment: delta }
              }
            });
          } else {
            // Buat trial balance baru
            const delta = Number(detail.debitAmount) - Number(detail.creditAmount);
            await tx.trialBalance.create({
              data: {
                period,
                accountId: detail.accountId,
                openingBalance: 0,
                debitAmount: detail.debitAmount,
                creditAmount: detail.creditAmount,
                closingBalance: delta
              }
            });
          }
        }

        // Tandai transaksi sebagai sudah diposting
        await tx.transaction.update({
          where: { id: transactionId },
          data: {
            posted: true,
            postedAt: new Date(),
            postedBy: 'SYSTEM' // Akan diupdate dengan user sebenarnya
          }
        });
      });

      logger.info(`Transaksi diposting: ${transaction.transactionNumber}`);
      const updated = await prisma.transaction.findUnique({ where: { id: transactionId } });
      if (!updated) {
        throw new Error('Transaksi tidak ditemukan setelah posting');
      }
      return updated;
    } catch (error) {
      logger.error('Error posting transaction:', error);
      throw error;
    }
  }

  /**
   * Mendapatkan trial balance
   */
  static async getTrialBalance(period: string): Promise<Record<string, any[]>> {
    try {
      const trialBalances = await prisma.trialBalance.findMany({
        where: { period },
        include: {
          account: true
        },
        orderBy: { account: { accountCode: 'asc' } }
      });

      // Mengelompokkan berdasarkan tipe akun
      const grouped: any = {
        ASSET: [],
        LIABILITY: [],
        EQUITY: [],
        REVENUE: [],
        EXPENSE: []
      };

      for (const tb of trialBalances) {
        grouped[tb.account.accountType].push(tb);
      }

      logger.info(`Trial balance diambil untuk periode: ${period}`);
      return grouped;
    } catch (error) {
      logger.error('Error getting trial balance:', error);
      throw error;
    }
  }

  /**
   * Menghitung depresiasi aktiva
   */
  static async calculateDepreciation(assetId: string): Promise<void> {
    try {
      const depreciation = await prisma.depreciation.findFirst({
        where: { assetId }
      });

      if (!depreciation || !depreciation.isActive) {
        return;
      }

      // Hitung depresiasi bulanan berdasarkan metode
      let monthlyDepreciation = 0;
      const cost = Number(depreciation.cost);
      const accumulated = Number(depreciation.accumulatedDepreciation);
      const salvageValue = Number(depreciation.salvageValue);
      const currentValue = cost - accumulated;

      switch (depreciation.depreciationMethod) {
        case 'STRAIGHT_LINE':
          monthlyDepreciation = (cost - salvageValue) / (depreciation.usefulLife * 12);
          break;
        case 'DECLINING_BALANCE':
          // Metode saldo menurun - ambil persentase tetap dari nilai buku
          const rate = 2 / (depreciation.usefulLife * 12); // Double declining
          monthlyDepreciation = currentValue * rate;
          break;
        default:
          throw new Error(`Metode depresiasi tidak didukung: ${depreciation.depreciationMethod}`);
      }

      // Update data depresiasi
      await prisma.depreciation.update({
        where: { id: depreciation.id },
        data: {
          accumulatedDepreciation: { increment: monthlyDepreciation },
          netBookValue: currentValue - monthlyDepreciation
        }
      });

      // Buat entri jurnal untuk depresiasi
      await this.createDepreciationJournalEntry(depreciation, monthlyDepreciation);

      logger.info(`Depresiasi dihitung untuk aktiva: ${assetId}`);
    } catch (error) {
      logger.error('Error calculating depreciation:', error);
      throw error;
    }
  }

  /**
   * Membuat entri jurnal untuk depresiasi
   */
  private static async createDepreciationJournalEntry(depreciation: any, amount: number): Promise<void> {
    // Dalam implementasi nyata, kita akan mencari akun depresiasi dan akumulasi depresiasi
    // Untuk sekarang kita gunakan akun default
    const depreciationExpenseAccount = "6100"; // Biaya Depresiasi
    const accumulatedDepreciationAccount = "1201"; // Akumulasi Penyusutan

    await this.createTransaction({
      transactionDate: new Date(),
      description: `Depresiasi bulanan untuk aktiva ${depreciation.assetName}`,
      journalType: 'AJ', // Adjusting Journal
      details: [
        {
          accountId: depreciationExpenseAccount,
          debitAmount: amount,
          creditAmount: 0
        },
        {
          accountId: accumulatedDepreciationAccount,
          debitAmount: 0,
          creditAmount: amount
        }
      ],
      createdBy: 'SYSTEM'
    });
  }

  /**
   * Membuat laporan keuangan
   */
  static async generateFinancialReport(reportType: string, period: string): Promise<any> {
    try {
      // Dalam implementasi nyata, ini akan menghasilkan laporan keuangan sesuai PSAK
      // Seperti laporan laba rugi, neraca, arus kas, dll
      
      let reportData: any = {};
      
      switch(reportType) {
        case 'BALANCE_SHEET': // Neraca
          reportData = await this.generateBalanceSheet(period);
          break;
        case 'INCOME_STATEMENT': // Laporan Laba Rugi
          reportData = await this.generateIncomeStatement(period);
          break;
        case 'CASH_FLOW': // Arus Kas
          reportData = await this.generateCashFlow(period);
          break;
        case 'EQUITY': // Ekuitas
          reportData = await this.generateEquityStatement(period);
          break;
        default:
          throw new Error(`Jenis laporan tidak didukung: ${reportType}`);
      }

      // Simpan laporan ke database
      const report = await prisma.financialReport.create({
        data: {
          reportType,
          period,
          content: reportData,
          generatedBy: 'SYSTEM'
        }
      });

      logger.info(`Laporan keuangan dibuat: ${reportType} untuk periode ${period}`);
      return report;
    } catch (error) {
      logger.error('Error generating financial report:', error);
      throw error;
    }
  }

  /**
   * Generate neraca (balance sheet) sesuai PSAK
   */
  private static async generateBalanceSheet(period: string): Promise<any> {
    // Ambil data trial balance untuk periode
    const trialBalances = await this.getTrialBalance(period);
    
    // Kelompokkan data sesuai PSAK
    const assets = trialBalances.ASSET || [];
    const liabilities = trialBalances.LIABILITY || [];
    const equity = trialBalances.EQUITY || [];

    return {
      assets: assets.map(a => ({
        accountName: a.account.accountName,
        accountCode: a.account.accountCode,
        amount: Number(a.closingBalance)
      })),
      liabilities: liabilities.map(l => ({
        accountName: l.account.accountName,
        accountCode: l.account.accountCode,
        amount: Number(l.closingBalance)
      })),
      equity: equity.map(e => ({
        accountName: e.account.accountName,
        accountCode: e.account.accountCode,
        amount: Number(e.closingBalance)
      }))
    };
  }

  /**
   * Generate laporan laba rugi (income statement) sesuai PSAK
   */
  private static async generateIncomeStatement(period: string): Promise<any> {
    // Ambil data trial balance untuk periode
    const trialBalances = await this.getTrialBalance(period);
    
    // Kelompokkan data sesuai PSAK
    const revenues = trialBalances.REVENUE || [];
    const expenses = trialBalances.EXPENSE || [];

    return {
      revenues: revenues.map(r => ({
        accountName: r.account.accountName,
        accountCode: r.account.accountCode,
        amount: Number(r.closingBalance)
      })),
      expenses: expenses.map(e => ({
        accountName: e.account.accountName,
        accountCode: e.account.accountCode,
        amount: Number(e.closingBalance)
      }))
    };
  }

  /**
   * Generate laporan arus kas (cash flow statement) sesuai PSAK
   */
  private static async generateCashFlow(period: string): Promise<any> {
    // Dalam implementasi nyata, ini akan menghitung arus kas dari operasi, investasi, dan pendanaan
    // Sesuai dengan PSAK tentang laporan arus kas
    
    return {
      operatingActivities: [],
      investingActivities: [],
      financingActivities: [],
      netChangeInCash: 0,
      cashAtBeginningOfPeriod: 0,
      cashAtEndOfPeriod: 0
    };
  }

  /**
   * Generate laporan ekuitas (equity statement) sesuai PSAK
   */
  private static async generateEquityStatement(period: string): Promise<any> {
    // Ambil data trial balance untuk periode
    const trialBalances = await this.getTrialBalance(period);
    
    const equityAccounts = trialBalances.EQUITY || [];
    
    return {
      equityAccounts: equityAccounts.map(e => ({
        accountName: e.account.accountName,
        accountCode: e.account.accountCode,
        amount: Number(e.closingBalance)
      }))
    };
  }
}