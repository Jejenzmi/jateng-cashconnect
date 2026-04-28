import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Support & Back-Office Integration Hook
 * Integrates workflows across: Inventory, SDM/HR, Akuntansi
 */

// ==================== INVENTORY INTEGRATION ====================

export function useInventoryIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const receivePurchaseOrder = useMutation({
    mutationFn: async ({
      poId,
      receivedItems,
    }: {
      poId: string;
      receivedItems: Array<{
        medicineId: string;
        quantityReceived: number;
        batchNumber: string;
        expiryDate: string;
      }>;
    }) => {
      // Update PO status
      await putApi("/generic-api", {
        table: "purchase_orders",
        id: poId,
        data: { status: "received" }
      });

      // Add medicine batches and update stock
      for (const item of receivedItems) {
        // Create batch
        await postApi("/generic-api", {
          table: "inventory_batches",
          data: {
            medicineId: item.medicineId,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            quantity: item.quantityReceived
          }
        });

        // Update medicine stock
        const medicineResult = await getApi(`/generic-api?table=medicines&id=${item.medicineId}`);
        const currentStock = medicineResult[0]?.stock || 0;
        await putApi("/generic-api", {
          table: "medicines",
          id: item.medicineId,
          data: { stock: currentStock + item.quantityReceived }
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      queryClient.invalidateQueries({ queryKey: ["medicine-batches"] });
      toast({ title: "Barang berhasil diterima" });
    },
  });

  const distributeStock = useMutation({
    mutationFn: async ({
      medicineId,
      quantity,
      notes,
    }: {
      medicineId: string;
      quantity: number;
      notes?: string;
    }) => {
      const medicineResult = await getApi(`/generic-api?table=medicines&id=${medicineId}`);

      const currentStock = medicineResult[0]?.stock || 0;

      if (currentStock < quantity) {
        throw new Error("Stok tidak mencukupi");
      }

      await putApi("/generic-api", {
        table: "medicines",
        id: medicineId,
        data: { stock: currentStock - quantity }
      });

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      toast({ title: "Distribusi berhasil" });
    },
  });

  return { receivePurchaseOrder, distributeStock };
}

// ==================== SDM/HR INTEGRATION ====================

export function useHRIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const recordAttendance = useMutation({
    mutationFn: async ({
      employeeId,
      checkIn,
      checkOut,
      status,
      notes,
    }: {
      employeeId: string;
      checkIn?: string;
      checkOut?: string;
      status: "present" | "absent" | "late" | "leave" | "sick";
      notes?: string;
    }) => {
      const today = new Date().toISOString().split("T")[0];

      const existingResult = await getApi(`/generic-api?table=attendance&employeeId=${employeeId}&date=${today}`);

      if (existingResult.length > 0) {
        const result = await putApi("/generic-api", {
          table: "attendance",
          id: existingResult[0].id,
          data: {
            checkIn,
            checkOut,
            status,
            notes
          }
        });
        return result;
      } else {
        const result = await postApi("/generic-api", {
          table: "attendance",
          data: {
            employeeId,
            date: today,
            checkIn,
            checkOut,
            status,
            notes
          }
        });
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      toast({ title: "Absensi dicatat" });
    },
  });

  const generatePayroll = useMutation({
    mutationFn: async ({
      employeeId,
      periodMonth,
      periodYear,
    }: {
      employeeId: string;
      periodMonth: number;
      periodYear: number;
    }) => {
      const employeeResult = await getApi(`/generic-api?table=employees&id=${employeeId}`);

      if (employeeResult.length === 0) throw new Error("Karyawan tidak ditemukan");

      const employee = employeeResult[0];
      const basicSalary = employee.salary || 0;
      const allowances = { transport: 500000, meal: 300000 };
      const totalAllowances = Object.values(allowances).reduce((a, b) => a + b, 0);
      const deductions = { bpjs: Math.min(basicSalary * 0.03, 360000) };
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const grossSalary = basicSalary + totalAllowances;
      const taxAmount = Math.max(0, (grossSalary - 4500000) * 0.05);
      const netSalary = grossSalary - totalDeductions - taxAmount;

      const existingPayrollResult = await getApi(`/generic-api?table=payrolls&employeeId=${employeeId}&period=${periodYear}-${periodMonth}`);

      if (existingPayrollResult.length > 0) {
        const result = await putApi("/generic-api", {
          table: "payrolls",
          id: existingPayrollResult[0].id,
          data: {
            basicSalary,
            allowances: JSON.stringify(allowances),
            deductions: JSON.stringify(deductions),
            grossSalary,
            taxAmount,
            netSalary,
            status: "draft"
          }
        });
        return result;
      } else {
        const result = await postApi("/generic-api", {
          table: "payrolls",
          data: {
            employeeId,
            period: `${periodYear}-${periodMonth}`,
            basicSalary,
            allowances: JSON.stringify(allowances),
            deductions: JSON.stringify(deductions),
            grossSalary,
            taxAmount,
            netSalary,
            status: "draft"
          }
        });
        return result;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast({ title: "Payroll berhasil digenerate" });
    },
  });

  const processPayroll = useMutation({
    mutationFn: async ({ payrollId }: { payrollId: string }) => {
      const result = await putApi("/generic-api", {
        table: "payrolls",
        id: payrollId,
        data: { status: "processed" }
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast({ title: "Pembayaran gaji diproses" });
    },
  });

  return { recordAttendance, generatePayroll, processPayroll };
}

// ==================== AKUNTANSI INTEGRATION ====================

export function useAccountingIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createJournalFromBilling = useMutation({
    mutationFn: async ({
      billingId,
      cashAccountId,
      revenueAccountId,
    }: {
      billingId: string;
      cashAccountId: string;
      revenueAccountId: string;
    }) => {
      const billingResult = await getApi(`/generic-api?table=billings&id=${billingId}`);

      if (billingResult.length === 0) throw new Error("Billing tidak ditemukan");

      const billing = billingResult[0];

      // Generate journal number manually since we can't use RPC
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const journalNumber = `JUR-${timestamp}-${randomPart}`;

      const journalResult = await postApi("/generic-api", {
        table: "transactions",
        data: {
          transactionNumber: journalNumber,
          description: `Pembayaran ${billing.invoice_number}`,
          journalType: 'billing',
          reference: billingId,
          posted: true,
          postedAt: new Date().toISOString(),
          postedBy: "system",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "system"
        }
      });

      const journal = journalResult;

      await postApi("/generic-api", {
        table: "transaction_details",
        data: {
          transactionId: journal.id,
          accountId: cashAccountId,
          debitAmount: billing.total,
          creditAmount: 0,
          description: `Penerimaan dari ${billing.invoice_number}`
        }
      });

      await postApi("/generic-api", {
        table: "transaction_details",
        data: {
          transactionId: journal.id,
          accountId: revenueAccountId,
          debitAmount: 0,
          creditAmount: billing.total,
          description: `Pendapatan dari ${billing.invoice_number}`
        }
      });

      return journal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      toast({ title: "Jurnal otomatis dibuat" });
    },
  });

  const createJournalFromPayroll = useMutation({
    mutationFn: async ({
      payrollIds,
      salaryExpenseAccountId,
      cashAccountId,
    }: {
      payrollIds: string[];
      salaryExpenseAccountId: string;
      cashAccountId: string;
    }) => {
      const payrollsResult = await getApi(`/generic-api?table=payrolls&ids=[${payrollIds.join(',')}]`);

      if (payrollsResult.length === 0) throw new Error("Payroll tidak ditemukan");

      const totalNet = payrollsResult.reduce((sum, p) => sum + (p.net_salary || 0), 0);
      const totalGross = payrollsResult.reduce((sum, p) => sum + (p.gross_salary || 0), 0);

      const periodMonth = payrollsResult[0].period_month;
      const periodYear = payrollsResult[0].period_year;

      // Generate journal number manually
      const timestamp = Date.now().toString(36).toUpperCase();
      const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
      const journalNumber = `JUR-${timestamp}-${randomPart}`;

      const journalResult = await postApi("/generic-api", {
        table: "transactions",
        data: {
          transactionNumber: journalNumber,
          description: `Pembayaran Gaji ${periodMonth}/${periodYear}`,
          journalType: 'payroll',
          reference: `PAYROLL-${periodMonth}-${periodYear}`,
          posted: true,
          postedAt: new Date().toISOString(),
          postedBy: "system",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "system"
        }
      });

      const journal = journalResult;

      await postApi("/generic-api", {
        table: "transaction_details",
        data: {
          transactionId: journal.id,
          accountId: salaryExpenseAccountId,
          debitAmount: totalGross,
          creditAmount: 0,
          description: `Beban Gaji ${periodMonth}/${periodYear}`
        }
      });

      await postApi("/generic-api", {
        table: "transaction_details",
        data: {
          transactionId: journal.id,
          accountId: cashAccountId,
          debitAmount: 0,
          creditAmount: totalGross,
          description: `Pengeluaran Gaji ${periodMonth}/${periodYear}`
        }
      });

      return journal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal-entries"] });
      toast({ title: "Jurnal payroll dibuat" });
    },
  });

  return { createJournalFromBilling, createJournalFromPayroll };
}

// ==================== COMBINED SUPPORT STATS ====================

export function useSupportDashboardStats() {
  return useQuery({
    queryKey: ["support-dashboard-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const [
        lowStockMedicinesResult,
        pendingOrdersResult,
        presentTodayResult,
        pendingPayrollResult,
        pendingJournalsResult,
      ] = await Promise.all([
        getApi("/generic-api?table=medicines&low_stock_only=true"),
        getApi("/generic-api?table=purchase_orders&status=pending"),
        getApi("/generic-api?table=attendance&date=today&status=present"),
        getApi("/generic-api?table=payrolls&status=draft"),
        getApi("/generic-api?table=transactions&status=unposted"),
      ]);

      return {
        lowStockMedicines: lowStockMedicinesResult[0]?.count || 0,
        pendingOrders: pendingOrdersResult[0]?.count || 0,
        presentToday: presentTodayResult[0]?.count || 0,
        pendingPayroll: pendingPayrollResult[0]?.count || 0,
        pendingJournals: pendingJournalsResult[0]?.count || 0,
      };
    },
  });
}