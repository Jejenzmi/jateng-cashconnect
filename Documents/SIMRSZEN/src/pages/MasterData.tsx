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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
interface Doctor {
  id: string;
  full_name: string;
  specialist: string;
  license_number: string;
  phone: string;
  is_active: boolean;
}

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
}

interface Medicine {
  id: string;
  name: string;
  code: string;
  unit: string;
  price: number;
  stock: number;
  is_active: boolean;
}

interface Room {
  id: string;
  name: string;
  room_type: string;
  floor: number;
  capacity: number;
  is_active: boolean;
}

const MasterData = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [newDoctor, setNewDoctor] = useState<Omit<Doctor, 'id'>>({
    full_name: '',
    specialist: '',
    license_number: '',
    phone: '',
    is_active: true
  });

  const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
    name: '',
    code: '',
    description: '',
    is_active: true
  });

  const [newMedicine, setNewMedicine] = useState<Omit<Medicine, 'id'>>({
    name: '',
    code: '',
    unit: 'buah',
    price: 0,
    stock: 0,
    is_active: true
  });

  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: '',
    room_type: 'general',
    floor: 1,
    capacity: 2,
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch doctors
      const doctorResult = await getApi<Doctor[]>`
        SELECT id, full_name, specialist, license_number, phone, is_active
        FROM doctors
        ORDER BY full_name
      `;
      
      // Fetch departments
      const deptResult = await getApi<Department[]>`
        SELECT id, name, code, description, is_active
        FROM departments
        ORDER BY name
      `;
      
      // Fetch medicines
      const medicineResult = await getApi<Medicine[]>`
        SELECT id, name, code, unit, price, stock, is_active
        FROM medicines
        ORDER BY name
      `;
      
      // Fetch rooms
      const roomResult = await getApi<Room[]>`
        SELECT id, name, room_type, floor, capacity, is_active
        FROM rooms
        ORDER BY name
      `;
      
      setDoctors(doctorResult);
      setDepartments(deptResult);
      setMedicines(medicineResult);
      setRooms(roomResult);
    } catch (error) {
      console.error('Error fetching master data:', error);
      toast({
        title: "Gagal memuat data master",
        description: "Terjadi kesalahan saat memuat data master",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async () => {
    try {
      const result = await getApi<Doctor[]>`
        INSERT INTO doctors (
          full_name,
          specialist,
          license_number,
          phone,
          is_active
        ) VALUES (
          ${newDoctor.full_name},
          ${newDoctor.specialist},
          ${newDoctor.license_number},
          ${newDoctor.phone},
          ${newDoctor.is_active}
        ) RETURNING *
      `;
      
      setDoctors([...doctors, result[0]]);
      setNewDoctor({
        full_name: '',
        specialist: '',
        license_number: '',
        phone: '',
        is_active: true
      });
      
      toast({
        title: "Berhasil",
        description: "Dokter berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error creating doctor:', error);
      toast({
        title: "Gagal menambah dokter",
        description: "Terjadi kesalahan saat menambah dokter",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDoctor = async () => {
    if (!editingDoctor) return;
    
    try {
      const result = await getApi<Doctor[]>`
        UPDATE doctors 
        SET 
          full_name = ${editingDoctor.full_name},
          specialist = ${editingDoctor.specialist},
          license_number = ${editingDoctor.license_number},
          phone = ${editingDoctor.phone},
          is_active = ${editingDoctor.is_active}
        WHERE id = ${editingDoctor.id}
        RETURNING *
      `;
      
      setDoctors(doctors.map(d => d.id === editingDoctor.id ? result[0] : d));
      setEditingDoctor(null);
      
      toast({
        title: "Berhasil",
        description: "Data dokter berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating doctor:', error);
      toast({
        title: "Gagal memperbarui dokter",
        description: "Terjadi kesalahan saat memperbarui data dokter",
        variant: "destructive",
      });
    }
  };

  const handleCreateDepartment = async () => {
    try {
      const result = await getApi<Department[]>`
        INSERT INTO departments (
          name,
          code,
          description,
          is_active
        ) VALUES (
          ${newDepartment.name},
          ${newDepartment.code},
          ${newDepartment.description},
          ${newDepartment.is_active}
        ) RETURNING *
      `;
      
      setDepartments([...departments, result[0]]);
      setNewDepartment({
        name: '',
        code: '',
        description: '',
        is_active: true
      });
      
      toast({
        title: "Berhasil",
        description: "Departemen berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error creating department:', error);
      toast({
        title: "Gagal menambah departemen",
        description: "Terjadi kesalahan saat menambah departemen",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;
    
    try {
      const result = await getApi<Department[]>`
        UPDATE departments 
        SET 
          name = ${editingDepartment.name},
          code = ${editingDepartment.code},
          description = ${editingDepartment.description},
          is_active = ${editingDepartment.is_active}
        WHERE id = ${editingDepartment.id}
        RETURNING *
      `;
      
      setDepartments(departments.map(d => d.id === editingDepartment.id ? result[0] : d));
      setEditingDepartment(null);
      
      toast({
        title: "Berhasil",
        description: "Data departemen berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating department:', error);
      toast({
        title: "Gagal memperbarui departemen",
        description: "Terjadi kesalahan saat memperbarui data departemen",
        variant: "destructive",
      });
    }
  };

  const handleCreateMedicine = async () => {
    try {
      const result = await getApi<Medicine[]>`
        INSERT INTO medicines (
          name,
          code,
          unit,
          price,
          stock,
          is_active
        ) VALUES (
          ${newMedicine.name},
          ${newMedicine.code},
          ${newMedicine.unit},
          ${newMedicine.price},
          ${newMedicine.stock},
          ${newMedicine.is_active}
        ) RETURNING *
      `;
      
      setMedicines([...medicines, result[0]]);
      setNewMedicine({
        name: '',
        code: '',
        unit: 'buah',
        price: 0,
        stock: 0,
        is_active: true
      });
      
      toast({
        title: "Berhasil",
        description: "Obat berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error creating medicine:', error);
      toast({
        title: "Gagal menambah obat",
        description: "Terjadi kesalahan saat menambah obat",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMedicine = async () => {
    if (!editingMedicine) return;
    
    try {
      const result = await getApi<Medicine[]>`
        UPDATE medicines 
        SET 
          name = ${editingMedicine.name},
          code = ${editingMedicine.code},
          unit = ${editingMedicine.unit},
          price = ${editingMedicine.price},
          stock = ${editingMedicine.stock},
          is_active = ${editingMedicine.is_active}
        WHERE id = ${editingMedicine.id}
        RETURNING *
      `;
      
      setMedicines(medicines.map(m => m.id === editingMedicine.id ? result[0] : m));
      setEditingMedicine(null);
      
      toast({
        title: "Berhasil",
        description: "Data obat berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating medicine:', error);
      toast({
        title: "Gagal memperbarui obat",
        description: "Terjadi kesalahan saat memperbarui data obat",
        variant: "destructive",
      });
    }
  };

  const handleCreateRoom = async () => {
    try {
      const result = await getApi<Room[]>`
        INSERT INTO rooms (
          name,
          room_type,
          floor,
          capacity,
          is_active
        ) VALUES (
          ${newRoom.name},
          ${newRoom.room_type},
          ${newRoom.floor},
          ${newRoom.capacity},
          ${newRoom.is_active}
        ) RETURNING *
      `;
      
      setRooms([...rooms, result[0]]);
      setNewRoom({
        name: '',
        room_type: 'general',
        floor: 1,
        capacity: 2,
        is_active: true
      });
      
      toast({
        title: "Berhasil",
        description: "Ruangan berhasil ditambahkan",
      });
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: "Gagal menambah ruangan",
        description: "Terjadi kesalahan saat menambah ruangan",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRoom = async () => {
    if (!editingRoom) return;
    
    try {
      const result = await getApi<Room[]>`
        UPDATE rooms 
        SET 
          name = ${editingRoom.name},
          room_type = ${editingRoom.room_type},
          floor = ${editingRoom.floor},
          capacity = ${editingRoom.capacity},
          is_active = ${editingRoom.is_active}
        WHERE id = ${editingRoom.id}
        RETURNING *
      `;
      
      setRooms(rooms.map(r => r.id === editingRoom.id ? result[0] : r));
      setEditingRoom(null);
      
      toast({
        title: "Berhasil",
        description: "Data ruangan berhasil diperbarui",
      });
    } catch (error) {
      console.error('Error updating room:', error);
      toast({
        title: "Gagal memperbarui ruangan",
        description: "Terjadi kesalahan saat memperbarui data ruangan",
        variant: "destructive",
      });
    }
  };

  const toggleActiveStatus = async (table: string, id: string, currentStatus: boolean) => {
    try {
      await putApi("/generic-api", {});
      
      fetchData(); // Refresh data
      
      toast({
        title: "Berhasil",
        description: `Status ${table} berhasil diperbarui`,
      });
    } catch (error) {
      console.error(`Error toggling ${table} status:`, error);
      toast({
        title: `Gagal memperbarui status ${table}`,
        description: `Terjadi kesalahan saat memperbarui status ${table}`,
        variant: "destructive",
      });
    }
  };

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
          <CardTitle>Data Master</CardTitle>
          <CardDescription>
            Kelola data master untuk dokter, departemen, obat, dan ruangan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="doctors" className="w-full">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="doctors">Dokter</TabsTrigger>
              <TabsTrigger value="departments">Departemen</TabsTrigger>
              <TabsTrigger value="medicines">Obat</TabsTrigger>
              <TabsTrigger value="rooms">Ruangan</TabsTrigger>
            </TabsList>
            
            {/* Doctors Tab */}
            <TabsContent value="doctors">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Daftar Dokter</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setNewDoctor({
                        full_name: '',
                        specialist: '',
                        license_number: '',
                        phone: '',
                        is_active: true
                      })}
                    >
                      Tambah Dokter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Dokter Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="full_name">Nama Lengkap</Label>
                        <Input
                          id="full_name"
                          value={newDoctor.full_name}
                          onChange={(e) => setNewDoctor({...newDoctor, full_name: e.target.value})}
                          placeholder="Nama lengkap dokter"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="specialist">Spesialisasi</Label>
                        <Input
                          id="specialist"
                          value={newDoctor.specialist}
                          onChange={(e) => setNewDoctor({...newDoctor, specialist: e.target.value})}
                          placeholder="Spesialisasi dokter"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="license_number">Nomor SIP</Label>
                        <Input
                          id="license_number"
                          value={newDoctor.license_number}
                          onChange={(e) => setNewDoctor({...newDoctor, license_number: e.target.value})}
                          placeholder="Surat Izin Praktik"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Telepon</Label>
                        <Input
                          id="phone"
                          value={newDoctor.phone}
                          onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                          placeholder="Nomor telepon"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="doctor_active"
                          checked={newDoctor.is_active}
                          onChange={(e) => setNewDoctor({...newDoctor, is_active: e.target.checked})}
                        />
                        <Label htmlFor="doctor_active">Aktif</Label>
                      </div>
                      
                      <Button onClick={handleCreateDoctor}>Simpan Dokter</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Spesialisasi</TableHead>
                    <TableHead>Nomor SIP</TableHead>
                    <TableHead>Telepon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.full_name}</TableCell>
                      <TableCell>{doctor.specialist}</TableCell>
                      <TableCell>{doctor.license_number}</TableCell>
                      <TableCell>{doctor.phone}</TableCell>
                      <TableCell>
                        <Badge variant={doctor.is_active ? "success" : "destructive"}>
                          {doctor.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingDoctor(doctor)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Dokter</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Nama Lengkap</Label>
                                  <Input
                                    value={editingDoctor?.full_name || ''}
                                    onChange={(e) => editingDoctor && setEditingDoctor({...editingDoctor, full_name: e.target.value})}
                                    placeholder="Nama lengkap dokter"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Spesialisasi</Label>
                                  <Input
                                    value={editingDoctor?.specialist || ''}
                                    onChange={(e) => editingDoctor && setEditingDoctor({...editingDoctor, specialist: e.target.value})}
                                    placeholder="Spesialisasi dokter"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Nomor SIP</Label>
                                  <Input
                                    value={editingDoctor?.license_number || ''}
                                    onChange={(e) => editingDoctor && setEditingDoctor({...editingDoctor, license_number: e.target.value})}
                                    placeholder="Surat Izin Praktik"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Telepon</Label>
                                  <Input
                                    value={editingDoctor?.phone || ''}
                                    onChange={(e) => editingDoctor && setEditingDoctor({...editingDoctor, phone: e.target.value})}
                                    placeholder="Nomor telepon"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editingDoctor?.is_active}
                                    onChange={(e) => editingDoctor && setEditingDoctor({...editingDoctor, is_active: e.target.checked})}
                                  />
                                  <Label>Aktif</Label>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button onClick={handleUpdateDoctor}>Perbarui</Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => toggleActiveStatus('doctors', doctor.id, doctor.is_active)}
                                  >
                                    {doctor.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Departments Tab */}
            <TabsContent value="departments">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Daftar Departemen</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setNewDepartment({
                        name: '',
                        code: '',
                        description: '',
                        is_active: true
                      })}
                    >
                      Tambah Departemen
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Departemen Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dept_name">Nama Departemen</Label>
                        <Input
                          id="dept_name"
                          value={newDepartment.name}
                          onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                          placeholder="Nama departemen"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="dept_code">Kode Departemen</Label>
                        <Input
                          id="dept_code"
                          value={newDepartment.code}
                          onChange={(e) => setNewDepartment({...newDepartment, code: e.target.value})}
                          placeholder="Kode singkat departemen"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="dept_description">Deskripsi</Label>
                        <textarea
                          id="dept_description"
                          className="w-full p-2 border rounded"
                          rows={3}
                          value={newDepartment.description}
                          onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                          placeholder="Deskripsi departemen"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="dept_active"
                          checked={newDepartment.is_active}
                          onChange={(e) => setNewDepartment({...newDepartment, is_active: e.target.checked})}
                        />
                        <Label htmlFor="dept_active">Aktif</Label>
                      </div>
                      
                      <Button onClick={handleCreateDepartment}>Simpan Departemen</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>{dept.code}</TableCell>
                      <TableCell>{dept.description}</TableCell>
                      <TableCell>
                        <Badge variant={dept.is_active ? "success" : "destructive"}>
                          {dept.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingDepartment(dept)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Departemen</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Nama Departemen</Label>
                                  <Input
                                    value={editingDepartment?.name || ''}
                                    onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, name: e.target.value})}
                                    placeholder="Nama departemen"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Kode Departemen</Label>
                                  <Input
                                    value={editingDepartment?.code || ''}
                                    onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, code: e.target.value})}
                                    placeholder="Kode singkat departemen"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Deskripsi</Label>
                                  <textarea
                                    className="w-full p-2 border rounded"
                                    rows={3}
                                    value={editingDepartment?.description || ''}
                                    onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, description: e.target.value})}
                                    placeholder="Deskripsi departemen"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editingDepartment?.is_active}
                                    onChange={(e) => editingDepartment && setEditingDepartment({...editingDepartment, is_active: e.target.checked})}
                                  />
                                  <Label>Aktif</Label>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button onClick={handleUpdateDepartment}>Perbarui</Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => toggleActiveStatus('departments', dept.id, dept.is_active)}
                                  >
                                    {dept.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Medicines Tab */}
            <TabsContent value="medicines">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Daftar Obat</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setNewMedicine({
                        name: '',
                        code: '',
                        unit: 'buah',
                        price: 0,
                        stock: 0,
                        is_active: true
                      })}
                    >
                      Tambah Obat
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Obat Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="medicine_name">Nama Obat</Label>
                        <Input
                          id="medicine_name"
                          value={newMedicine.name}
                          onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                          placeholder="Nama obat"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="medicine_code">Kode Obat</Label>
                        <Input
                          id="medicine_code"
                          value={newMedicine.code}
                          onChange={(e) => setNewMedicine({...newMedicine, code: e.target.value})}
                          placeholder="Kode obat"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="unit">Satuan</Label>
                        <Input
                          id="unit"
                          value={newMedicine.unit}
                          onChange={(e) => setNewMedicine({...newMedicine, unit: e.target.value})}
                          placeholder="Satuan obat"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="price">Harga</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newMedicine.price}
                          onChange={(e) => setNewMedicine({...newMedicine, price: Number(e.target.value)})}
                          placeholder="Harga per satuan"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="stock">Stok</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newMedicine.stock}
                          onChange={(e) => setNewMedicine({...newMedicine, stock: Number(e.target.value)})}
                          placeholder="Jumlah stok tersedia"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="medicine_active"
                          checked={newMedicine.is_active}
                          onChange={(e) => setNewMedicine({...newMedicine, is_active: e.target.checked})}
                        />
                        <Label htmlFor="medicine_active">Aktif</Label>
                      </div>
                      
                      <Button onClick={handleCreateMedicine}>Simpan Obat</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kode</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.code}</TableCell>
                      <TableCell>{medicine.unit}</TableCell>
                      <TableCell>Rp {medicine.price.toLocaleString()}</TableCell>
                      <TableCell>{medicine.stock}</TableCell>
                      <TableCell>
                        <Badge variant={medicine.is_active ? "success" : "destructive"}>
                          {medicine.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingMedicine(medicine)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Obat</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Nama Obat</Label>
                                  <Input
                                    value={editingMedicine?.name || ''}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, name: e.target.value})}
                                    placeholder="Nama obat"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Kode Obat</Label>
                                  <Input
                                    value={editingMedicine?.code || ''}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, code: e.target.value})}
                                    placeholder="Kode obat"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Satuan</Label>
                                  <Input
                                    value={editingMedicine?.unit || ''}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, unit: e.target.value})}
                                    placeholder="Satuan obat"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Harga</Label>
                                  <Input
                                    type="number"
                                    value={editingMedicine?.price || 0}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, price: Number(e.target.value)})}
                                    placeholder="Harga per satuan"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Stok</Label>
                                  <Input
                                    type="number"
                                    value={editingMedicine?.stock || 0}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, stock: Number(e.target.value)})}
                                    placeholder="Jumlah stok tersedia"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editingMedicine?.is_active}
                                    onChange={(e) => editingMedicine && setEditingMedicine({...editingMedicine, is_active: e.target.checked})}
                                  />
                                  <Label>Aktif</Label>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button onClick={handleUpdateMedicine}>Perbarui</Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => toggleActiveStatus('medicines', medicine.id, medicine.is_active)}
                                  >
                                    {medicine.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            {/* Rooms Tab */}
            <TabsContent value="rooms">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Daftar Ruangan</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      onClick={() => setNewRoom({
                        name: '',
                        room_type: 'general',
                        floor: 1,
                        capacity: 2,
                        is_active: true
                      })}
                    >
                      Tambah Ruangan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Ruangan Baru</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="room_name">Nama Ruangan</Label>
                        <Input
                          id="room_name"
                          value={newRoom.name}
                          onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                          placeholder="Nama ruangan"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="room_type">Jenis Ruangan</Label>
                        <Select value={newRoom.room_type} onValueChange={(value) => setNewRoom({...newRoom, room_type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis ruangan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">Umum</SelectItem>
                            <SelectItem value="vip">VIP</SelectItem>
                            <SelectItem value="icu">ICU</SelectItem>
                            <SelectItem value="operation">Bedah</SelectItem>
                            <SelectItem value="maternity">Bersalin</SelectItem>
                            <SelectItem value="radiology">Radiologi</SelectItem>
                            <SelectItem value="laboratory">Laboratorium</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="floor">Lantai</Label>
                        <Input
                          id="floor"
                          type="number"
                          value={newRoom.floor}
                          onChange={(e) => setNewRoom({...newRoom, floor: Number(e.target.value)})}
                          placeholder="Lantai ruangan"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="capacity">Kapasitas</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={newRoom.capacity}
                          onChange={(e) => setNewRoom({...newRoom, capacity: Number(e.target.value)})}
                          placeholder="Jumlah tempat tidur"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="room_active"
                          checked={newRoom.is_active}
                          onChange={(e) => setNewRoom({...newRoom, is_active: e.target.checked})}
                        />
                        <Label htmlFor="room_active">Aktif</Label>
                      </div>
                      
                      <Button onClick={handleCreateRoom}>Simpan Ruangan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Lantai</TableHead>
                    <TableHead>Kapasitas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.room_type}</TableCell>
                      <TableCell>Lantai {room.floor}</TableCell>
                      <TableCell>{room.capacity} bed</TableCell>
                      <TableCell>
                        <Badge variant={room.is_active ? "success" : "destructive"}>
                          {room.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setEditingRoom(room)}
                              >
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Ruangan</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Nama Ruangan</Label>
                                  <Input
                                    value={editingRoom?.name || ''}
                                    onChange={(e) => editingRoom && setEditingRoom({...editingRoom, name: e.target.value})}
                                    placeholder="Nama ruangan"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Jenis Ruangan</Label>
                                  <Select 
                                    value={editingRoom?.room_type || 'general'} 
                                    onValueChange={(value) => editingRoom && setEditingRoom({...editingRoom, room_type: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="general">Umum</SelectItem>
                                      <SelectItem value="vip">VIP</SelectItem>
                                      <SelectItem value="icu">ICU</SelectItem>
                                      <SelectItem value="operation">Bedah</SelectItem>
                                      <SelectItem value="maternity">Bersalin</SelectItem>
                                      <SelectItem value="radiology">Radiologi</SelectItem>
                                      <SelectItem value="laboratory">Laboratorium</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label>Lantai</Label>
                                  <Input
                                    type="number"
                                    value={editingRoom?.floor || 0}
                                    onChange={(e) => editingRoom && setEditingRoom({...editingRoom, floor: Number(e.target.value)})}
                                    placeholder="Lantai ruangan"
                                  />
                                </div>
                                
                                <div>
                                  <Label>Kapasitas</Label>
                                  <Input
                                    type="number"
                                    value={editingRoom?.capacity || 0}
                                    onChange={(e) => editingRoom && setEditingRoom({...editingRoom, capacity: Number(e.target.value)})}
                                    placeholder="Jumlah tempat tidur"
                                  />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={editingRoom?.is_active}
                                    onChange={(e) => editingRoom && setEditingRoom({...editingRoom, is_active: e.target.checked})}
                                  />
                                  <Label>Aktif</Label>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button onClick={handleUpdateRoom}>Perbarui</Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => toggleActiveStatus('rooms', room.id, room.is_active)}
                                  >
                                    {room.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MasterData;