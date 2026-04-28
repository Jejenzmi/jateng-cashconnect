import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data akunting
interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  parent_account?: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface Journal {
  id: string;
  journal_number: string;
  journal_date: string;
  description: string;
  total_debit: number;
  total_credit: number;
  posted: boolean;
  posted_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface JournalLine {
  id: string;
  journal_id: string;
  account_id: string;
  debit: number;
  credit: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CashFlowCategory {
  id: string;
  name: string;
  type: 'operating' | 'investing' | 'financing';
  created_at: string;
  updated_at: string;
}

interface CashFlowItem {
  id: string;
  category_id: string;
  account_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface RevenueExpenseItem {
  id: string;
  account_id: string;
  period: string; // Format YYYY-MM
  amount: number;
  type: 'revenue' | 'expense';
  created_at: string;
  updated_at: string;
}

interface CashItem {
  id: string;
  account_id: string;
  period: string; // Format YYYY-MM
  amount: number;
  type: 'cash_in' | 'cash_out';
  created_at: string;
  updated_at: string;
}

interface FinancialRatio {
  id: string;
  period: string;
  ratio_type: string;
  value: number;
  created_at: string;
  updated_at: string;
}

export function useAccountingData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      try {
        const result = await getApi<Account[]>`SELECT * FROM accounts ORDER BY account_number`;
        return result;
      } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
      }
    },
  });

  // Fetch all journals
  const { data: journals, isLoading: isLoadingJournals } = useQuery<Journal[]>({
    queryKey: ["journals"],
    queryFn: async () => {
      try {
        // Join dengan tabel user untuk mendapatkan nama pembuat jurnal
        const result = await getApi<Journal[]>`
          SELECT 
            j.id,
            j.journal_number,
            j.journal_date,
            j.description,
            j.total_debit,
            j.total_credit,
            j.posted,
            j.posted_at,
            j.created_by,
            j.created_at,
            j.updated_at
          FROM journals j
          ORDER BY j.journal_date DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching journals:", error);
        throw error;
      }
    },
  });

  // Fetch journal lines for a specific journal
  const getJournalLines = async (journalId: string) => {
    try {
      const result = await getApi<JournalLine[]>`
        SELECT 
          jl.*,
          a.account_number,
          a.account_name
        FROM journal_lines jl
        JOIN accounts a ON jl.account_id = a.id
        WHERE jl.journal_id = ${journalId}
        ORDER BY a.account_number
      `;
      return result;
    } catch (error) {
      console.error("Error fetching journal lines:", error);
      throw error;
    }
  };

  // Fetch revenue and expense accounts
  const { data: revenueExpenseAccounts } = useQuery<Account[]>({
    queryKey: ["revenue-expense-accounts"],
    queryFn: async () => {
      try {
        const result = await getApi<Account[]>`
          SELECT * 
          FROM accounts 
          WHERE account_type IN ('revenue', 'expense') 
          ORDER BY account_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching revenue and expense accounts:", error);
        throw error;
      }
    },
  });

  // Fetch cash accounts
  const { data: cashAccounts } = useQuery<Account[]>({
    queryKey: ["cash-accounts"],
    queryFn: async () => {
      try {
        const result = await getApi<Account[]>`
          SELECT * 
          FROM accounts 
          WHERE account_type = 'cash' 
          ORDER BY account_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching cash accounts:", error);
        throw error;
      }
    },
  });

  // Create journal entry
  const createJournal = useMutation({
    mutationFn: async ({
      journal_date,
      description,
      lines,
    }: {
      journal_date: string;
      description: string;
      lines: {
        account_id: string;
        debit: number;
        credit: number;
        description: string;
      }[];
    }) => {
      // Validasi input
      if (lines.length === 0) {
        throw new Error("Minimal satu baris jurnal harus diinputkan");
      }

      // Hitung total debit dan kredit
      const totalDebit = lines.reduce((sum, line) => sum + line.debit, 0);
      const totalCredit = lines.reduce((sum, line) => sum + line.credit, 0);

      if (Math.abs(totalDebit - totalCredit) > 0.01) {
        throw new Error(`Total debit (Rp${totalDebit.toLocaleString()}) dan kredit (Rp${totalCredit.toLocaleString()}) harus seimbang`);
      }

      // Dapatkan nomor jurnal berikutnya
      const numberResult = await getApi<{ journal_number: string }[]>`
        SELECT generate_journal_number() as journal_number
      `;
      const journalNumber = numberResult[0].journal_number;

      // Mulai transaksi
      const result = await getApi.begin(async (tx) => {
        // Insert jurnal
        const journalResult = await tx<Journal[]>`
          INSERT INTO journals (
            journal_number, 
            journal_date, 
            description, 
            total_debit, 
            total_credit, 
            posted, 
            created_by
          ) VALUES (
            ${journalNumber}, 
            ${journal_date}, 
            ${description}, 
            ${totalDebit}, 
            ${totalCredit}, 
            false, 
            'current_user_id'
          ) 
          RETURNING *
        `;

        const journal = journalResult[0];
        const journalId = journal.id;

        // Insert baris jurnal
        for (const line of lines) {
          await tx`
            INSERT INTO journal_lines (
              journal_id, 
              account_id, 
              debit, 
              credit, 
              description
            ) VALUES (
              ${journalId}, 
              ${line.account_id}, 
              ${line.debit}, 
              ${line.credit}, 
              ${line.description}
            )
          `;
        }

        return journal;
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal-lines"] });
      toast({
        title: "Jurnal Berhasil Dibuat",
        description: "Transaksi jurnal telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Jurnal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update journal
  const updateJournal = useMutation({
    mutationFn: async ({
      id,
      journal_date,
      description,
      posted,
    }: {
      id: string;
      journal_date: string;
      description: string;
      posted: boolean;
    }) => {
      const result = await getApi<Journal[]>`
        UPDATE journals 
        SET 
          journal_date = ${journal_date},
          description = ${description},
          posted = ${posted},
          posted_at = CASE 
            WHEN ${posted} = true THEN NOW()
            ELSE posted_at
          END
        WHERE id = ${id} 
        RETURNING *
      `;
      
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      toast({
        title: "Jurnal Berhasil Diperbarui",
        description: "Perubahan pada jurnal telah disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Jurnal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete journal
  const deleteJournal = useMutation({
    mutationFn: async (id: string) => {
      // Hapus baris jurnal terlebih dahulu
      await deleteApi("/generic-api");
      
      // Baru hapus jurnal utama
      await deleteApi("/generic-api");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      queryClient.invalidateQueries({ queryKey: ["journal-lines"] });
      toast({
        title: "Jurnal Berhasil Dihapus",
        description: "Jurnal telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Jurnal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Fetch cash flow items
  const { data: cashFlowItems } = useQuery<CashFlowItem[]>({
    queryKey: ["cash-flow-items"],
    queryFn: async () => {
      try {
        const result = await getApi<CashFlowItem[]>`
          SELECT 
            cfi.*,
            cfc.name as category_name,
            a.account_name
          FROM cash_flow_items cfi
          JOIN cash_flow_categories cfc ON cfi.category_id = cfc.id
          JOIN accounts a ON cfi.account_id = a.id
          ORDER BY cfc.type, cfc.name, a.account_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching cash flow items:", error);
        throw error;
      }
    },
  });

  // Fetch revenue and expense data
  const { data: revenueExpenseData } = useQuery<RevenueExpenseItem[]>({
    queryKey: ["revenue-expense-data"],
    queryFn: async () => {
      try {
        const result = await getApi<RevenueExpenseItem[]>`
          SELECT 
            rei.*,
            a.account_name
          FROM revenue_expense_items rei
          JOIN accounts a ON rei.account_id = a.id
          ORDER BY rei.period DESC, a.account_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching revenue and expense data:", error);
        throw error;
      }
    },
  });

  // Fetch cash flow data
  const { data: cashData } = useQuery<CashItem[]>({
    queryKey: ["cash-data"],
    queryFn: async () => {
      try {
        const result = await getApi<CashItem[]>`
          SELECT 
            ci.*,
            a.account_name
          FROM cash_items ci
          JOIN accounts a ON ci.account_id = a.id
          ORDER BY ci.period DESC, a.account_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching cash data:", error);
        throw error;
      }
    },
  });

  // Fetch financial ratios
  const { data: financialRatios } = useQuery<FinancialRatio[]>({
    queryKey: ["financial-ratios"],
    queryFn: async () => {
      try {
        const result = await getApi<FinancialRatio[]>`
          SELECT * 
          FROM financial_ratios 
          ORDER BY period DESC, ratio_type
        `;
        return result;
      } catch (error) {
        console.error("Error fetching financial ratios:", error);
        throw error;
      }
    },
  });

  return {
    accounts,
    journals,
    revenueExpenseAccounts,
    cashAccounts,
    cashFlowItems,
    revenueExpenseData,
    cashData,
    financialRatios,
    isLoadingAccounts,
    isLoadingJournals,
    getJournalLines,
    createJournal: createJournal.mutate,
    updateJournal: updateJournal.mutate,
    deleteJournal: deleteJournal.mutate,
    isCreating: createJournal.isPending,
    isUpdating: updateJournal.isPending,
    isDeleting: deleteJournal.isPending,
  };
}