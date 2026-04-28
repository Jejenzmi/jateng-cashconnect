import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BPJSCacheItem {
  id: string;
  cacheKey: string;
  data: any;
  expiryAt: string;
  createdAt: string;
}

const BPJSCacheManager: React.FC = () => {
  const [cacheItems, setCacheItems] = useState<BPJSCacheItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    cacheKey: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedCacheId, setExpandedCacheId] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  // Fetch cache items
  useEffect(() => {
    const fetchCacheItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache`, {
          params: {
            cacheKey: filters.cacheKey || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            page: currentPage,
            limit: itemsPerPage
          }
        });
        
        setCacheItems(response.data.data.items);
        setTotalPages(Math.ceil(response.data.data.total / itemsPerPage));
      } catch (err) {
        setError('Gagal mengambil data cache BPJS');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCacheItems();
  }, [filters, currentPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset ke halaman pertama saat filter diubah
  };

  const toggleExpand = (id: string) => {
    setExpandedCacheId(expandedCacheId === id ? null : id);
  };

  const deleteCache = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus item cache ini?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache/${id}`);
      alert('Item cache berhasil dihapus');
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache`, {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setCacheItems(response.data.data.items);
    } catch (err) {
      console.error('Error deleting cache:', err);
      alert('Gagal menghapus item cache');
    }
  };

  const clearAllCache = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus semua data cache?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache/all`);
      alert('Semua data cache berhasil dihapus');
      // Refresh data
      setCacheItems([]);
      setTotalPages(0);
    } catch (err) {
      console.error('Error clearing all cache:', err);
      alert('Gagal menghapus semua data cache');
    }
  };

  const cleanupExpired = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache/cleanup`);
      alert(`Cache yang kedaluwarsa berhasil dibersihkan: ${response.data.deletedCount} item dihapus`);
      // Refresh data
      const refreshResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/cache`, {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setCacheItems(refreshResponse.data.data.items);
    } catch (err) {
      console.error('Error cleaning up expired cache:', err);
      alert('Gagal membersihkan cache yang kedaluwarsa');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isExpired = (expiryAt: string) => {
    return new Date(expiryAt) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Manajemen Cache BPJS</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Data cache untuk hasil permintaan ke layanan BPJS
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={cleanupExpired}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Bersihkan Kadaluarsa
              </button>
              <button
                onClick={clearAllCache}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cacheKey" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Cache Key
              </label>
              <input
                type="text"
                id="cacheKey"
                name="cacheKey"
                value={filters.cacheKey}
                onChange={handleFilterChange}
                placeholder="Misal: antrean_status_20230101"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Dari
                </label>
                <input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="dateTo" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                  Sampai
                </label>
                <input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Cache Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cache Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kadaluarsa
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dibuat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cacheItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    className={`${isExpired(item.expiryAt) ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {item.cacheKey}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.expiryAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        isExpired(item.expiryAt) 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isExpired(item.expiryAt) ? 'Kadaluarsa' : 'Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCache(item.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                  
                  {expandedCacheId === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Data Cache</h4>
                            <pre className="text-xs bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-60">
                              {JSON.stringify(item.data, null, 2)}
                            </pre>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Informasi Cache
                            </h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <div>
                                <span className="font-medium">ID:</span> {item.id}
                              </div>
                              <div>
                                <span className="font-medium">Cache Key:</span> {item.cacheKey}
                              </div>
                              <div>
                                <span className="font-medium">Dibuat:</span> {formatDate(item.createdAt)}
                              </div>
                              <div>
                                <span className="font-medium">Kadaluarsa:</span> {formatDate(item.expiryAt)}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span>{' '}
                                <span className={isExpired(item.expiryAt) ? 'text-red-600' : 'text-green-600'}>
                                  {isExpired(item.expiryAt) ? 'Kadaluarsa' : 'Aktif'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> ke{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, cacheItems.length + (currentPage - 1) * itemsPerPage)}
                  </span>{' '}
                  dari <span className="font-medium">{totalPages * itemsPerPage}</span> hasil
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        
        {cacheItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data cache BPJS.
          </div>
        )}
      </div>
    </div>
  );
};

export default BPJSCacheManager;