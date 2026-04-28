import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data purchase request
interface PurchaseRequest {
  id: string;
  pr_number: string;
  department_id: string;
  requested_by: string;
  request_date: string;
  due_date: string;
  notes: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'procured' | 'cancelled';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

interface PurchaseRequestItem {
  id: string;
  pr_id: string;
  item_name: string;
  item_description: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  total_amount: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  updated_at: string;
}

interface BudgetAllocation {
  id: string;
  department_id: string;
  fiscal_year: string;
  category: string;
  allocated_amount: number;
  utilized_amount: number;
  remaining_amount: number;
  created_at: string;
  updated_at: string;
}

export function usePurchaseRequestData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all purchase requests
  const { data: purchaseRequests, isLoading: isLoadingPRs } = useQuery<PurchaseRequest[]>({
    queryKey: ["purchase-requests"],
    queryFn: async () => {
      try {
        const result = await getApi<PurchaseRequest[]>`
          SELECT 
            pr.id,
            pr.pr_number,
            pr.department_id,
            pr.requested_by,
            pr.request_date,
            pr.due_date,
            pr.notes,
            pr.status,
            pr.approved_by,
            pr.approved_at,
            pr.created_at,
            pr.updated_at,
            d.name as department_name,
            u.full_name as requested_by_name
          FROM purchase_requests pr
          LEFT JOIN departments d ON pr.department_id = d.id
          LEFT JOIN users u ON pr.requested_by = u.id
          ORDER BY pr.request_date DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching purchase requests:", error);
        throw error;
      }
    },
  });

  // Fetch all purchase request items
  const { data: prItems, isLoading: isLoadingItems } = useQuery<PurchaseRequestItem[]>({
    queryKey: ["purchase-request-items"],
    queryFn: async () => {
      try {
        const result = await getApi<PurchaseRequestItem[]>`
          SELECT 
            pri.id,
            pri.pr_id,
            pri.item_name,
            pri.item_description,
            pri.quantity,
            pri.unit,
            pri.estimated_price,
            pri.total_amount,
            pri.priority,
            pri.created_at,
            pri.updated_at
          FROM purchase_request_items pri
          ORDER BY pri.pr_id, pri.item_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching purchase request items:", error);
        throw error;
      }
    },
  });

  // Fetch budget allocations for departments
  const { data: budgets } = useQuery<BudgetAllocation[]>({
    queryKey: ["budget-allocations"],
    queryFn: async () => {
      try {
        const result = await getApi<BudgetAllocation[]>`
          SELECT 
            ba.id,
            ba.department_id,
            ba.fiscal_year,
            ba.category,
            ba.allocated_amount,
            ba.utilized_amount,
            ba.remaining_amount,
            ba.created_at,
            ba.updated_at,
            d.name as department_name
          FROM budget_allocations ba
          LEFT JOIN departments d ON ba.department_id = d.id
          ORDER BY ba.fiscal_year DESC, ba.category
        `;
        return result;
      } catch (error) {
        console.error("Error fetching budget allocations:", error);
        throw error;
      }
    },
  });

  // Get items for a specific PR
  const getPrItems = async (prId: string) => {
    try {
      const result = await getApi<PurchaseRequestItem[]>`
        SELECT 
          id,
          pr_id,
          item_name,
          item_description,
          quantity,
          unit,
          estimated_price,
          total_amount,
          priority,
          created_at,
          updated_at
        FROM purchase_request_items
        WHERE pr_id = ${prId}
        ORDER BY item_name
      `;
      return result;
    } catch (error) {
      console.error("Error fetching PR items:", error);
      throw error;
    }
  };

  // Create new purchase request
  const createPurchaseRequest = useMutation({
    mutationFn: async (prData: Omit<PurchaseRequest, 'id' | 'pr_number' | 'status' | 'created_at' | 'updated_at'>) => {
      // Generate PR number
      const numberResult = await getApi<{ pr_number: string }[]>`
        SELECT generate_pr_number() as pr_number
      `;
      const prNumber = numberResult[0].pr_number;

      const result = await getApi<PurchaseRequest[]>`
        INSERT INTO purchase_requests (
          pr_number,
          department_id,
          requested_by,
          request_date,
          due_date,
          notes
        ) VALUES (
          ${prNumber},
          ${prData.department_id},
          ${prData.requested_by},
          ${prData.request_date},
          ${prData.due_date},
          ${prData.notes}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Berhasil Dibuat",
        description: `PR ${data.pr_number} telah ditambahkan ke sistem.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Purchase Request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update purchase request
  const updatePurchaseRequest = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<PurchaseRequest> & { id: string }) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          department_id = ${updateData.department_id},
          requested_by = ${updateData.requested_by},
          request_date = ${updateData.request_date},
          due_date = ${updateData.due_date},
          notes = ${updateData.notes},
          status = ${updateData.status},
          approved_by = ${updateData.approved_by},
          approved_at = ${updateData.approved_at},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Berhasil Diperbarui",
        description: "Data purchase request telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Purchase Request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit purchase request for approval
  const submitForApproval = useMutation({
    mutationFn: async (id: string) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          status = 'pending_approval',
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Diajukan",
        description: "PR telah diajukan untuk persetujuan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Mengajukan PR",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Approve purchase request
  const approveRequest = useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          status = 'approved',
          approved_by = ${approvedBy},
          approved_at = NOW(),
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Disetujui",
        description: "PR telah disetujui oleh atasan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menyetujui PR",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Reject purchase request
  const rejectRequest = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          status = 'rejected',
          notes = CONCAT(notes, ' - Alasan penolakan: ', ${reason || 'Tidak disebutkan'}),
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Ditolak",
        description: "PR telah ditolak.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menolak PR",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add item to purchase request
  const addItem = useMutation({
    mutationFn: async (itemData: Omit<PurchaseRequestItem, 'id' | 'total_amount' | 'created_at' | 'updated_at'>) => {
      const totalAmount = itemData.quantity * itemData.estimated_price;
      const result = await getApi<PurchaseRequestItem[]>`
        INSERT INTO purchase_request_items (
          pr_id,
          item_name,
          item_description,
          quantity,
          unit,
          estimated_price,
          total_amount,
          priority
        ) VALUES (
          ${itemData.pr_id},
          ${itemData.item_name},
          ${itemData.item_description},
          ${itemData.quantity},
          ${itemData.unit},
          ${itemData.estimated_price},
          ${totalAmount},
          ${itemData.priority}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request-items"] });
      toast({
        title: "Item Berhasil Ditambahkan",
        description: "Item telah ditambahkan ke purchase request.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update item in purchase request
  const updateItem = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<PurchaseRequestItem> & { id: string }) => {
      const totalAmount = updateData.quantity && updateData.estimated_price 
        ? updateData.quantity * updateData.estimated_price 
        : undefined;
      
      const result = await getApi<PurchaseRequestItem[]>`
        UPDATE purchase_request_items 
        SET 
          item_name = ${updateData.item_name},
          item_description = ${updateData.item_description},
          quantity = ${updateData.quantity},
          unit = ${updateData.unit},
          estimated_price = ${updateData.estimated_price},
          total_amount = COALESCE(${totalAmount}, total_amount),
          priority = ${updateData.priority},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-request-items"] });
      toast({
        title: "Item Berhasil Diperbarui",
        description: "Item dalam purchase request telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    purchaseRequests,
    prItems,
    budgets,
    isLoadingPRs,
    isLoadingItems,
    getPrItems,
    createPurchaseRequest: createPurchaseRequest.mutate,
    updatePurchaseRequest: updatePurchaseRequest.mutate,
    submitForApproval: submitForApproval.mutate,
    approveRequest: approveRequest.mutate,
    rejectRequest: rejectRequest.mutate,
    addItem: addItem.mutate,
    updateItem: updateItem.mutate,
    isCreatingPR: createPurchaseRequest.isPending,
    isUpdatingPR: updatePurchaseRequest.isPending,
    isSubmittingForApproval: submitForApproval.isPending,
    isApproving: approveRequest.isPending,
    isRejecting: rejectRequest.isPending,
    isAddingItem: addItem.isPending,
    isUpdatingItem: updateItem.isPending,
  };
}

// Fungsi tambahan yang dibutuhkan oleh komponen
export function useCreatePurchaseRequest() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: Omit<PurchaseRequest, 'id' | 'pr_number' | 'status' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<PurchaseRequest[]>`
        INSERT INTO purchase_requests (
          department_id,
          requested_by,
          request_date,
          due_date,
          notes,
          status
        ) VALUES (
          ${data.department_id},
          ${data.requested_by},
          ${data.request_date},
          ${data.due_date},
          ${data.notes},
          'draft'
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Berhasil Dibuat",
        description: "Data purchase request telah disimpan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Purchase Request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createPurchaseRequest: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useApprovePR() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          status = 'approved',
          approved_by = ${approvedBy},
          approved_at = NOW(),
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Berhasil Disetujui",
        description: "Status purchase request telah diperbarui menjadi disetujui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menyetujui Purchase Request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    approvePR: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useRejectPR() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const result = await getApi<PurchaseRequest[]>`
        UPDATE purchase_requests 
        SET 
          status = 'rejected',
          notes = CONCAT(notes, ' [Rejected: ', ${reason || 'No reason provided'}, ']'),
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-requests"] });
      toast({
        title: "Purchase Request Berhasil Ditolak",
        description: "Status purchase request telah diperbarui menjadi ditolak.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menolak Purchase Request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    rejectPR: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function generatePRNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Random 4-digit number for uniqueness
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  return `PR-${year}${month}${day}-${randomNum}`;
}

// Export fungsi usePurchaseRequests untuk kompatibilitas
export function usePurchaseRequests() {
  const hookResult = usePurchaseRequestData();
  return hookResult;
}
