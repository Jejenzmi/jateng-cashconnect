import { Router } from 'express';
import { 
  getAllModules, 
  getModuleById, 
  createModule, 
  updateModule, 
  deleteModule 
} from '../controllers/moduleController';
import { 
  getAllModulePermissions, 
  getModulePermissionById, 
  createModulePermission, 
  updateModulePermission, 
  deleteModulePermission 
} from '../controllers/modulePermissionController';
import { 
  getAllRoles, 
  getRoleById, 
  createRole, 
  updateRole, 
  deleteRole,
  assignRoleToUser,
  removeRoleFromUser
} from '../controllers/roleController';
import { 
  getAllRolePermissions, 
  getRolePermissionById, 
  createRolePermission, 
  updateRolePermission, 
  deleteRolePermission 
} from '../controllers/rolePermissionController';
import { 
  getAllFaskesTypes, 
  getFaskesTypeById, 
  createFaskesType, 
  updateFaskesType, 
  deleteFaskesType 
} from '../controllers/faskesTypeController';
import { 
  getFaskesModuleConfigs, 
  getFaskesModuleConfigById, 
  createFaskesModuleConfig, 
  updateFaskesModuleConfig, 
  deleteFaskesModuleConfig 
} from '../controllers/faskesModuleConfigController';

const router = Router();

// Routes untuk manajemen modul
router.get('/modules', getAllModules);
router.get('/modules/:id', getModuleById);
router.post('/modules', createModule);
router.put('/modules/:id', updateModule);
router.delete('/modules/:id', deleteModule);

// Routes untuk manajemen izin modul
router.get('/module-permissions', getAllModulePermissions);
router.get('/module-permissions/:id', getModulePermissionById);
router.post('/module-permissions', createModulePermission);
router.put('/module-permissions/:id', updateModulePermission);
router.delete('/module-permissions/:id', deleteModulePermission);

// Routes untuk manajemen peran
router.get('/roles', getAllRoles);
router.get('/roles/:id', getRoleById);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);
router.post('/roles/assign-to-user', assignRoleToUser);
router.delete('/roles/remove-from-user', removeRoleFromUser);

// Routes untuk manajemen izin peran
router.get('/role-permissions', getAllRolePermissions);
router.get('/role-permissions/:id', getRolePermissionById);
router.post('/role-permissions', createRolePermission);
router.put('/role-permissions/:id', updateRolePermission);
router.delete('/role-permissions/:id', deleteRolePermission);

// Routes untuk manajemen tipe faskes
router.get('/faskes-types', getAllFaskesTypes);
router.get('/faskes-types/:id', getFaskesTypeById);
router.post('/faskes-types', createFaskesType);
router.put('/faskes-types/:id', updateFaskesType);
router.delete('/faskes-types/:id', deleteFaskesType);

// Routes untuk manajemen konfigurasi modul berdasarkan tipe faskes
router.get('/faskes-module-configs', getFaskesModuleConfigs);
router.get('/faskes-module-configs/:id', getFaskesModuleConfigById);
router.post('/faskes-module-configs', createFaskesModuleConfig);
router.put('/faskes-module-configs/:id', updateFaskesModuleConfig);
router.delete('/faskes-module-configs/:id', deleteFaskesModuleConfig);

export default router;