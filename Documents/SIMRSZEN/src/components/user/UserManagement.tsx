import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  PlusCircle, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Lock,
  Shield,
  Calendar,
  Activity,
  Eye,
  CheckCircle,
  XCircle,
  KeyRound,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'dokter' | 'perawat' | 'farmasi' | 'kasir' | 'pegawai';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
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
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    const results = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    navigate(`/users/edit/${user.id}`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
    setFilteredUsers(filteredUsers.filter(user => user.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
    setFilteredUsers(filteredUsers.map(user => 
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
        <p className="text-muted-foreground">
          Kelola akun pengguna, hak akses, dan izin berbagai modul
        </p>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Pengguna Aktif</TabsTrigger>
          <TabsTrigger value="inactive">Pengguna Non-Aktif</TabsTrigger>
          <TabsTrigger value="permissions">Hak Akses</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan username, email, atau role..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah Pengguna
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Pengguna Baru</DialogTitle>
                  <DialogDescription>
                    Tambahkan pengguna baru ke sistem SIMRS ZEN
                  </DialogDescription>
                </DialogHeader>
                <UserForm />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna Aktif</CardTitle>
              <CardDescription>
                {filteredUsers.filter(u => u.isActive).length} pengguna aktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter(u => u.isActive)
                    .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'dokter' ? 'secondary' :
                            user.role === 'perawat' ? 'outline' :
                            user.role === 'farmasi' ? 'destructive' :
                            user.role === 'kasir' ? 'success' :
                            'secondary'
                          }
                        >
                          {user.role === 'admin' && 'Administrator'}
                          {user.role === 'dokter' && 'Dokter'}
                          {user.role === 'perawat' && 'Perawat'}
                          {user.role === 'farmasi' && 'Farmasi'}
                          {user.role === 'kasir' && 'Kasir'}
                          {user.role === 'pegawai' && 'Pegawai'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pengguna Non-Aktif</CardTitle>
              <CardDescription>
                {filteredUsers.filter(u => !u.isActive).length} pengguna non-aktif
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Non-Aktif Sejak</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers
                    .filter(u => !u.isActive)
                    .map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'dokter' ? 'secondary' :
                            user.role === 'perawat' ? 'outline' :
                            user.role === 'farmasi' ? 'destructive' :
                            user.role === 'kasir' ? 'success' :
                            'secondary'
                          }
                        >
                          {user.role === 'admin' && 'Administrator'}
                          {user.role === 'dokter' && 'Dokter'}
                          {user.role === 'perawat' && 'Perawat'}
                          {user.role === 'farmasi' && 'Farmasi'}
                          {user.role === 'kasir' && 'Kasir'}
                          {user.role === 'pegawai' && 'Pegawai'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.updatedAt).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleStatus(user.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hak Akses Berdasarkan Role</CardTitle>
              <CardDescription>
                Otorisasi fitur untuk setiap role pengguna
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Administrator</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Manajemen Pengguna', 'Manajemen Pasien', 'Manajemen Registrasi',
                      'Manajemen Rekam Medis', 'Manajemen Farmasi', 'Manajemen Keuangan',
                      'Manajemen Departemen', 'Manajemen Karyawan', 'Laporan & Statistik',
                      'Pengaturan Sistem', 'Integrasi Eksternal', 'Audit Log'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Dokter</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Manajemen Pasien', 'Manajemen Rekam Medis', 'Lihat Registrasi',
                      'Resep Obat', 'Laporan Klinis'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {[
                      'Manajemen Pengguna', 'Manajemen Keuangan', 'Pengaturan Sistem'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 opacity-50">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Perawat</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      'Manajemen Pasien', 'Lihat Rekam Medis', 'Lihat Registrasi',
                      'Monitoring Pasien'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {[
                      'Manajemen Pengguna', 'Manajemen Keuangan', 'Pengaturan Sistem'
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 opacity-50">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Jumlah akun terdaftar
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktif</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pengguna aktif
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrator</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Akun admin
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Non-Aktif</CardTitle>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => !u.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Pengguna non-aktif
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Role</CardTitle>
              <CardDescription>
                Jumlah pengguna berdasarkan role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['admin', 'dokter', 'perawat', 'farmasi', 'kasir', 'pegawai'].map(role => {
                  const count = users.filter(u => u.role === role).length;
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                  
                  return (
                    <div key={role} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium capitalize">
                          {role === 'admin' && 'Administrator'} 
                          {role === 'dokter' && 'Dokter'} 
                          {role === 'perawat' && 'Perawat'} 
                          {role === 'farmasi' && 'Farmasi'} 
                          {role === 'kasir' && 'Kasir'} 
                          {role === 'pegawai' && 'Pegawai'}
                        </span>
                        <span className="text-sm text-muted-foreground">{count} pengguna ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang pengguna
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <p className="mt-1">{selectedUser.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Role</Label>
                  <p className="mt-1 capitalize">
                    {selectedUser.role === 'admin' && 'Administrator'}
                    {selectedUser.role === 'dokter' && 'Dokter'}
                    {selectedUser.role === 'perawat' && 'Perawat'}
                    {selectedUser.role === 'farmasi' && 'Farmasi'}
                    {selectedUser.role === 'kasir' && 'Kasir'}
                    {selectedUser.role === 'pegawai' && 'Pegawai'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge 
                      variant={selectedUser.isActive ? 'secondary' : 'destructive'}
                    >
                      {selectedUser.isActive ? 'Aktif' : 'Non-Aktif'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                  <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tanggal Diubah</Label>
                  <p className="mt-1">{new Date(selectedUser.updatedAt).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// User Form Component
const UserForm: React.FC = () => {
  return (
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="username" placeholder="Masukkan username..." className="pl-9" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="email" type="email" placeholder="alamat@email.com" className="pl-9" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input id="password" type="password" placeholder="Masukkan password..." className="pl-9" />
        </div>
      </div>
      
      <div>
        <Label htmlFor="role">Role</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih role pengguna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrator</SelectItem>
            <SelectItem value="dokter">Dokter</SelectItem>
            <SelectItem value="perawat">Perawat</SelectItem>
            <SelectItem value="farmasi">Farmasi</SelectItem>
            <SelectItem value="kasir">Kasir</SelectItem>
            <SelectItem value="pegawai">Pegawai</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserManagement;