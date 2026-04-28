import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department: string;
  is_active: boolean;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
}

const ManajemenUser = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState<Omit<User, 'id' | 'created_at'>>({
    full_name: '',
    email: '',
    role: 'staff',
    department: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userResult = await getApi<User[]>`
        SELECT 
          id,
          full_name,
          email,
          role,
          department,
          is_active,
          created_at
        FROM users
        ORDER BY created_at DESC
      `;
      
      const deptResult = await getApi<Department[]>`
        SELECT 
          id,
          name
        FROM departments
        WHERE is_active = true
        ORDER BY name
      `;
      
      setUsers(userResult);
      setDepartments(deptResult);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat memuat data pengguna dan departemen",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      // Validasi input
      if (!newUser.email || !newUser.full_name) {
        throw new Error("Email dan nama lengkap harus diisi");
      }

      // Cek apakah email sudah terdaftar
      const existingUser = await getApi<User[]>`
        SELECT id FROM users WHERE email = ${newUser.email}
      `;

      if (existingUser.length > 0) {
        throw new Error("Email sudah terdaftar");
      }

      const result = await getApi<User[]>`
        INSERT INTO users (
          full_name,
          email,
          role,
          department,
          is_active
        ) VALUES (
          ${newUser.full_name},
          ${newUser.email},
          ${newUser.role},
          ${newUser.department},
          ${newUser.is_active}
        ) RETURNING *
      `;
      
      setUsers([result[0], ...users]);
      setNewUser({
        full_name: '',
        email: '',
        role: 'staff',
        department: '',
        is_active: true
      });
      
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil ditambahkan",
      });
    } catch (error: any) {
      toast({
        title: "Gagal menambah pengguna",
        description: error.message || "Terjadi kesalahan saat menambah pengguna",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    
    try {
      const result = await getApi<User[]>`
        UPDATE users 
        SET 
          full_name = ${editingUser.full_name},
          email = ${editingUser.email},
          role = ${editingUser.role},
          department = ${editingUser.department},
          is_active = ${editingUser.is_active}
        WHERE id = ${editingUser.id}
        RETURNING *
      `;
      
      setUsers(users.map(u => u.id === editingUser.id ? result[0] : u));
      setEditingUser(null);
      
      toast({
        title: "Berhasil",
        description: "Data pengguna berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Gagal memperbarui pengguna",
        description: "Terjadi kesalahan saat memperbarui data pengguna",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteApi("/generic-api");
      setUsers(users.filter(u => u.id !== id));
      
      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Gagal menghapus pengguna",
        description: "Terjadi kesalahan saat menghapus pengguna",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await putApi("/generic-api", {});
      
      setUsers(users.map(u => 
        u.id === userId ? {...u, is_active: !currentStatus} : u
      ));
      
      toast({
        title: "Berhasil",
        description: `Status pengguna berhasil ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Gagal memperbarui status",
        description: "Terjadi kesalahan saat memperbarui status pengguna",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Pengguna</CardTitle>
          <CardDescription>
            Kelola akun pengguna dan hak akses sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Input
              placeholder="Cari pengguna berdasarkan nama, email, atau peran..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setNewUser({
                    full_name: '',
                    email: '',
                    role: 'staff',
                    department: '',
                    is_active: true
                  })}
                >
                  Tambah Pengguna Baru
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pengguna Baru</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Nama Lengkap</Label>
                    <Input
                      id="full_name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                      placeholder="Nama lengkap pengguna"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder="alamat@email.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role">Peran</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({...newUser, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih peran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="super_admin">Super Administrator</SelectItem>
                        <SelectItem value="dokter">Dokter</SelectItem>
                        <SelectItem value="perawat">Perawat</SelectItem>
                        <SelectItem value="farmasi">Farmasi</SelectItem>
                        <SelectItem value="laboratorium">Laboratorium</SelectItem>
                        <SelectItem value="radiologi">Radiologi</SelectItem>
                        <SelectItem value="keuangan">Keuangan</SelectItem>
                        <SelectItem value="front_office">Front Office</SelectItem>
                        <SelectItem value="staff">Staff Umum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Departemen</Label>
                    <Select 
                      value={newUser.department} 
                      onValueChange={(value) => setNewUser({...newUser, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih departemen" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={newUser.is_active}
                      onChange={(e) => setNewUser({...newUser, is_active: e.target.checked})}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
                  
                  <Button onClick={handleCreateUser}>Simpan Pengguna</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Terdaftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const dept = departments.find(d => d.id === user.department);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={
                        user.role === 'admin' ? 'default' :
                        user.role === 'super_admin' ? 'secondary' :
                        user.role === 'dokter' ? 'destructive' :
                        user.role === 'perawat' ? 'primary' :
                        'outline'
                      }>
                        {user.role === 'admin' && 'Admin'}
                        {user.role === 'super_admin' && 'Super Admin'}
                        {user.role === 'dokter' && 'Dokter'}
                        {user.role === 'perawat' && 'Perawat'}
                        {user.role === 'farmasi' && 'Farmasi'}
                        {user.role === 'laboratorium' && 'Lab'}
                        {user.role === 'radiologi' && 'Rad'}
                        {user.role === 'keuangan' && 'Keuangan'}
                        {user.role === 'front_office' && 'FO'}
                        {user.role === 'staff' && 'Staff'}
                      </Badge>
                    </TableCell>
                    <TableCell>{dept?.name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "success" : "destructive"}>
                        {user.is_active ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingUser(user)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Pengguna</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Nama Lengkap</Label>
                                <Input
                                  value={editingUser?.full_name || ''}
                                  onChange={(e) => editingUser && setEditingUser({...editingUser, full_name: e.target.value})}
                                  placeholder="Nama lengkap pengguna"
                                />
                              </div>
                              
                              <div>
                                <Label>Email</Label>
                                <Input
                                  value={editingUser?.email || ''}
                                  onChange={(e) => editingUser && setEditingUser({...editingUser, email: e.target.value})}
                                  placeholder="alamat@email.com"
                                />
                              </div>
                              
                              <div>
                                <Label>Peran</Label>
                                <Select 
                                  value={editingUser?.role || 'staff'} 
                                  onValueChange={(value) => editingUser && setEditingUser({...editingUser, role: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                                    <SelectItem value="dokter">Dokter</SelectItem>
                                    <SelectItem value="perawat">Perawat</SelectItem>
                                    <SelectItem value="farmasi">Farmasi</SelectItem>
                                    <SelectItem value="laboratorium">Laboratorium</SelectItem>
                                    <SelectItem value="radiologi">Radiologi</SelectItem>
                                    <SelectItem value="keuangan">Keuangan</SelectItem>
                                    <SelectItem value="front_office">Front Office</SelectItem>
                                    <SelectItem value="staff">Staff Umum</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Departemen</Label>
                                <Select 
                                  value={editingUser?.department || ''} 
                                  onValueChange={(value) => editingUser && setEditingUser({...editingUser, department: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map(dept => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={editingUser?.is_active}
                                  onChange={(e) => editingUser && setEditingUser({...editingUser, is_active: e.target.checked})}
                                />
                                <Label>Aktif</Label>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button onClick={handleUpdateUser}>Perbarui</Button>
                                <Button 
                                  variant="outline"
                                  onClick={() => toggleUserStatus(user.id, user.is_active)}
                                >
                                  {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    if (editingUser) {
                                      handleDeleteUser(editingUser.id);
                                      setEditingUser(null);
                                    }
                                  }}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManajemenUser;