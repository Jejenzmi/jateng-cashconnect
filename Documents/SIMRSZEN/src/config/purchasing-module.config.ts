/**
 * Konfigurasi Modul Purchasing
 * Berisi konfigurasi fitur-fitur untuk manajemen pembelian, supplier, dan purchase order
 */

import { ModuleConfig } from './modules.config';

export const purchasingModuleConfig: ModuleConfig = {
  moduleName: 'Purchasing',
  moduleCode: 'PURCHASING',
  features: [
    {
      id: 'supplier-management',
      name: 'Manajemen Supplier',
      description: 'Manajemen data supplier dan vendor',
      route: '/purchasing/suppliers',
      icon: 'Truck',
      enabled: true
    },
    {
      id: 'purchase-request',
      name: 'Permintaan Pembelian',
      description: 'Pembuatan dan manajemen permintaan pembelian',
      route: '/purchasing/requests',
      icon: 'FileText',
      enabled: true
    },
    {
      id: 'purchase-order',
      name: 'Purchase Order',
      description: 'Pembuatan dan manajemen purchase order',
      route: '/purchasing/orders',
      icon: 'ShoppingCart',
      enabled: true
    },
    {
      id: 'procurement-tracking',
      name: 'Pelacakan Pengadaan',
      description: 'Pelacakan status dan progres pengadaan',
      route: '/purchasing/tracking',
      icon: 'Package',
      enabled: true
    }
  ],
  permissions: [
    {
      id: 'supplier_management_access',
      name: 'Akses Manajemen Supplier',
      description: 'Akses ke fitur manajemen supplier',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'purchase_request_access',
      name: 'Akses Permintaan Pembelian',
      description: 'Akses ke fitur permintaan pembelian',
      actions: ['view', 'create', 'update', 'delete']
    },
    {
      id: 'purchase_order_access',
      name: 'Akses Purchase Order',
      description: 'Akses ke fitur purchase order',
      actions: ['view', 'create', 'update']
    }
  ]
};