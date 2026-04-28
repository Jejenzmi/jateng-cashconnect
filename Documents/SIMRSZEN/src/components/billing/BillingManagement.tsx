import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  nik: string;
  medicalRecordNumber: string;
}

interface Visit {
  id: string;
  visitNumber: string;
}

interface BillItem {
  id?: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

interface Bill {
  id: string;
  patientId: string;
  patient: Patient;
  visitId?: string;
  visit?: Visit;
  items: BillItem[];
  totalAmount: number;
  discountPercent?: number;
  discountAmount?: number;
  finalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const BillingManagement = () => {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentUpdateId, setPaymentUpdateId] = useState<string | null>(null);
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('unpaid');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  const [formData, setFormData] = useState<Omit<Bill, 'id' | 'patient' | 'visit' | 'totalAmount' | 'finalAmount' | 'createdAt' | 'updatedAt'>>({
    patientId: '',
    visitId: '',
    items: [{ itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
    discountPercent: 0,
    discountAmount: 0,
    paymentStatus: 'unpaid',
    notes: ''
  });
  
  const queryClient = useQueryClient();

  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/patients`);
      return response.data.data as Patient[];
    }
  });

  const { data: visits } = useQuery({
    queryKey: ['visits'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/visits`);
      return response.data.data as Visit[];
    }
  });

  const { data: bills, isLoading, isError } = useQuery({
    queryKey: ['bills'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/billing`);
      return response.data.data as Bill[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (billData: Omit<Bill, 'id' | 'patient' | 'visit' | 'totalAmount' | 'finalAmount' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/billing`, billData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsModalOpen(false);
      setEditingBill(null);
      setFormData({
        patientId: '',
        visitId: '',
        items: [{ itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
        discountPercent: 0,
        discountAmount: 0,
        paymentStatus: 'unpaid',
        notes: ''
      });
      toast.success(editingBill ? 'Tagihan berhasil diperbarui' : 'Tagihan berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving bill:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data tagihan');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...billData }: Bill) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/billing/${id}`, billData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsModalOpen(false);
      setEditingBill(null);
      setFormData({
        patientId: '',
        visitId: '',
        items: [{ itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
        discountPercent: 0,
        discountAmount: 0,
        paymentStatus: 'unpaid',
        notes: ''
      });
      toast.success('Tagihan berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating bill:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data tagihan');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/billing/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      toast.success('Tagihan berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting bill:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data tagihan');
    }
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: async ({ id, paymentStatus, paymentMethod }: { id: string; paymentStatus: string; paymentMethod?: string }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/billing/${id}/payment-status`, {
        paymentStatus,
        paymentMethod
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bills'] });
      setIsPaymentModalOpen(false);
      setPaymentUpdateId(null);
      toast.success('Status pembayaran berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating payment status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status pembayaran');
    }
  });

  useEffect(() => {
    if (editingBill) {
      setFormData({
        patientId: editingBill.patientId,
        visitId: editingBill.visitId || '',
        items: editingBill.items,
        discountPercent: editingBill.discountPercent || 0,
        discountAmount: editingBill.discountAmount || 0,
        paymentStatus: editingBill.paymentStatus,
        paymentMethod: editingBill.paymentMethod || '',
        notes: editingBill.notes || ''
      });
      setIsModalOpen(true);
    }
  }, [editingBill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBill) {
      updateMutation.mutate({ ...editingBill, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      // Jika mengubah quantity atau unitPrice, hitung ulang totalPrice
      ...(field === 'quantity' || field === 'unitPrice') && {
        totalPrice: (typeof updatedItems[index].quantity === 'number' && typeof updatedItems[index].unitPrice === 'number')
          ? (field === 'quantity' ? Number(value) : updatedItems[index].quantity) *
            (field === 'unitPrice' ? Number(value) : updatedItems[index].unitPrice)
          : 0
      }
    };
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items];
      updatedItems.splice(index, 1);
      setFormData({
        ...formData,
        items: updatedItems
      });
    }
  };

  const handleEdit = (bill: Bill) => {
    setEditingBill(bill);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data tagihan ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handlePaymentStatusChange = (id: string) => {
    setPaymentUpdateId(id);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentUpdateId) {
      updatePaymentStatusMutation.mutate({
        id: paymentUpdateId,
        paymentStatus: newPaymentStatus,
        paymentMethod: paymentMethod || undefined
      });
    }
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data tagihan</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Tagihan</h1>
        <button 
          onClick={() => {
            setEditingBill(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Tagihan
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor RM</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Tagihan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diskon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Akhir</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Pembayaran</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bills?.map((bill) => (
                <tr key={bill.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{bill.patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bill.patient.medicalRecordNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {bill.totalAmount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">Rp {(bill.discountAmount || 0).toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold">Rp {bill.finalAmount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${bill.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        bill.paymentStatus === 'partially_paid' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                      {bill.paymentStatus === 'paid' ? 'Lunas' :
                       bill.paymentStatus === 'partially_paid' ? 'Sebagian Dibayar' : 'Belum Dibayar'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(bill)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handlePaymentStatusChange(bill.id)}
                      className="text-orange-600 hover:text-orange-900 mr-3"
                    >
                      Ubah Status
                    </button>
                    <button 
                      onClick={() => handleDelete(bill.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!bills || bills.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data tagihan
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingBill ? 'Edit Tagihan' : 'Tambah Tagihan Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Pasien *
                    </label>
                    <select
                      id="patientId"
                      name="patientId"
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Pasien</option>
                      {patients?.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} ({patient.medicalRecordNumber})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="visitId" className="block text-sm font-medium text-gray-700 mb-1">
                      Kunjungan Terkait
                    </label>
                    <select
                      id="visitId"
                      name="visitId"
                      value={formData.visitId}
                      onChange={(e) => setFormData({...formData, visitId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kunjungan (Opsional)</option>
                      {visits?.map((visit) => (
                        <option key={visit.id} value={visit.id}>
                          {visit.visitNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Tagihan
                    </label>
                    <div className="space-y-3">
                      {formData.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-4">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                              placeholder="Nama item"
                              required
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-3">
                            <input
                              type="number"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="col-span-2">
                            <input
                              type="number"
                              min="0"
                              value={item.totalPrice}
                              readOnly
                              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                            />
                          </div>
                          <div className="col-span-1">
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                              -
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addItem}
                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        + Tambah Item
                      </button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Catatan tambahan tentang tagihan"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="discountPercent" className="block text-sm font-medium text-gray-700 mb-1">
                      Diskon (%)
                    </label>
                    <input
                      type="number"
                      id="discountPercent"
                      name="discountPercent"
                      value={formData.discountPercent || 0}
                      onChange={(e) => setFormData({...formData, discountPercent: parseFloat(e.target.value) || 0})}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Diskon (Rp)
                    </label>
                    <input
                      type="number"
                      id="discountAmount"
                      name="discountAmount"
                      value={formData.discountAmount || 0}
                      onChange={(e) => setFormData({...formData, discountAmount: parseFloat(e.target.value) || 0})}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      Status Pembayaran
                    </label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="unpaid">Belum Dibayar</option>
                      <option value="partially_paid">Sebagian Dibayar</option>
                      <option value="paid">Lunas</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingBill(null);
                      setFormData({
                        patientId: '',
                        visitId: '',
                        items: [{ itemName: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
                        discountPercent: 0,
                        discountAmount: 0,
                        paymentStatus: 'unpaid',
                        notes: ''
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
                    {createMutation.isPending || updateMutation.isPending ? 'Menyimpan...' : (editingBill ? 'Perbarui' : 'Simpan')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ubah Status Pembayaran */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Ubah Status Pembayaran</h2>
              
              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label htmlFor="newPaymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Pembayaran Baru
                  </label>
                  <select
                    id="newPaymentStatus"
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unpaid">Belum Dibayar</option>
                    <option value="partially_paid">Sebagian Dibayar</option>
                    <option value="paid">Lunas</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                    Metode Pembayaran
                  </label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih Metode</option>
                    <option value="cash">Tunai</option>
                    <option value="card">Kartu</option>
                    <option value="transfer">Transfer</option>
                    <option value="insurance">Asuransi</option>
                    <option value="bpjs">BPJS</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setPaymentUpdateId(null);
                      setNewPaymentStatus('unpaid');
                      setPaymentMethod('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updatePaymentStatusMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updatePaymentStatusMutation.isPending ? 'Memperbarui...' : 'Perbarui Status'}
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

export default BillingManagement;