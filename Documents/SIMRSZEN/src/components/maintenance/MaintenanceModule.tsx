import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wrench, Ticket, Package, Activity, 
  Calendar, Clock, CheckCircle, AlertTriangle, 
  Search, Filter, Users, Building2, Monitor
} from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  installationDate: string;
  warrantyExpiry: string;
  category: string;
  status: 'operational' | 'maintenance' | 'out-of-order' | 'decommissioned';
  lastMaintenance: string;
  nextMaintenance: string;
}

interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  taskType: 'preventive' | 'corrective';
  title: string;
  description: string;
  assignedTo: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface RepairTicket {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reportedBy: string;
  reportedDate: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SparePart {
  id: string;
  name: string;
  equipmentId: string;
  equipmentName: string;
  partNumber: string;
  manufacturer: string;
  currentStock: number;
  minStock: number;
  reorderLevel: number;
  unit: string;
  unitPrice: number;
  supplier: string;
  lastRestock: string;
}

export default function MaintenanceModule() {
  const [activeTab, setActiveTab] = useState('preventive-maintenance');
  
  const [equipments, setEquipments] = useState<Equipment[]>([
    {
      id: 'eq-1',
      name: 'Ventilator',
      brand: 'Philips',
      model: 'Respironics V60',
      serialNumber: 'VN-2025-001',
      location: 'ICU Lantai 3',
      installationDate: '2025-06-15',
      warrantyExpiry: '2027-06-15',
      category: 'Life Support',
      status: 'operational',
      lastMaintenance: '2026-03-15',
      nextMaintenance: '2026-06-15'
    },
    {
      id: 'eq-2',
      name: 'Defibrillator',
      brand: 'ZOLL',
      model: 'R Series Plus',
      serialNumber: 'DF-2025-002',
      location: 'IGD',
      installationDate: '2025-08-20',
      warrantyExpiry: '2027-08-20',
      category: 'Emergency',
      status: 'maintenance',
      lastMaintenance: '2026-04-01',
      nextMaintenance: '2026-05-01'
    },
    {
      id: 'eq-3',
      name: 'X-Ray Machine',
      brand: 'GE Healthcare',
      model: 'Optima XR220amx',
      serialNumber: 'XR-2024-001',
      location: 'Radiologi',
      installationDate: '2024-11-10',
      warrantyExpiry: '2026-11-10',
      category: 'Imaging',
      status: 'operational',
      lastMaintenance: '2026-01-15',
      nextMaintenance: '2026-07-15'
    },
    {
      id: 'eq-4',
      name: 'ECG Machine',
      brand: 'Mindray',
      model: 'TEC-7000',
      serialNumber: 'EC-2025-003',
      location: 'Poliklinik Jantung',
      installationDate: '2025-04-05',
      warrantyExpiry: '2027-04-05',
      category: 'Diagnostic',
      status: 'operational',
      lastMaintenance: '2026-02-20',
      nextMaintenance: '2026-05-20'
    }
  ]);

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    {
      id: 'task-1',
      equipmentId: 'eq-1',
      equipmentName: 'Ventilator',
      taskType: 'preventive',
      title: 'Inspeksi Rutin Bulanan',
      description: 'Pemeriksaan fungsi, kalibrasi, dan pembersihan unit ventilator',
      assignedTo: 'Teknisi Budi',
      scheduledDate: '2026-05-15',
      status: 'scheduled',
      priority: 'high'
    },
    {
      id: 'task-2',
      equipmentId: 'eq-3',
      equipmentName: 'X-Ray Machine',
      taskType: 'preventive',
      title: 'Pemeliharaan Tahunan',
      description: 'Kalibrasi sinar-X dan pemeriksaan keamanan radiasi',
      assignedTo: 'Teknisi Sari',
      scheduledDate: '2026-07-15',
      status: 'scheduled',
      priority: 'critical'
    },
    {
      id: 'task-3',
      equipmentId: 'eq-4',
      equipmentName: 'ECG Machine',
      taskType: 'preventive',
      title: 'Pemeriksaan Fungsi',
      description: 'Uji fungsi elektroda dan kalibrasi gelombang',
      assignedTo: 'Teknisi Anton',
      scheduledDate: '2026-05-20',
      status: 'overdue',
      priority: 'medium'
    }
  ]);

  const [tickets, setTickets] = useState<RepairTicket[]>([
    {
      id: 'ticket-1',
      equipmentId: 'eq-2',
      equipmentName: 'Defibrillator',
      reportedBy: 'Perawat Siska',
      reportedDate: '2026-04-10',
      description: 'Tidak merespons setelah dinyalakan, layar tidak menyala',
      assignedTo: 'Teknisi Budi',
      dueDate: '2026-04-25',
      status: 'in-progress',
      severity: 'critical'
    },
    {
      id: 'ticket-2',
      equipmentId: 'eq-4',
      equipmentName: 'ECG Machine',
      reportedBy: 'Dokter Andrianto',
      reportedDate: '2026-04-15',
      description: 'Gelombang ECG tidak stabil dan terputus-putus',
      assignedTo: 'Teknisi Anton',
      dueDate: '2026-04-22',
      status: 'open',
      severity: 'high'
    }
  ]);

  const [spareParts, setSpareParts] = useState<SparePart[]>([
    {
      id: 'part-1',
      name: 'Battery Pack Ventilator',
      equipmentId: 'eq-1',
      equipmentName: 'Ventilator',
      partNumber: 'BP-V60-001',
      manufacturer: 'Philips',
      currentStock: 3,
      minStock: 2,
      reorderLevel: 5,
      unit: 'unit',
      unitPrice: 4500000,
      supplier: 'Medika Jaya',
      lastRestock: '2026-03-01'
    },
    {
      id: 'part-2',
      name: 'ECG Electrode (Pack of 10)',
      equipmentId: 'eq-4',
      equipmentName: 'ECG Machine',
      partNumber: 'EE-T7000-002',
      manufacturer: 'Mindray',
      currentStock: 12,
      minStock: 5,
      reorderLevel: 10,
      unit: 'pack',
      unitPrice: 125000,
      supplier: 'Alkesindo',
      lastRestock: '2026-03-15'
    },
    {
      id: 'part-3',
      name: 'X-Ray Tube Assembly',
      equipmentId: 'eq-3',
      equipmentName: 'X-Ray Machine',
      partNumber: 'XT-OXR220-001',
      manufacturer: 'GE Healthcare',
      currentStock: 1,
      minStock: 1,
      reorderLevel: 2,
      unit: 'unit',
      unitPrice: 25000000,
      supplier: 'Global Medikal',
      lastRestock: '2025-12-10'
    }
  ]);

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-order':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'decommissioned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTicketSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const operationalEq = equipments.filter(eq => eq.status === 'operational').length;
  const maintenanceEq = equipments.filter(eq => eq.status === 'maintenance').length;
  const criticalTasks = tasks.filter(t => t.priority === 'critical' || t.status === 'overdue').length;
  const openTickets = tickets.filter(t => t.status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wrench className="h-8 w-8" />
            Maintenance dan Engineering
          </h1>
          <p className="text-muted-foreground">Manajemen pemeliharaan peralatan dan gedung</p>
        </div>
        <Button>
          <Wrench className="h-4 w-4 mr-2" />
          Tambah Peralatan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Monitor className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Operasional</p>
                <p className="text-2xl font-bold">{operationalEq}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Wrench className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dalam Perawatan</p>
                <p className="text-2xl font-bold">{maintenanceEq}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tugas Kritis</p>
                <p className="text-2xl font-bold">{criticalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tiket Terbuka</p>
                <p className="text-2xl font-bold">{openTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preventive-maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            <span>Pemeliharaan Preventif</span>
          </TabsTrigger>
          <TabsTrigger value="repair-tickets" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            <span>Tiket Perbaikan</span>
          </TabsTrigger>
          <TabsTrigger value="spare-parts" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Spare Part</span>
          </TabsTrigger>
          <TabsTrigger value="equipment-performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Kinerja Peralatan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preventive-maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Pemeliharaan Preventif</CardTitle>
              <CardDescription>Daftar jadwal pemeliharaan rutin peralatan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map(task => (
                  <Card key={task.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{task.title}</h3>
                          <p className="text-sm text-muted-foreground">{task.equipmentName}</p>
                          <p className="text-sm">{task.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getTaskStatusColor(task.status)}>
                            {task.status === 'scheduled' && 'Terjadwal'}
                            {task.status === 'in-progress' && 'Dalam Proses'}
                            {task.status === 'completed' && 'Selesai'}
                            {task.status === 'overdue' && 'Terlambat'}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {task.scheduledDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority === 'low' && 'Rendah'}
                          {task.priority === 'medium' && 'Sedang'}
                          {task.priority === 'high' && 'Tinggi'}
                          {task.priority === 'critical' && 'Kritis'}
                        </Badge>
                        <Badge variant="outline">
                          {task.taskType === 'preventive' ? 'Preventif' : 'Korektif'}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {task.assignedTo}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {task.status === 'scheduled' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              Atur Ulang Jadwal
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Wrench className="h-4 w-4 mr-2" />
                              Mulai Pekerjaan
                            </Button>
                          </>
                        )}
                        {task.status === 'in-progress' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tandai Selesai
                          </Button>
                        )}
                        {task.status === 'completed' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Lihat Laporan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="repair-tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tiket Perbaikan Peralatan</CardTitle>
              <CardDescription>Daftar tiket perbaikan peralatan yang dilaporkan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <Card key={ticket.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">#{ticket.id} - {ticket.equipmentName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Dilaporkan oleh: {ticket.reportedBy}
                          </p>
                          <p className="text-sm mt-1">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getTicketStatusColor(ticket.status)}>
                            {ticket.status === 'open' && 'Terbuka'}
                            {ticket.status === 'in-progress' && 'Dalam Proses'}
                            {ticket.status === 'resolved' && 'Diselesaikan'}
                            {ticket.status === 'closed' && 'Ditutup'}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {ticket.reportedDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={getTicketSeverityColor(ticket.severity)}>
                          {ticket.severity === 'low' && 'Rendah'}
                          {ticket.severity === 'medium' && 'Sedang'}
                          {ticket.severity === 'high' && 'Tinggi'}
                          {ticket.severity === 'critical' && 'Kritis'}
                        </Badge>
                        <Badge variant="outline">
                          <Users className="h-3 w-3 mr-1" />
                          {ticket.assignedTo}
                        </Badge>
                        <Badge variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Jatuh Tempo: {ticket.dueDate}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {ticket.status === 'open' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Users className="h-4 w-4 mr-2" />
                              Assign Teknisi
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Wrench className="h-4 w-4 mr-2" />
                              Mulai Perbaikan
                            </Button>
                          </>
                        )}
                        {ticket.status === 'in-progress' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tandai Selesai
                          </Button>
                        )}
                        {ticket.status === 'resolved' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Buat Laporan
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spare-parts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Spare Part</CardTitle>
              <CardDescription>Daftar spare part peralatan dan stoknya</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {spareParts.map(part => (
                  <Card key={part.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{part.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Untuk: {part.equipmentName}
                          </p>
                          <p className="text-sm">Part #: {part.partNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{part.currentStock} {part.unit}</p>
                          <p className="text-xs text-muted-foreground">Stok Tersedia</p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Pemasok</p>
                          <p className="font-medium">{part.supplier}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Harga Satuan</p>
                          <p className="font-medium">
                            Rp {(part.unitPrice).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Minimal Stok</p>
                          <p className="font-medium">{part.minStock} {part.unit}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Terakhir Restock</p>
                          <p className="font-medium">{part.lastRestock}</p>
                        </div>
                      </div>

                      {part.currentStock <= part.minStock && (
                        <div className="mt-3 p-3 bg-red-50 rounded border border-red-200">
                          <p className="text-red-700 font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            Stok hampir habis! Segera lakukan pemesanan.
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Package className="h-4 w-4 mr-2" />
                          Update Stok
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Wrench className="h-4 w-4 mr-2" />
                          Pesan Part
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Kinerja Peralatan</CardTitle>
              <CardDescription>Analisis dan monitoring kinerja peralatan rumah sakit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipments.map(equipment => (
                  <Card key={equipment.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{equipment.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {equipment.brand} {equipment.model}
                          </p>
                          <p className="text-sm">SN: {equipment.serialNumber}</p>
                        </div>
                        <Badge className={getEquipmentStatusColor(equipment.status)}>
                          {equipment.status === 'operational' && 'Operasional'}
                          {equipment.status === 'maintenance' && 'Perawatan'}
                          {equipment.status === 'out-of-order' && 'Rusak'}
                          {equipment.status === 'decommissioned' && 'Tidak Digunakan'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Lokasi</p>
                          <p className="font-medium">{equipment.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kategori</p>
                          <p className="font-medium">{equipment.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Garansi Habis</p>
                          <p className="font-medium">{equipment.warrantyExpiry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Perawatan Berikutnya</p>
                          <p className="font-medium">{equipment.nextMaintenance}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Detail Peralatan
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Wrench className="h-4 w-4 mr-2" />
                          Jadwalkan Perawatan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}