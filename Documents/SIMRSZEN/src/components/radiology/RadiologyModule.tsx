import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scan, Film, Calendar, FileText, AlertTriangle, 
  Search, Clock, CheckCircle, XCircle, 
  User, Users, Monitor, Package
} from "lucide-react";
import DicomViewer from "./DicomViewer";

interface ImagingRequest {
  id: string;
  patientName: string;
  patientId: string;
  examinationType: string;
  requestedBy: string;
  requestingDepartment: string;
  priority: 'routine' | 'urgent' | 'stat';
  status: 'requested' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  requestDate: string;
  scheduledDate?: string;
  performedBy?: string;
  result?: string;
  images?: string[];
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'in-use' | 'maintenance' | 'out-of-order';
  lastMaintenance: string;
  nextMaintenance: string;
  assignedTechnician: string;
}

interface Radiologist {
  id: string;
  name: string;
  specialty: string;
  schedule: string[];
  availability: boolean;
}

export default function RadiologyModule() {
  const [activeTab, setActiveTab] = useState('request-management');
  const [selectedImage, setSelectedImage] = useState<ImagingRequest | null>(null);
  
  const [requests, setRequests] = useState<ImagingRequest[]>([
    {
      id: 'img-1',
      patientName: 'Ahmad Fauzi',
      patientId: 'pat-1',
      examinationType: 'CT Scan Kepala',
      requestedBy: 'Dr. Andrianto Sp.PD',
      requestingDepartment: 'Penyakit Dalam',
      priority: 'urgent',
      status: 'in-progress',
      requestDate: '2026-04-20',
      scheduledDate: '2026-04-20 09:30',
      performedBy: 'Teknisi Radiologi Budi'
    },
    {
      id: 'img-2',
      patientName: 'Siti Nurhaliza',
      patientId: 'pat-2',
      examinationType: 'USG Abdomen',
      requestedBy: 'Dr. Siti Aisyah Sp.OG',
      requestingDepartment: 'Obstetri & Ginekologi',
      priority: 'routine',
      status: 'scheduled',
      requestDate: '2026-04-19',
      scheduledDate: '2026-04-21 10:00'
    },
    {
      id: 'img-3',
      patientName: 'Budi Santoso',
      patientId: 'pat-3',
      examinationType: 'X-Ray Thorax AP',
      requestedBy: 'Dr. Bambang Sp.An',
      requestingDepartment: 'Anestesiologi',
      priority: 'stat',
      status: 'requested',
      requestDate: '2026-04-20'
    },
    {
      id: 'img-4',
      patientName: 'Laila Putri',
      patientId: 'pat-4',
      examinationType: 'MRI Otak',
      requestedBy: 'Dr. Rina Sp.Rad',
      requestingDepartment: 'Radiologi',
      priority: 'routine',
      status: 'completed',
      requestDate: '2026-04-18',
      scheduledDate: '2026-04-19 14:00',
      performedBy: 'Teknisi Radiologi Sari',
      result: 'Terdapat massa di lobus temporalis kanan, perlu tindaklanjut'
    }
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 'eq-1',
      name: 'CT Scanner Siemens SOMATOM',
      type: 'Computed Tomography',
      status: 'in-use',
      lastMaintenance: '2026-03-15',
      nextMaintenance: '2026-06-15',
      assignedTechnician: 'Ahmad Kurniawan'
    },
    {
      id: 'eq-2',
      name: 'X-Ray Machine General Electric',
      type: 'X-Ray',
      status: 'available',
      lastMaintenance: '2026-04-01',
      nextMaintenance: '2026-07-01',
      assignedTechnician: 'Sari Dewi'
    },
    {
      id: 'eq-3',
      name: 'Ultrasound GE Voluson',
      type: 'Ultrasound',
      status: 'maintenance',
      lastMaintenance: '2026-03-20',
      nextMaintenance: '2026-04-25',
      assignedTechnician: 'Budi Santoso'
    },
    {
      id: 'eq-4',
      name: 'MRI Machine Philips Ingenia',
      type: 'Magnetic Resonance Imaging',
      status: 'available',
      lastMaintenance: '2026-04-10',
      nextMaintenance: '2026-07-10',
      assignedTechnician: 'Rina Hidayati'
    }
  ]);

  const [radiologists, setRadiologists] = useState<Radiologist[]>([
    {
      id: 'rad-1',
      name: 'Dr. Rina SP.Rad(K)',
      specialty: 'Neuroradiologi',
      schedule: ['Senin', 'Rabu', 'Jumat'],
      availability: true
    },
    {
      id: 'rad-2',
      name: 'Dr. Agus Sp.Rad',
      specialty: 'Radiologi Umum',
      schedule: ['Selasa', 'Kamis', 'Sabtu'],
      availability: true
    },
    {
      id: 'rad-3',
      name: 'Dr. Maya Sp.Rad(Ped)',
      specialty: 'Radiologi Pediatrik',
      schedule: ['Senin', 'Selasa', 'Kamis'],
      availability: false
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'routine':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-use':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out-of-order':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fungsi untuk menangani klik pada hasil pemeriksaan untuk melihat DICOM
  const handleViewDicom = (request: ImagingRequest) => {
    setSelectedImage(request);
    setActiveTab('dicom-viewer');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scan className="h-8 w-8" />
            Radiologi
          </h1>
          <p className="text-muted-foreground">Manajemen pemeriksaan imaging dan PACS</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Tambah Permintaan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Permintaan Hari Ini</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.requestDate === '2026-04-20').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selesai Hari Ini</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'completed' && r.requestDate === '2026-04-20').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dalam Proses</p>
                <p className="text-2xl font-bold">
                  {requests.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Scan className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Peralatan Aktif</p>
                <p className="text-2xl font-bold">
                  {equipment.filter(e => e.status === 'available' || e.status === 'in-use').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="request-management" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Manajemen Permintaan</span>
          </TabsTrigger>
          <TabsTrigger value="equipment-management" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Manajemen Peralatan</span>
          </TabsTrigger>
          <TabsTrigger value="pacs-integration" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>PACS & Imaging</span>
          </TabsTrigger>
          <TabsTrigger value="dicom-viewer" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>DICOM Viewer</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Permintaan Pemeriksaan</CardTitle>
              <CardDescription>Pengelolaan permintaan pemeriksaan imaging dari klinisi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.map(request => (
                  <Card key={request.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">#{request.id} - {request.examinationType}</h3>
                          <p className="text-sm text-muted-foreground">Pasien: {request.patientName}</p>
                          <p className="text-sm">Diminta oleh: {request.requestedBy}</p>
                          <p className="text-sm">Departemen: {request.requestingDepartment}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority === 'stat' && 'STAT'}
                            {request.priority === 'urgent' && 'URGENT'}
                            {request.priority === 'routine' && 'ROUTINE'}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Tgl. Permintaan: {request.requestDate}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status === 'requested' && 'Baru Diajukan'}
                          {request.status === 'scheduled' && 'Terjadwal'}
                          {request.status === 'in-progress' && 'Sedang Dikerjakan'}
                          {request.status === 'completed' && 'Selesai'}
                          {request.status === 'cancelled' && 'Dibatalkan'}
                        </Badge>
                        
                        {request.scheduledDate && (
                          <Badge variant="outline">
                            <Calendar className="h-3 w-3 mr-1" />
                            {request.scheduledDate}
                          </Badge>
                        )}
                        
                        {request.performedBy && (
                          <Badge variant="outline">
                            <User className="h-3 w-3 mr-1" />
                            {request.performedBy}
                          </Badge>
                        )}
                      </div>

                      {request.result && (
                        <div className="mt-3 p-3 bg-blue-50 rounded border">
                          <p className="font-medium">Hasil Pemeriksaan:</p>
                          <p className="text-sm">{request.result}</p>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        {request.status === 'requested' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Calendar className="h-4 w-4 mr-2" />
                              Jadwalkan
                            </Button>
                            <Button size="sm" className="flex-1">
                              <XCircle className="h-4 w-4 mr-2" />
                              Batalkan
                            </Button>
                          </>
                        )}
                        {request.status === 'scheduled' && (
                          <Button size="sm" className="w-full">
                            <Scan className="h-4 w-4 mr-2" />
                            Mulai Pemeriksaan
                          </Button>
                        )}
                        {request.status === 'in-progress' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesaikan Pemeriksaan
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleViewDicom(request)}
                          >
                            <Film className="h-4 w-4 mr-2" />
                            Lihat Citra DICOM
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

        <TabsContent value="equipment-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Peralatan Radiologi</CardTitle>
              <CardDescription>Pemantauan status dan perawatan peralatan imaging</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipment.map(item => (
                  <Card key={item.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.type}</p>
                          <p className="text-sm mt-1">Teknisi: {item.assignedTechnician}</p>
                        </div>
                        <Badge className={getEquipmentStatusColor(item.status)}>
                          {item.status === 'available' && 'Tersedia'}
                          {item.status === 'in-use' && 'Digunakan'}
                          {item.status === 'maintenance' && 'Perawatan'}
                          {item.status === 'out-of-order' && 'Rusak'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Perawatan Terakhir</p>
                          <p className="font-medium">{item.lastMaintenance}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Perawatan Berikutnya</p>
                          <p className="font-medium">{item.nextMaintenance}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Monitor className="h-4 w-4 mr-2" />
                          Detail Peralatan
                        </Button>
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4" />
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

        <TabsContent value="pacs-integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistem PACS (Picture Archiving and Communication System)</CardTitle>
              <CardDescription>Manajemen citra medis dan arsip pemeriksaan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Film className="h-5 w-5 text-blue-500" />
                        Arsip Citra
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <p className="font-medium">CT Scan Kepala - Ahmad Fauzi</p>
                            <p className="text-sm text-muted-foreground">20 Apr 2026 • DICOM</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDicom(requests[0])}
                          >
                            <Film className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <p className="font-medium">USG Abdomen - Siti Nurhaliza</p>
                            <p className="text-sm text-muted-foreground">19 Apr 2026 • DICOM</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Film className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 border rounded flex items-center justify-between">
                          <div>
                            <p className="font-medium">X-Ray Thorax - Budi Santoso</p>
                            <p className="text-sm text-muted-foreground">18 Apr 2026 • DICOM</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Film className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-500" />
                        Radiologis Tersedia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {radiologists.map(rad => (
                          <div 
                            key={rad.id} 
                            className={`p-3 border rounded flex items-center justify-between ${
                              rad.availability ? '' : 'opacity-50'
                            }`}
                          >
                            <div>
                              <p className="font-medium">{rad.name}</p>
                              <p className="text-sm text-muted-foreground">{rad.specialty}</p>
                              <p className="text-xs mt-1">Jadwal: {rad.schedule.join(', ')}</p>
                            </div>
                            <Badge variant={rad.availability ? "default" : "secondary"}>
                              {rad.availability ? 'Tersedia' : 'Tidak Tersedia'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Viewer Citra DICOM</CardTitle>
                    <CardDescription>Visualisasi dan interpretasi citra medis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Film className="h-12 w-12 mx-auto mb-2" />
                        <p>Area Tampilan Citra DICOM</p>
                        <p className="text-sm mt-1">PACS Integration akan ditampilkan di sini</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Tambahkan Interpretasi
                      </Button>
                      <Button className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Selesaikan Laporan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dicom-viewer" className="space-y-4">
          {selectedImage ? (
            <DicomViewer 
              image={{
                id: selectedImage.id,
                patientId: selectedImage.patientId,
                patientName: selectedImage.patientName,
                studyDate: selectedImage.requestDate,
                modality: selectedImage.examinationType.split(' ')[0], // Ambil modalitas dari nama pemeriksaan
                bodyPart: selectedImage.examinationType.includes('Kepala') ? 'Kepala' : 
                         selectedImage.examinationType.includes('Thorax') ? 'Thorax' : 
                         selectedImage.examinationType.includes('Abdomen') ? 'Abdomen' : 'Umum',
                imageUrl: `/api/dicom/image/${selectedImage.id}`,
                seriesDescription: selectedImage.examinationType,
                imageCount: 25 // Jumlah gambar simulasi
              }} 
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Film className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Pilih Citra untuk Dilihat</h3>
                <p className="text-gray-500">Klik tombol "Lihat Citra DICOM" pada hasil pemeriksaan untuk menampilkan viewer</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}