import React, { useState, useEffect } from 'react';

interface Module {
  id: string;
  moduleCode: string;
  moduleName: string;
  description: string;
  isActive: boolean;
}

interface ModulePermission {
  id: string;
  permissionCode: string;
  permissionName: string;
  description: string;
  moduleId: string;
}

interface Role {
  id: string;
  roleName: string;
  description: string;
  isActive: boolean;
}

interface RolePermission {
  id: string;
  roleId: string;
  modulePermissionId: string;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const ModuleManagement: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [activeTab, setActiveTab] = useState('modules');
  
  // States for form inputs
  const [moduleName, setModuleName] = useState('');
  const [moduleCode, setModuleCode] = useState('');
  const [moduleDescription, setModuleDescription] = useState('');
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  // Fetch data from API
  useEffect(() => {
    // Fetch modules
    fetch('/api/modules/modules')
      .then(res => res.json())
      .then(data => setModules(data.data))
      .catch(err => console.error('Error fetching modules:', err));

    // Fetch permissions
    fetch('/api/modules/module-permissions')
      .then(res => res.json())
      .then(data => setPermissions(data.data))
      .catch(err => console.error('Error fetching permissions:', err));

    // Fetch roles
    fetch('/api/modules/roles')
      .then(res => res.json())
      .then(data => setRoles(data.data))
      .catch(err => console.error('Error fetching roles:', err));

    // Fetch role permissions
    fetch('/api/modules/role-permissions')
      .then(res => res.json())
      .then(data => setRolePermissions(data.data))
      .catch(err => console.error('Error fetching role permissions:', err));
  }, []);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('/api/modules/modules', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        moduleCode,
        moduleName,
        description: moduleDescription
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setModules([...modules, data.data]);
        setModuleCode('');
        setModuleName('');
        setModuleDescription('');
        alert('Module added successfully');
      } else {
        alert(data.message || 'Failed to add module');
      }
    })
    .catch(err => {
      console.error('Error adding module:', err);
      alert('Error adding module');
    });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    
    fetch('/api/modules/roles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roleName,
        description: roleDescription
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setRoles([...roles, data.data]);
        setRoleName('');
        setRoleDescription('');
        alert('Role added successfully');
      } else {
        alert(data.message || 'Failed to add role');
      }
    })
    .catch(err => {
      console.error('Error adding role:', err);
      alert('Error adding role');
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Modul dan Hak Akses</h1>
      
      <div className="flex border-b mb-6">
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'modules' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('modules')}
        >
          Modul
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'permissions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('permissions')}
        >
          Izin Modul
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'roles' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('roles')}
        >
          Peran
        </button>
        <button 
          className={`px-4 py-2 font-medium ${activeTab === 'role-permissions' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('role-permissions')}
        >
          Izin Peran
        </button>
      </div>
      
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tambah Modul Baru</h2>
            <form onSubmit={handleAddModule}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Kode Modul</label>
                <input
                  type="text"
                  value={moduleCode}
                  onChange={(e) => setModuleCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: PATIENT, OUTPATIENT, PHARMACY"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Modul</label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: Manajemen Pasien"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={moduleDescription}
                  onChange={(e) => setModuleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Deskripsi modul"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tambah Modul
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Daftar Modul</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {modules.map((module) => (
                    <tr key={module.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{module.moduleCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{module.moduleName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          module.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {module.isActive ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Tambah Peran Baru</h2>
            <form onSubmit={handleAddRole}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nama Peran</label>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Contoh: Administrator, Staff Medis"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Deskripsi</label>
                <textarea
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Deskripsi peran"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tambah Peran
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Daftar Peran</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{role.roleName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{role.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {role.isActive ? 'Aktif' : 'Non-Aktif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'permissions' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Izin Modul</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Izin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Izin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {permissions.map((permission) => {
                  const module = modules.find(m => m.id === permission.moduleId);
                  return (
                    <tr key={permission.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{permission.permissionCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{permission.permissionName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{module?.moduleName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{permission.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'role-permissions' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Izin Peran</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peran</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Izin Modul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akses</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rolePermissions.map((rp) => {
                  const role = roles.find(r => r.id === rp.roleId);
                  const permission = permissions.find(p => p.id === rp.modulePermissionId);
                  const module = modules.find(m => m.id === permission?.moduleId);
                  
                  return (
                    <tr key={rp.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{role?.roleName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{permission?.permissionName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{module?.moduleName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {rp.canView && <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">View</span>}
                          {rp.canCreate && <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Create</span>}
                          {rp.canUpdate && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Update</span>}
                          {rp.canDelete && <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Delete</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleManagement;