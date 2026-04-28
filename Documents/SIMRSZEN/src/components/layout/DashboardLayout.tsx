import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Package, 
  FileText, 
  CreditCard, 
  Activity, 
  Settings, 
  Menu,
  X,
  User,
  LogOut,
  Building,
  Shield
} from 'lucide-react';
import { useModuleVisibility, FaskesTypeSelector } from '../shared/ModuleVisibilityManager';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const { visibleModules } = useModuleVisibility();

  // Mapping icons to Lucide React icons
  const getIconComponent = (iconName: string) => {
    switch(iconName.toLowerCase()) {
      case 'layoutdashboard':
      case 'dashboard':
        return LayoutDashboard;
      case 'users':
      case 'user':
        return Users;
      case 'stethoscope':
        return Stethoscope;
      case 'package':
        return Package;
      case 'filetext':
      case 'file':
        return FileText;
      case 'receipt':
      case 'creditcard':
      case 'billing':
        return CreditCard;
      case 'activity':
      case 'monitor':
        return Activity;
      case 'settings':
        return Settings;
      case 'handheart':
        return User; // Placeholder until we have the right icon
      case 'filebarchart':
        return FileText; // Placeholder until we have the right icon
      case 'building':
        return Building;
      case 'shield':
        return Shield;
      default:
        return LayoutDashboard;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold flex items-center">
              <LayoutDashboard className="mr-2" size={24} />
              SIMRS ZEN
            </h1>
          ) : (
            <LayoutDashboard className="mx-auto" size={24} />
          )}
        </div>
        
        <nav className="mt-5">
          <ul>
            <li>
              <Link 
                to="/dashboard" 
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/dashboard' ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                <LayoutDashboard size={20} />
                {sidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            
            {/* Render menu berdasarkan modul yang terlihat */}
            {visibleModules.map(module => 
              module.features
                .filter(feature => feature.enabled) // Hanya fitur yang aktif
                .map(feature => {
                  const IconComponent = getIconComponent(feature.icon);
                  return (
                    <li key={feature.id}>
                      <Link 
                        to={feature.route} 
                        className={`flex items-center px-4 py-3 ${
                          location.pathname.startsWith(feature.route) ? 'bg-gray-900' : 'hover:bg-gray-700'
                        }`}
                      >
                        <IconComponent size={20} />
                        {sidebarOpen && <span className="ml-3">{feature.name}</span>}
                      </Link>
                    </li>
                  );
                })
            )}
            
            <li>
              <Link 
                to="/profile" 
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/profile' ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                <User size={20} />
                {sidebarOpen && <span className="ml-3">Profil</span>}
              </Link>
            </li>
            
            <li>
              <Link 
                to="/settings" 
                className={`flex items-center px-4 py-3 ${
                  location.pathname === '/settings' ? 'bg-gray-900' : 'hover:bg-gray-700'
                }`}
              >
                <Settings size={20} />
                {sidebarOpen && <span className="ml-3">Pengaturan</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <div className="ml-4">
                <FaskesTypeSelector />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Cari..."
                  type="search"
                />
              </div>
              
              <button className="bg-gray-200 p-1 rounded-full text-gray-700 hover:text-gray-900 focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              
              <div className="flex items-center">
                <img className="h-8 w-8 rounded-full" src="/placeholder-avatar.jpg" alt="User avatar" />
                <span className="ml-2 hidden md:block">Admin SIMRS</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;