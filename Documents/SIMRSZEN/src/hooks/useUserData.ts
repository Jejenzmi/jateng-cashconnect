import { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserDataState {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
}

const useUserData = () => {
  const [state, setState] = useState<UserDataState>({
    users: [],
    filteredUsers: [],
    loading: true,
    error: null,
    searchTerm: '',
  });

  // Mock data - dalam implementasi nyata ini akan dipanggil dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulasi delay API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'admin',
            email: 'admin@simrszen.local',
            role: 'admin',
            isActive: true,
            createdAt: '2026-01-15 08:30:00',
            updatedAt: '2026-04-19 09:15:00',
          },
          {
            id: '2',
            username: 'dr_budi',
            email: 'budi.dokter@simrszen.local',
            role: 'dokter',
            isActive: true,
            createdAt: '2026-02-20 09:45:00',
            updatedAt: '2026-04-18 14:20:00',
          },
          {
            id: '3',
            username: 'suster_sri',
            email: 'sri.perawat@simrszen.local',
            role: 'perawat',
            isActive: true,
            createdAt: '2026-03-10 10:30:00',
            updatedAt: '2026-04-17 11:15:00',
          },
          {
            id: '4',
            username: 'apoteker_andi',
            email: 'andi.farmasi@simrszen.local',
            role: 'farmasi',
            isActive: true,
            createdAt: '2026-03-15 13:20:00',
            updatedAt: '2026-04-16 16:45:00',
          },
          {
            id: '5',
            username: 'kasir_mega',
            email: 'mega.kasir@simrszen.local',
            role: 'kasir',
            isActive: true,
            createdAt: '2026-04-01 07:45:00',
            updatedAt: '2026-04-15 08:30:00',
          },
          {
            id: '6',
            username: 'pegawai_rizki',
            email: 'rizki.pegawai@simrszen.local',
            role: 'pegawai',
            isActive: false,
            createdAt: '2026-04-05 14:10:00',
            updatedAt: '2026-04-10 15:00:00',
          },
        ];
        
        setState(prev => ({
          ...prev,
          users: mockUsers,
          filteredUsers: mockUsers,
          loading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Gagal memuat data pengguna',
        }));
      }
    };

    fetchData();
  }, []);

  const setSearchTerm = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
      filteredUsers: prev.users.filter(user =>
        user.username.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase()) ||
        ((user as any).role || (user.roles user.role.toLowerCase()user.role.toLowerCase() user.roles[0]) || "").toLowerCase().includes(term.toLowerCase())
      ),
    }));
  };

  const refreshData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Simulasi refresh data dari API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          email: 'admin@simrszen.local',
          role: 'admin',
          isActive: true,
          createdAt: '2026-01-15 08:30:00',
          updatedAt: '2026-04-19 09:15:00',
        },
        {
          id: '2',
          username: 'dr_budi',
          email: 'budi.dokter@simrszen.local',
          role: 'dokter',
          isActive: true,
          createdAt: '2026-02-20 09:45:00',
          updatedAt: '2026-04-18 14:20:00',
        },
        {
          id: '3',
          username: 'suster_sri',
          email: 'sri.perawat@simrszen.local',
          role: 'perawat',
          isActive: true,
          createdAt: '2026-03-10 10:30:00',
          updatedAt: '2026-04-17 11:15:00',
        },
        {
          id: '4',
          username: 'apoteker_andi',
          email: 'andi.farmasi@simrszen.local',
          role: 'farmasi',
          isActive: true,
          createdAt: '2026-03-15 13:20:00',
          updatedAt: '2026-04-16 16:45:00',
        },
        {
          id: '5',
          username: 'kasir_mega',
          email: 'mega.kasir@simrszen.local',
          role: 'kasir',
          isActive: true,
          createdAt: '2026-04-01 07:45:00',
          updatedAt: '2026-04-15 08:30:00',
        },
        {
          id: '6',
          username: 'pegawai_rizki',
          email: 'rizki.pegawai@simrszen.local',
          role: 'pegawai',
          isActive: false,
          createdAt: '2026-04-05 14:10:00',
          updatedAt: '2026-04-10 15:00:00',
        },
      ];
      
      setState(prev => ({
        ...prev,
        users: mockUsers,
        filteredUsers: prev.searchTerm 
          ? mockUsers.filter(user =>
              user.username.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(prev.searchTerm.toLowerCase()) ||
              ((user as any).role || (user.roles user.role.toLowerCase()user.role.toLowerCase() user.roles[0]) || "").toLowerCase().includes(prev.searchTerm.toLowerCase())
            )
          : mockUsers,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Gagal memuat ulang data pengguna',
      }));
    }
  };

  return {
    ...state,
    setSearchTerm,
    refreshData,
  };
};

export default useUserData;