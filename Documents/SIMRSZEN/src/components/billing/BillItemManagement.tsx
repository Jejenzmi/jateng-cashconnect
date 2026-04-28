import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  medicalRecordNumber: string;
}

interface Visit {
  id: string;
  visitNumber: string;
}

interface Bill {
  id: string;
  patientId: string;
  patient: Patient;
  visitId: string;
  visit: Visit;
}

interface BillItem {
  id: string;
  billId: string;
  bill: Bill;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const BillItemManagement = () => {
  const [editingItem, setEditingItem] = useState<BillItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState<Omit<BillItem, 'id' | 'bill' | 'totalPrice' | 'createdAt' | 'updatedAt'>>({
    billId: '',
    itemName: '',
    quantity: 1,
    unitPrice: 0,
    notes: '',
  });
  
  const queryClient = useQueryClient();

  const { data: bills } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/billing`);
      return response.data.data as Bill[];
    }
  });

  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['billItems'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bill-items`);
      return response.data.data as BillItem[];
    }
  });

  // Fungsi untuk menghitung total harga
  useEffect(() => {
    const calculatedTotal = formData.quantity * formData.unitPrice;
    setFormData(prev => ({
      ...prev,
      totalPrice: calculatedTotal
    }));
  }, [formData.quantity, formData.unitPrice]);

  const createMutation = useMutation({
    mutationFn: async (itemData: Omit<BillItem, 'id' | 'bill' | 'totalPrice' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/bill-items`, {
        ...itemData,
        totalPrice: itemData.quantity * itemData.unitPrice
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billItems'] });
      queryClient.invalidateQueries({ queryKey: ['bills'] }); // Refresh bills karena total amount berubah
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        billId: '',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        notes: '',
      });
      toast.success(editingItem ? 'Item tagihan berhasil diperbarui' : 'Item tagihan berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving bill item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data item tagihan');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: BillItem) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/bill-items/${id}`, {
        ...itemData,
        totalPrice: itemData.quantity * itemData.unitPrice
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billItems'] });
      queryClient.invalidateQueries({ queryKey: ['bills'] }); // Refresh bills karena total amount berubah
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        billId: '',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        notes: '',
      });
      toast.success('Item tagihan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating bill item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data item tagihan');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/bill-items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billItems'] });
      queryClient.invalidateQueries({ queryKey: ['bills'] }); // Refresh bills karena total amount berubah
      toast.success('Item tagihan berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting bill item:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data item tagihan');
    }
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        billId: editingItem.billId,
        itemName: editingItem.itemName,
        quantity: editingItem.quantity,
        unitPrice: editingItem.unitPrice,
        notes: editingItem.notes || '',
      });
      setIsModalOpen(true);
    }
  }, [editingItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateMutation.mutate({ ...editingItem, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'unitPrice' ? Number(value) : value
    }));
  };

  const handleEdit = (item: BillItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data item tagihan ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data item tagihan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Item Tagihan</h1>
        <button 
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Item Tagihan
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor Kunjungan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga Satuan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{item.bill.visit.visitNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.bill.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {item.unitPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">Rp {item.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!items || items.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data item tagihan
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingItem ? 'Edit Item Tagihan' : 'Tambah Item Tagihan Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="billId" className="block text-sm font-medium text-gray-700 mb-1">
                      Tagihan *
                    </label>
                    <select
                      id="billId"
                      name="billId"
                      value={formData.billId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Tagihan</option>
                      {bills?.map((bill) => (
                        <option key={bill.id} value={bill.id}>
                          {bill.visit.visitNumber} - {bill.patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Item *
                    </label>
                    <input
                      type="text"
                      id="itemName"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama item tagihan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah *
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga Satuan *
                    </label>
                    <input
                      type="number"
                      id="unitPrice"
                      name="unitPrice"
                      value={formData.unitPrice}
                      onChange={handleChange}
                      min="0"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan tentang item"
                    />
                  </div>
                  
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Harga:</span>
                      <span className="font-bold text-lg">Rp {formData.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setFormData({
                        billId: '',
                        itemName: '',
                        quantity: 1,
                        unitPrice: 0,
                        notes: '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingItem ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillItemManagement;