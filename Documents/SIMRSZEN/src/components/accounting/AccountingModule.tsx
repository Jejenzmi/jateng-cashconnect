import React, { useState, useEffect } from 'react';

interface Account {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: string;
  accountGroup: string;
  description?: string;
  normalBalance: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
}

interface Transaction {
  id: string;
  transactionNumber: string;
  transactionDate: Date;
  description: string;
  reference?: string;
  posted: boolean;
  postedAt?: Date;
  journalType: string;
  createdAt: Date;
}

interface TransactionDetail {
  id: string;
  accountId: string;
  debitAmount: number;
  creditAmount: number;
  description?: string;
}

const AccountingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chart' | 'transactions' | 'reports' | 'depreciation'>('chart');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newAccount, setNewAccount] = useState({
    accountCode: '',
    accountName: '',
    accountType: 'ASSET',
    accountGroup: '',
    description: '',
    normalBalance: 'DEBIT',
    parentId: ''
  });
  const [newTransaction, setNewTransaction] = useState({
    transactionDate: new Date().toISOString().split('T')[0],
    description: '',
    reference: '',
    journalType: 'SA',
    details: [] as Array<{
      accountId: string;
      debitAmount: number;
      creditAmount: number;
      description: string;
    }>,
    currentDetail: {
      accountId: '',
      debitAmount: 0,
      creditAmount: 0,
      description: ''
    }
  });

  useEffect(() => {
    // Simulasi pengambilan data dari API
    setTimeout(() => {
      setAccounts([
        {
          id: 'acc-1',
          accountCode: '1100',
          accountName: 'Kas',
          accountType: 'ASSET',
          accountGroup: 'Current Asset',
          description: 'Kas perusahaan',
          normalBalance: 'DEBIT',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'acc-2',
          accountCode: '1200',
          accountName: 'Piutang Usaha',
          accountType: 'ASSET',
          accountGroup: 'Current Asset',
          description: 'Piutang dari pelanggan',
          normalBalance: 'DEBIT',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'acc-3',
          accountCode: '2100',
          accountName: 'Utang Usaha',
          accountType: 'LIABILITY',
          accountGroup: 'Current Liability',
          description: 'Utang kepada supplier',
          normalBalance: 'CREDIT',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'acc-4',
          accountCode: '4100',
          accountName: 'Pendapatan Operasional',
          accountType: 'REVENUE',
          accountGroup: 'Operating Revenue',
          description: 'Pendapatan dari layanan medis',
          normalBalance: 'CREDIT',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'acc-5',
          accountCode: '5100',
          accountName: 'Beban Operasional',
          accountType: 'EXPENSE',
          accountGroup: 'Operating Expense',
          description: 'Beban operasional rumah sakit',
          normalBalance: 'DEBIT',
          isActive: true,
          createdAt: new Date()
        }
      ]);

      setTransactions([
        {
          id: 'trx-1',
          transactionNumber: 'TRX-001',
          transactionDate: new Date(),
          description: 'Penerimaan pendapatan jasa medis',
          posted: true,
          journalType: 'SA',
          createdAt: new Date()
        },
        {
          id: 'trx-2',
          transactionNumber: 'TRX-002',
          transactionDate: new Date(),
          description: 'Pembelian perlengkapan medis',
          posted: false,
          journalType: 'SA',
          createdAt: new Date()
        }
      ]);
    }, 500);
  }, []);

  const handleAddAccount = () => {
    if (!newAccount.accountCode || !newAccount.accountName) {
      alert('Kode dan nama akun wajib diisi');
      return;
    }

    const accountToAdd: Account = {
      id: `acc-${Date.now()}`,
      ...newAccount,
      isActive: true,
      createdAt: new Date()
    };

    setAccounts([...accounts, accountToAdd]);
    setNewAccount({
      accountCode: '',
      accountName: '',
      accountType: 'ASSET',
      accountGroup: '',
      description: '',
      normalBalance: 'DEBIT',
      parentId: ''
    });
  };

  const handleAddTransactionDetail = () => {
    if (newTransaction.currentDetail.accountId && 
        (newTransaction.currentDetail.debitAmount > 0 || newTransaction.currentDetail.creditAmount > 0)) {
      
      const detailToAdd = { ...newTransaction.currentDetail };
      
      setNewTransaction({
        ...newTransaction,
        details: [...newTransaction.details, detailToAdd],
        currentDetail: {
          accountId: '',
          debitAmount: 0,
          creditAmount: 0,
          description: ''
        }
      });
    }
  };

  const handleRemoveTransactionDetail = (index: number) => {
    const updatedDetails = [...newTransaction.details];
    updatedDetails.splice(index, 1);
    setNewTransaction({
      ...newTransaction,
      details: updatedDetails
    });
  };

  const handleCreateTransaction = () => {
    if (newTransaction.details.length === 0) {
      alert('Minimal satu detail transaksi harus diisi');
      return;
    }

    // Validasi bahwa total debit = total credit
    const totalDebit = newTransaction.details.reduce((sum, detail) => sum + detail.debitAmount, 0);
    const totalCredit = newTransaction.details.reduce((sum, detail) => sum + detail.creditAmount, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      alert(`Transaksi tidak balance: Debit ${totalDebit} vs Credit ${totalCredit}`);
      return;
    }

    const transactionToAdd: Transaction = {
      id: `trx-${Date.now()}`,
      transactionNumber: `TRX-${transactions.length + 1}`,
      transactionDate: new Date(newTransaction.transactionDate),
      description: newTransaction.description,
      reference: newTransaction.reference,
      posted: false,
      journalType: newTransaction.journalType,
      createdAt: new Date()
    };

    setTransactions([...transactions, transactionToAdd]);
    
    // Reset form
    setNewTransaction({
      transactionDate: new Date().toISOString().split('T')[0],
      description: '',
      reference: '',
      journalType: 'SA',
      details: [],
      currentDetail: {
        accountId: '',
        debitAmount: 0,
        creditAmount: 0,
        description: ''
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Modul Akuntansi (PSAK Compliant)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manajemen akuntansi sesuai standar PSAK (Pernyataan Standar Akuntansi Keuangan)
          </p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-4">
            {[
              { id: 'chart', name: 'Chart of Accounts' },
              { id: 'transactions', name: 'Transaksi' },
              { id: 'reports', name: 'Laporan Keuangan' },
              { id: 'depreciation', name: 'Depresiasi' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {/* Chart of Accounts Tab */}
          {activeTab === 'chart' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Tambah Akun Baru</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="account-code" className="block text-sm font-medium text-gray-700">
                      Kode Akun
                    </label>
                    <input
                      type="text"
                      id="account-code"
                      value={newAccount.accountCode}
                      onChange={(e) => setNewAccount({...newAccount, accountCode: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Contoh: 1100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="account-name" className="block text-sm font-medium text-gray-700">
                      Nama Akun
                    </label>
                    <input
                      type="text"
                      id="account-name"
                      value={newAccount.accountName}
                      onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nama akun"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="account-type" className="block text-sm font-medium text-gray-700">
                      Tipe Akun
                    </label>
                    <select
                      id="account-type"
                      value={newAccount.accountType}
                      onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="ASSET">ASET</option>
                      <option value="LIABILITY">KEWAJIBAN</option>
                      <option value="EQUITY">EKUITAS</option>
                      <option value="REVENUE">PENDAPATAN</option>
                      <option value="EXPENSE">BEBAN</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="normal-balance" className="block text-sm font-medium text-gray-700">
                      Normal Balance
                    </label>
                    <select
                      id="normal-balance"
                      value={newAccount.normalBalance}
                      onChange={(e) => setNewAccount({...newAccount, normalBalance: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="DEBIT">DEBIT</option>
                      <option value="CREDIT">KREDIT</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="account-group" className="block text-sm font-medium text-gray-700">
                      Grup Akun
                    </label>
                    <input
                      type="text"
                      id="account-group"
                      value={newAccount.accountGroup}
                      onChange={(e) => setNewAccount({...newAccount, accountGroup: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Contoh: Current Asset"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      rows={2}
                      value={newAccount.description}
                      onChange={(e) => setNewAccount({...newAccount, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Deskripsi akun"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddAccount}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Tambah Akun
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Daftar Akun</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {accounts.map((account) => (
                      <li key={account.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                              {account.accountCode} - {account.accountName}
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {account.isActive ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>Tipe: {account.accountType}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <span>Grup: {account.accountGroup}</span>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>Normal: {account.normalBalance}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div>
              <div className="mb-8">
                <h4 className="text-md font-medium text-gray-900 mb-4">Buat Transaksi Baru</h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="transaction-date" className="block text-sm font-medium text-gray-700">
                      Tanggal Transaksi
                    </label>
                    <input
                      type="date"
                      id="transaction-date"
                      value={newTransaction.transactionDate}
                      onChange={(e) => setNewTransaction({...newTransaction, transactionDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="journal-type" className="block text-sm font-medium text-gray-700">
                      Tipe Jurnal
                    </label>
                    <select
                      id="journal-type"
                      value={newTransaction.journalType}
                      onChange={(e) => setNewTransaction({...newTransaction, journalType: e.target.value})}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="SA">Simple Journal (SA)</option>
                      <option value="AJ">Adjusting Journal (AJ)</option>
                      <option value="CL">Closing Journal (CL)</option>
                    </select>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="transaction-description" className="block text-sm font-medium text-gray-700">
                      Deskripsi Transaksi
                    </label>
                    <input
                      type="text"
                      id="transaction-description"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Deskripsi transaksi"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                      Referensi
                    </label>
                    <input
                      type="text"
                      id="reference"
                      value={newTransaction.reference}
                      onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Nomor faktur, kwitansi, dll"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">Detail Transaksi</h5>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                    <div>
                      <label htmlFor="detail-account" className="block text-xs font-medium text-gray-500">
                        Akun
                      </label>
                      <select
                        id="detail-account"
                        value={newTransaction.currentDetail.accountId}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction, 
                          currentDetail: {
                            ...newTransaction.currentDetail,
                            accountId: e.target.value
                          }
                        })}
                        className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Pilih Akun</option>
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>
                            {acc.accountCode} - {acc.accountName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="debit-amount" className="block text-xs font-medium text-gray-500">
                        Jumlah Debit
                      </label>
                      <input
                        type="number"
                        id="debit-amount"
                        value={newTransaction.currentDetail.debitAmount || ''}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction, 
                          currentDetail: {
                            ...newTransaction.currentDetail,
                            debitAmount: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="credit-amount" className="block text-xs font-medium text-gray-500">
                        Jumlah Kredit
                      </label>
                      <input
                        type="number"
                        id="credit-amount"
                        value={newTransaction.currentDetail.creditAmount || ''}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction, 
                          currentDetail: {
                            ...newTransaction.currentDetail,
                            creditAmount: parseFloat(e.target.value) || 0
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="detail-desc" className="block text-xs font-medium text-gray-500">
                        Deskripsi
                      </label>
                      <input
                        type="text"
                        id="detail-desc"
                        value={newTransaction.currentDetail.description}
                        onChange={(e) => setNewTransaction({
                          ...newTransaction, 
                          currentDetail: {
                            ...newTransaction.currentDetail,
                            description: e.target.value
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Deskripsi"
                      />
                    </div>
                    
                    <div className="sm:col-span-4">
                      <button
                        type="button"
                        onClick={handleAddTransactionDetail}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500"
                      >
                        Tambah Detail
                      </button>
                    </div>
                  </div>
                  
                  {newTransaction.details.length > 0 && (
                    <div className="mt-4">
                      <h6 className="text-xs font-medium text-gray-500 mb-2">Daftar Detail:</h6>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Akun
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Debit
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kredit
                              </th>
                              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deskripsi
                              </th>
                              <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {newTransaction.details.map((detail, index) => {
                              const account = accounts.find(acc => acc.id === detail.accountId);
                              return (
                                <tr key={index}>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {account ? `${account.accountCode} - ${account.accountName}` : 'Akun tidak ditemukan'}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {detail.debitAmount.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {detail.creditAmount.toFixed(2)}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {detail.description}
                                  </td>
                                  <td className="px-3 py-2 text-right text-sm font-medium">
                                    <button
                                      onClick={() => handleRemoveTransactionDetail(index)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Hapus
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-3">
                        <div className="text-sm">
                          Total Debit: <span className="font-medium">
                            {newTransaction.details.reduce((sum, d) => sum + d.debitAmount, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-sm">
                          Total Kredit: <span className="font-medium">
                            {newTransaction.details.reduce((sum, d) => sum + d.creditAmount, 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleCreateTransaction}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Buat Transaksi
                    </button>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Daftar Transaksi</h4>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <li key={transaction.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                              {transaction.transactionNumber} - {transaction.description}
                            </div>
                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                transaction.posted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {transaction.posted ? 'Diposting' : 'Belum Diposting'}
                              </span>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {transaction.journalType}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <div className="mr-6 flex items-center text-sm text-gray-500">
                                <span>Tanggal: {transaction.transactionDate.toLocaleDateString()}</span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                {transaction.reference && <span>Ref: {transaction.reference}</span>}
                              </div>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span>Dibuat: {transaction.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Neraca (Balance Sheet)</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">PSAK 1</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Generate Laporan
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Laba Rugi (Income Statement)</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">PSAK 23</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Generate Laporan
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Arus Kas (Cash Flow)</dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-gray-900">PSAK 24</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Generate Laporan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Laporan Tersedia Lainnya</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Ekuitas Pemilik (Statement of Equity)</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 1
                            </span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Catatan Atas Laporan Keuangan (Notes)</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 1
                            </span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Analisis Perubahan dalam Nilai Wajar</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 50
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Laporan Segmentasi (Segment Reporting)</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 5
                            </span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Laporan Interim (Interim Reporting)</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 17
                            </span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-900 truncate">Laporan Keuangan Konsolidasi</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              PSAK 7
                            </span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Depreciation Tab */}
          {activeTab === 'depreciation' && (
            <div>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-indigo-600 truncate">Mesin Peralatan Medis A</div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="mr-6 flex items-center text-sm text-gray-500">
                            <span>Nilai Perolehan: Rp 500.000.000</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span>Umur: 10 Tahun</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>Nilai Residu: Rp 50.000.000</span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Akumulasi</p>
                          <p className="text-sm font-medium">Rp 112.500.000</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Nilai Buku</p>
                          <p className="text-sm font-medium">Rp 387.500.000</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Depresiasi/bln</p>
                          <p className="text-sm font-medium">Rp 3.750.000</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-indigo-600 truncate">Gedung Rawat Inap</div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Aktif
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="mr-6 flex items-center text-sm text-gray-500">
                            <span>Nilai Perolehan: Rp 2.500.000.000</span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span>Umur: 20 Tahun</span>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>Nilai Residu: Rp 250.000.000</span>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Akumulasi</p>
                          <p className="text-sm font-medium">Rp 375.000.000</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Nilai Buku</p>
                          <p className="text-sm font-medium">Rp 2.125.000.000</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Depresiasi/bln</p>
                          <p className="text-sm font-medium">Rp 9.375.000</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 bg-white shadow sm:rounded-lg p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Parameter Depresiasi</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Metode Depresiasi</label>
                    <select className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>Garislurus (Straight Line)</option>
                      <option>Saldo Menurun (Declining Balance)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Frekuensi Perhitungan</label>
                    <select className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option>Bulanan</option>
                      <option>Tahunan</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Hitung Depresiasi Bulan Ini
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountingModule;