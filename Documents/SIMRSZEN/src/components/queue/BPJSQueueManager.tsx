import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BPJSQueueItem {
  id: string;
  serviceType: string;
  endpoint: string;
  method: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attempts: number;
  lastAttemptAt: string | null;
  nextAttemptAt: string | null;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

const BPJSQueueManager: React.FC = () => {
  const [queueItems, setQueueItems] = useState<BPJSQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    serviceType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  
  const itemsPerPage = 10;

  // Fetch queue items
  useEffect(() => {
    const fetchQueueItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/queue`, {
          params: {
            serviceType: filters.serviceType || undefined,
            status: filters.status || undefined,
            dateFrom: filters.dateFrom || undefined,
            dateTo: filters.dateTo || undefined,
            page: currentPage,
            limit: itemsPerPage
          }
        });
        
        setQueueItems(response.data.data.items);
        setTotalPages(Math.ceil(response.data.data.total / itemsPerPage));
      } catch (err) {
        setError('Gagal mengambil antrian sinkronisasi BPJS');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueueItems();
  }, [filters, currentPage]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset ke halaman pertama saat filter diubah
  };

  const toggleExpand = (id: string) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const retryJob = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin mencoba ulang tugas ini?')) {
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/bpjs/queue/${id}/retry`);
      alert('Permintaan retry berhasil dikirim');
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/queue`, {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setQueueItems(response.data.data.items);
    } catch (err) {
      console.error('Error retrying job:', err);
      alert('Gagal mengirim permintaan retry');
    }
  };

  const deleteJob = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tugas ini dari antrian?')) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/bpjs/queue/${id}`);
      alert('Tugas berhasil dihapus dari antrian');
      // Refresh data
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/bpjs/queue`, {
        params: {
          page: currentPage,
          limit: itemsPerPage
        }
      });
      setQueueItems(response.data.data.items);
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Gagal menghapus tugas dari antrian');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h3 className="text-lg leading-6 font-medium text-gray-900">Manajemen Antrian Sinkronisasi BPJS</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Daftar tugas sinkronisasi data ke layanan BPJS
          </p>
        </div>
        
        {/* Filter Section */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="serviceType" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Tipe Layanan
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={filters.serviceType}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Semua</option>
                <option value="antrean">Antrean</option>
                <option value="pcare">PCare</option>
                <option value="icare">iCare</option>
                <option value="medical_record">Medical Record</option>
                <option value="satusehat">SATU SEHAT</option>
                <option value="idrg">IDRG</option>
                <option value="vclaim">VClaim</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 uppercase tracking-wide">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Semua</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
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
        
        {/* Queue Items Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Layanan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Endpoint
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percobaan
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Terakhir
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {queueItems.map((item) => (
                <React.Fragment key={item.id}>
                  <tr 
                    className={`${item.status === 'failed' ? 'bg-red-50' : ''} cursor-pointer hover:bg-gray-50`}
                    onClick={() => toggleExpand(item.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {item.serviceType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.endpoint}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.attempts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.lastAttemptAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.status === 'failed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            retryJob(item.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Coba Lagi
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(item.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                  
                  {expandedItemId === item.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Payload</h4>
                            <pre className="text-xs bg-gray-800 text-green-400 p-4 rounded overflow-auto max-h-40">
                              {JSON.stringify(item.payload, null, 2)}
                            </pre>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Informasi Tambahan
                            </h4>
                            <div className="text-sm text-gray-700 space-y-2">
                              <div>
                                <span className="font-medium">Dibuat:</span> {formatDate(item.createdAt)}
                              </div>
                              <div>
                                <span className="font-medium">Diperbarui:</span> {formatDate(item.updatedAt)}
                              </div>
                              {item.nextAttemptAt && (
                                <div>
                                  <span className="font-medium">Coba Lagi:</span> {formatDate(item.nextAttemptAt)}
                                </div>
                              )}
                              {item.error && (
                                <div>
                                  <span className="font-medium text-red-600">Error:</span> {item.error}
                                </div>
                              )}
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
                    {Math.min(currentPage * itemsPerPage, queueItems.length + (currentPage - 1) * itemsPerPage)}
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
        
        {queueItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada tugas dalam antrian sinkronisasi.
          </div>
        )}
      </div>
    </div>
  );
};

export default BPJSQueueManager;