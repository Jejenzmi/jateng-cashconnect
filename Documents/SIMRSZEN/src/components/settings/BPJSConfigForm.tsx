import React, { useState } from 'react';

interface BPJSConfigFormData {
  name: string;
  consumerId: string;
  consumerSecret: string;
  username: string;
  password: string;
  userKey: string;
  baseUrl: string;
  serviceName: string;
}

interface BPJSConfigFormProps {
  onSubmit: (data: BPJSConfigFormData) => void;
  initialData?: BPJSConfigFormData;
  isLoading?: boolean;
}

const BPJSConfigForm: React.FC<BPJSConfigFormProps> = ({ 
  onSubmit, 
  initialData = {
    name: '',
    consumerId: '',
    consumerSecret: '',
    username: '',
    password: '',
    userKey: '',
    baseUrl: 'https://api.bpjs-kesehatan.go.id',
    serviceName: 'vclaim'
  },
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<BPJSConfigFormData>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama Konfigurasi *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Misal: VClaim Production"
          />
        </div>

        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
            Nama Layanan *
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Misal: vclaim, pcare, antrean"
          />
        </div>

        <div>
          <label htmlFor="consumerId" className="block text-sm font-medium text-gray-700">
            Consumer ID *
          </label>
          <input
            type="text"
            id="consumerId"
            name="consumerId"
            value={formData.consumerId}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="ID Konsumen dari BPJS"
          />
        </div>

        <div>
          <label htmlFor="consumerSecret" className="block text-sm font-medium text-gray-700">
            Consumer Secret *
          </label>
          <input
            type="password"
            id="consumerSecret"
            name="consumerSecret"
            value={formData.consumerSecret}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Secret Konsumen dari BPJS"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username *
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Username akses"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Password akses"
          />
        </div>

        <div>
          <label htmlFor="userKey" className="block text-sm font-medium text-gray-700">
            User Key *
          </label>
          <input
            type="text"
            id="userKey"
            name="userKey"
            value={formData.userKey}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="Kunci pengguna"
          />
        </div>

        <div>
          <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700">
            Base URL *
          </label>
          <input
            type="text"
            id="baseUrl"
            name="baseUrl"
            value={formData.baseUrl}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
            placeholder="URL dasar API"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Menyimpan...' : 'Simpan Konfigurasi'}
        </button>
      </div>
    </form>
  );
};

export default BPJSConfigForm;