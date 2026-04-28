import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
}

interface InventoryItem {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minStock: number;
  supplierId: string;
  supplier: Supplier;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const InventoryItemManagement = () => {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockUpdateId, setStockUpdateId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'supplier' | 'createdAt' | 'updatedAt'>>({
    name: '',
    code: '',
    category: '',
    unit: '',
    price: 0,
    stock: 0,
    minStock: 0,
    supplierId: '',
    description: '',
    isActive: true,
  });
  
  const [stockData, setStockData] = useState({
    quantity: 0,
    type: 'in' as 'in' | 'out',
  });
  
  const queryClient = useQueryClient();

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);
      return response.data.data as Supplier[];
    }
  });

  const { data: inventoryItems, isLoading, isError } = useQuery({
    queryKey: ['inventoryItems'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/inventory-items`);
      return response.data.data as InventoryItem[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (itemData: Omit<InventoryItem, 'id' | 'supplier' | 'createdAt' | 'updatedAt'>) => {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/inventory-items`, itemData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        code: '',
        category: '',
        unit: '',
        price: 0,
        stock: 0,
        minStock: 0,
        supplierId: '',
        description: '',
        isActive: true,
      });
      toast.success(editingItem ? 'Item inventaris berhasil diperbarui' : 'Item inventaris berhasil ditambahkan');
    },
    onError: (error: any) => {
      console.error('Error saving inventory item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal menyimpan data item inventaris');
      toast.error(errorMessage);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...itemData }: InventoryItem) => {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/inventory-items/${id}`, itemData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({
        name: '',
        code: '',
        category: '',
        unit: '',
        price: 0,
        stock: 0,
        minStock: 0,
        supplierId: '',
        description: '',
        isActive: true,
      });
      toast.success('Item inventaris berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('Error updating inventory item:', error);
      const errorMessage = error.response?.data?.message || 
                          (error.response?.data?.errors?.map((e: any) => e.message).join(', ') || 
                          'Gagal memperbarui data item inventaris');
      toast.error(errorMessage);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/inventory-items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      toast.success('Item inventaris berhasil dihapus');
    },
    onError: (error: any) => {
      console.error('Error deleting inventory item:', error);
      toast.error(error.response?.data?.message || 'Gagal menghapus data item inventaris');
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ id, quantity, type }: { id: string; quantity: number; type: 'in' | 'out' }) => {
      const response = await axios.patch(`${import.meta.env.VITE_API_URL}/inventory-items/${id}/stock`, {
        quantity,
        type
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      setIsStockModalOpen(false);
      setStockUpdateId(null);
      setStockData({
        quantity: 0,
        type: 'in'
      });
      toast.success(stockData.type === 'in' ? 'Stok berhasil ditambahkan' : 'Stok berhasil dikurangi');
    },
    onError: (error: any) => {
      console.error('Error updating stock:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui stok item');
    }
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        code: editingItem.code,
        category: editingItem.category,
        unit: editingItem.unit,
        price: editingItem.price,
        stock: editingItem.stock,
        minStock: editingItem.minStock,
        supplierId: editingItem.supplierId,
        description: editingItem.description || '',
        isActive: editingItem.isActive,
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

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stockUpdateId) {
      updateStockMutation.mutate({
        id: stockUpdateId,
        quantity: stockData.quantity,
        type: stockData.type
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : 
               type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    
    setStockData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Yakin ingin menghapus data item inventaris ini? Data akan dihapus secara permanen.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleStockUpdate = (id: string) => {
    setStockUpdateId(id);
    setIsStockModalOpen(true);
  };

  if (isError) return <div className="p-4 text-red-500">Error saat memuat data item inventaris</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Item Inventaris</h1>
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
          Tambah Item Inventaris
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventoryItems?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{item.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${item.stock <= item.minStock ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                      {item.stock} {item.unit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.supplier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.isActive ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleStockUpdate(item.id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Stok
                    </button>
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
          
          {(!inventoryItems || inventoryItems.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              Belum ada data item inventaris
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
                {editingItem ? 'Edit Item Inventaris' : 'Tambah Item Inventaris Baru'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Item *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama item inventaris"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Item *
                    </label>
                    <input
                      type="text"
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Kode unik item"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Kategori</option>
                      <option value="obat">Obat</option>
                      <option value="alat-medis">Alat Medis</option>
                      <option value="bahan-habis-pakai">Bahan Habis Pakai</option>
                      <option value="atk">Alat Tulis Kantor</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                      Satuan *
                    </label>
                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Satuan</option>
                      <option value="buah">Buah</option>
                      <option value="kotak">Kotak</option>
                      <option value="pack">Pack</option>
                      <option value="tablet">Tablet</option>
                      <option value="botol">Botol</option>
                      <option value="strip">Strip</option>
                      <option value="box">Box</option>
                      <option value="roll">Roll</option>
                      <option value="set">Set</option>
                      <option value="unit">Unit</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Harga per unit"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stok Awal *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jumlah stok awal"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                      Stok Minimum *
                    </label>
                    <input
                      type="number"
                      id="minStock"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Jumlah stok minimum"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier *
                    </label>
                    <select
                      id="supplierId"
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Supplier</option>
                      {suppliers?.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} - {supplier.contactPerson}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi item"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isActive: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      Aktif
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setFormData({
                        name: '',
                        code: '',
                        category: '',
                        unit: '',
                        price: 0,
                        stock: 0,
                        minStock: 0,
                        supplierId: '',
                        description: '',
                        isActive: true,
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

      {/* Modal Pembaruan Stok */}
      {isStockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Pembaruan Stok Item</h2>
              
              <form onSubmit={handleStockSubmit}>
                <div className="mb-4">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Jenis Mutasi
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={stockData.type}
                    onChange={handleStockChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in">Masuk (Tambah Stok)</option>
                    <option value="out">Keluar (Kurangi Stok)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={stockData.quantity}
                    onChange={handleStockChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jumlah stok"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStockModalOpen(false);
                      setStockUpdateId(null);
                      setStockData({
                        quantity: 0,
                        type: 'in'
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updateStockMutation.isPending}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updateStockMutation.isPending ? 'Memproses...' : 'Perbarui Stok'}
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

export default InventoryItemManagement;