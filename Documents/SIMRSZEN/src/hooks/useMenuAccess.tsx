import { getApi, postApi, putApi, deleteApi } from '@/utils/api';
import { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  parent_id?: string;
  position: number;
  is_active: boolean;
  role_access: string[];
}

interface UserMenuAccess {
  user_id: string;
  menu_id: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

const useMenuAccessHook = (userId?: string) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [userAccess, setUserAccess] = useState<UserMenuAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    try {
      // Fetch user role permissions via the proper API endpoint instead of unsafe queries
      if (userId) {
        const userRolePermissions: UserRole[] = await getApi(`/menu-access?userId=${userId}`);
        
        // Process the permissions to determine which menu items the user can access
        // In a real implementation, this would map role permissions to actual menu items
        
        // For now, we'll fetch the menu items separately if there's an endpoint for that
        // Or we could define the menu structure locally
        const staticMenuItems: MenuItem[] = [
          { id: 'dashboard', name: 'Dashboard', path: '/', icon: 'dashboard', position: 1, is_active: true, role_access: ['admin', 'user'] },
          { id: 'patients', name: 'Pasien', path: '/patients', icon: 'patient', position: 2, is_active: true, role_access: ['admin', 'user', 'dokter', 'perawat'] },
          { id: 'appointments', name: 'Janji Temu', path: '/appointments', icon: 'appointment', position: 3, is_active: true, role_access: ['admin', 'user'] },
          { id: 'billing', name: 'Penagihan', path: '/billing', icon: 'billing', position: 4, is_active: true, role_access: ['admin', 'keuangan'] },
          { id: 'reports', name: 'Laporan', path: '/reports', icon: 'report', position: 5, is_active: true, role_access: ['admin', 'manager'] },
          { id: 'settings', name: 'Pengaturan', path: '/settings', icon: 'setting', position: 6, is_active: true, role_access: ['admin'] },
        ];
        
        setMenuItems(staticMenuItems);
        
        // Process user access based on role permissions
        const processedUserAccess: UserMenuAccess[] = [];
        userRolePermissions.forEach(userRole => {
          userRole.role.rolePermissions.forEach(rolePermission => {
            processedUserAccess.push({
              user_id: userId,
              menu_id: rolePermission.modulePermission.permissionCode,
              can_view: rolePermission.canView,
              can_create: rolePermission.canCreate,
              can_edit: rolePermission.canUpdate,
              can_delete: rolePermission.canDelete
            });
          });
        });
        
        setUserAccess(processedUserAccess);
      } else {
        // For non-authenticated users, show public menu items
        const publicMenuItems: MenuItem[] = [
          { id: 'dashboard', name: 'Dashboard', path: '/', icon: 'dashboard', position: 1, is_active: true, role_access: ['public'] },
        ];
        
        setMenuItems(publicMenuItems);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat menu akses');
      console.error('Error fetching menu access:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = (menuPath: string, action: 'view' | 'create' | 'edit' | 'delete' = 'view') => {
    const menuItem = menuItems.find(item => item.path === menuPath);
    if (!menuItem || !userId) {
      return false;
    }

    // Check if user has general access to the menu based on their role
    const user = getUserRole(userId);
    if (!user || !menuItem.role_access.includes(user.role)) {
      return false;
    }

    // If there's specific access control for this user-menu combination
    const accessControl = userAccess.find(
      access => access.menu_id === menuItem.id
    );

    if (accessControl) {
      switch (action) {
        case 'create':
          return accessControl.can_create;
        case 'edit':
          return accessControl.can_edit;
        case 'delete':
          return accessControl.can_delete;
        default:
          return accessControl.can_view;
      }
    }

    // Default to allowing view if no specific access control is set
    return action === 'view';
  };

  const getUserRole = (userId: string) => {
    // In a real implementation, this would fetch the user's role from the database
    // For now, we'll return a placeholder
    return { role: 'admin' }; // Placeholder implementation
  };

  const grantAccess = async (
    userId: string, 
    menuId: string, 
    permissions: Partial<UserMenuAccess>
  ) => {
    try {
      // Check if access record already exists
      const checkResponse = await fetch(`/api/user-menu-access?userId=${userId}&menuId=${menuId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!checkResponse.ok && checkResponse.status !== 404) {
        throw new Error('Failed to check existing access');
      }
      
      const existingAccess = checkResponse.ok ? await checkResponse.json() : [];
      
      if (existingAccess.length > 0) {
        // Update existing access
        const updateResponse = await fetch('/api/user-menu-access', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            menuId,
            ...permissions
          })
        });
        
        if (!updateResponse.ok) {
          throw new Error('Failed to update menu access');
        }
      } else {
        // Create new access record
        const createResponse = await fetch('/api/user-menu-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            menuId,
            ...permissions
          })
        });
        
        if (!createResponse.ok) {
          throw new Error('Failed to create menu access');
        }
      }
      
      // Refresh the access data
      await fetchMenuItems();
    } catch (err: any) {
      setError(err.message || 'Gagal memberikan akses menu');
      console.error('Error granting menu access:', err);
      throw err;
    }
  };

  const revokeAccess = async (userId: string, menuId: string) => {
    try {
      // Delete access record
      const deleteResponse = await fetch('/api/user-menu-access', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          menuId
        })
      });
      
      if (!deleteResponse.ok) {
        throw new Error('Failed to delete menu access');
      }
      
      // Refresh the access data
      await fetchMenuItems();
    } catch (err: any) {
      setError(err.message || 'Gagal mencabut akses menu');
      console.error('Error revoking menu access:', err);
      throw err;
    }
  };

  // New function to check if user can view a specific path
  const canViewPath = (path: string) => {
    // Find menu item with matching path
    const menuItem = menuItems.find(item => item.path === path);
    
    if (!menuItem) {
      // If no menu item found for this path, assume accessible for basic users
      return true;
    }
    
    // If user is not logged in, only public menu items are accessible
    if (!userId) {
      return menuItem.role_access.includes('public');
    }
    
    // Check if user's role has access to this menu item
    const user = getUserRole(userId);
    if (!user) return false;
    
    // If user is admin, allow access to everything
    if (user.role === 'admin') {
      return true;
    }
    
    // Check if the user's role has access to this menu item
    return menuItem.role_access.includes(user.role) || menuItem.role_access.includes('all');
  };

  useEffect(() => {
    fetchMenuItems();
  }, [userId]);

  // Filter menus based on user role
  const getAccessibleMenus = () => {
    if (!userId) {
      // For non-authenticated users, return public menus only
      return menuItems.filter(item => item.role_access.includes('public'));
    }

    // Get user role and filter accordingly
    const user = getUserRole(userId);
    if (!user) return [];

    return menuItems.filter(item => 
      item.role_access.includes(user.role) || item.role_access.includes('all')
    );
  };

  return {
    menuItems,
    userAccess,
    loading,
    error,
    checkAccess,
    grantAccess,
    revokeAccess,
    getAccessibleMenus,
    refetch: fetchMenuItems,
    canViewPath,
    menuAccess: userAccess,  // Menambahkan menuAccess ke dalam hasil kembalian
    isLoading: loading
  };
};

export const useMenuAccess = useMenuAccessHook;
export default useMenuAccessHook;