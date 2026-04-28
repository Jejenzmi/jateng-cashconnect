import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Import modul yang telah dibuat
import InpatientModule from '@/components/inpatient/InpatientModule';
import PharmacyModule from '@/components/pharmacy/PharmacyModule';
import RadiologyModule from '@/components/radiology/RadiologyModule';
import FinanceModule from '@/components/finance/FinanceModule';
import EmergencyModule from '@/components/emergency/EmergencyModule';
import CSSDModule from '@/components/cssd/CSSDModule';
import NutritionModule from '@/components/nutrition/NutritionModule';
import MaintenanceModule from '@/components/maintenance/MaintenanceModule';

// Lazy load untuk modul lain yang mungkin belum dibuat
const LaboratoryModule = lazy(() => import('@/pages/Laboratorium'));
const RawatJalanModule = lazy(() => import('@/pages/RawatJalan'));
const PendaftaranModule = lazy(() => import('@/pages/Pendaftaran'));

export const moduleRoutes: RouteObject[] = [
  {
    path: '/inpatient/*',
    element: <InpatientModule />,
  },
  {
    path: '/pharmacy/*',
    element: <PharmacyModule />,
  },
  {
    path: '/radiology/*',
    element: <RadiologyModule />,
  },
  {
    path: '/finance/*',
    element: <FinanceModule />,
  },
  {
    path: '/emergency/*',
    element: <EmergencyModule />,
  },
  {
    path: '/cssd/*',
    element: <CSSDModule />,
  },
  {
    path: '/nutrition/*',
    element: <NutritionModule />,
  },
  {
    path: '/maintenance/*',
    element: <MaintenanceModule />,
  },
  {
    path: '/laboratorium',
    element: <LaboratoryModule />,
  },
  {
    path: '/rawatjalan',
    element: <RawatJalanModule />,
  },
  {
    path: '/pendaftaran',
    element: <PendaftaranModule />,
  },
];