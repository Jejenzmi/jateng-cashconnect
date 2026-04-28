import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HeartPulse, Ambulance, User, Users, 
  Calendar, Clock, FileText, AlertTriangle,
  Phone, MapPin, Stethoscope, Syringe,
  CheckCircle, XCircle, Activity
} from "lucide-react";

interface EmergencyCase {
  id: string;
  caseNumber: string;
  patientName: string;
  age: number;
  gender: 'L' | 'P';
  arrivalTime: string;
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1 = Emergent, 5 = Non-urgent
  chiefComplaint: string;
  attendingDoctor: string;
  status: 'waiting' | 'in-progress' | 'completed' | 'transferred' | 'discharged';
  emergencyType: 'trauma' | 'medical' | 'pediatric' | 'obstetric';
  priority: 'immediate' | 'urgent' | 'semi-urgent' | 'non-urgent';
}

interface EmergencyResource {
  id: string;
  name: string;
  type: 'bed' | 'equipment' | 'staff';
  status: 'available' | 'occupied' | 'maintenance' | 'unavailable';
  location: string;
  assignedTo?: string;
}

interface AmbulanceCall {
  id: string;
  caseNumber: string;
  patientName: string;
  pickupLocation: string;
  destination: string;
  status: 'dispatched' | 'en-route' | 'arrived' | 'transfer-completed';
  dispatchedTime: string;
  estimatedArrival: string;
  crew: string[];
}

export default function EmergencyModule() {
  const [activeTab, setActiveTab] = useState('emergency-cases');
  
  const [emergencyCases, setEmergencyCases] = useState<EmergencyCase[]>([
    {
      id: 'emg-1',
      caseNumber: 'IGD-20260420-001',
      patientName: 'Ahmad Fauzi',
      age: 45,
      gender: 'L',
      arrivalTime: '2026-04-20 08:30',
      triageLevel: 2,
      chiefComplaint: 'Nyeri dada mendadak',
      attendingDoctor: 'Dr. Andrianto Sp.EM',
      status: 'in-progress',
      emergencyType: 'medical',
      priority: 'urgent'
    },
    {
      id: 'emg-2',
      caseNumber: 'IGD-20260420-002',
      patientName: 'Siti Nurhaliza',
      age: 32,
      gender: 'P',
      arrivalTime: '2026-04-20 09:15',
      triageLevel: 3,
      chiefComplaint: 'Nyeri perut hebat',
      attendingDoctor: 'Dr. Rina Sp.Bed',
      status: 'waiting',
      emergencyType: 'medical',
      priority: 'semi-urgent'
    },
    {
      id: 'emg-3',
      caseNumber: 'IGD-20260420-003',
      patientName: 'Budi Santoso',
      age: 28,
      gender: 'L',
      arrivalTime: '2026-04-20 09:45',
      triageLevel: 1,
      chiefComplaint: 'Kecelakaan lalu lintas, fraktur terbuka',
      attendingDoctor: 'Dr. Agus Sp.Ortho',
      status: 'in-progress',
      emergencyType: 'trauma',
      priority: 'immediate'
    },
    {
      id: 'emg-4',
      caseNumber: 'IGD-20260420-004',
      patientName: 'Laila Putri',
      age: 26,
      gender: 'P',
      arrivalTime: '2026-04-20 10:20',
      triageLevel: 4,
      chiefComplaint: 'Demam tinggi',
      attendingDoctor: 'Dr. Maya Sp.PD',
      status: 'waiting',
      emergencyType: 'medical',
      priority: 'semi-urgent'
    }
  ]);

  const [resources, setResources] = useState<EmergencyResource[]>([
    {
      id: 'bed-1',
      name: 'Tempat Tidur IGD 1',
      type: 'bed',
      status: 'occupied',
      location: 'Zona Merah',
      assignedTo: 'emg-3'
    },
    {
      id: 'bed-2',
      name: 'Tempat Tidur IGD 2',
      type: 'bed',
      status: 'occupied',
      location: 'Zona Kuning',
      assignedTo: 'emg-1'
    },
    {
      id: 'bed-3',
      name: 'Tempat Tidur IGD 3',
      type: 'bed',
      status: 'available',
      location: 'Zona Hijau'
    },
    {
      id: 'bed-4',
      name: 'Tempat Tidur IGD 4',
      type: 'bed',
      status: 'available',
      location: 'Zona Hijau'
    },
    {
      id: 'eq-1',
      name: 'Defibrillator',
      type: 'equipment',
      status: 'occupied',
      location: 'Zona Merah',
      assignedTo: 'emg-3'
    },
    {
      id: 'eq-2',
      name: 'Ventilator',
      type: 'equipment',
      status: 'available',
      location: 'Zona Kuning'
    },
    {
      id: 'staff-1',
      name: 'Perawat IGD A',
      type: 'staff',
      status: 'occupied',
      location: 'Zona Merah',
      assignedTo: 'emg-3'
    },
    {
      id: 'staff-2',
      name: 'Perawat IGD B',
      type: 'staff',
      status: 'occupied',
      location: 'Zona Kuning',
      assignedTo: 'emg-1'
    }
  ]);

  const [ambulanceCalls, setAmbulanceCalls] = useState<AmbulanceCall[]>([
    {
      id: 'amb-1',
      caseNumber: 'IGD-20260420-005',
      patientName: 'Rudi Hartono',
      pickupLocation: 'Jl. Merdeka No. 123, Jakarta',
      destination: 'Rumah Sakit Sehat Jelita',
      status: 'en-route',
      dispatchedTime: '2026-04-20 10:45',
      estimatedArrival: '2026-04-20 11:05',
      crew: ['Supir: Budi', 'Paramedis: Sari', 'Paramedis: Anton']
    },
    {
      id: 'amb-2',
      caseNumber: 'IGD-20260420-006',
      patientName: 'Tuti Rahayu',
      pickupLocation: 'Jl. Sudirman Kav. 50, Jakarta',
      destination: 'Rumah Sakit Sehat Jelita',
      status: 'dispatched',
      dispatchedTime: '2026-04-20 11:00',
      estimatedArrival: '2026-04-20 11:25',
      crew: ['Supir: Joko', 'Paramedis: Dian', 'Paramedis: Eko']
    }
  ]);

  const getTriageColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-100 text-red-800 border-red-200'; // Emergent
      case 2:
        return 'bg-orange-100 text-orange-800 border-orange-200'; // Urgent
      case 3:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Semi-urgent
      case 4:
        return 'bg-green-100 text-green-800 border-green-200'; // Non-urgent
      case 5:
        return 'bg-blue-100 text-blue-800 border-blue-200'; // Deferred
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'transferred':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'discharged':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'en-route':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'arrived':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'transfer-completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unavailable':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const urgentCases = emergencyCases.filter(c => c.triageLevel <= 2).length;
  const availableBeds = resources.filter(r => r.type === 'bed' && r.status === 'available').length;
  const occupiedBeds = resources.filter(r => r.type === 'bed' && r.status === 'occupied').length;
  const waitingCases = emergencyCases.filter(c => c.status === 'waiting').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <HeartPulse className="h-8 w-8" />
            Instalasi Gawat Darurat
          </h1>
          <p className="text-muted-foreground">Manajemen kasus darurat dan trauma</p>
        </div>
        <Button>
          <Ambulance className="h-4 w-4 mr-2" />
          Terima Kasus Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kasus Urgent</p>
                <p className="text-2xl font-bold">{urgentCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempat Tersedia</p>
                <p className="text-2xl font-bold">{availableBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Menunggu</p>
                <p className="text-2xl font-bold">{waitingCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Ambulance className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ambulans Aktif</p>
                <p className="text-2xl font-bold">
                  {ambulanceCalls.filter(a => a.status !== 'transfer-completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emergency-cases" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span>Kasus Darurat</span>
          </TabsTrigger>
          <TabsTrigger value="resource-management" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Manajemen Fasilitas</span>
          </TabsTrigger>
          <TabsTrigger value="ambulance-service" className="flex items-center gap-2">
            <Ambulance className="h-4 w-4" />
            <span>Layanan Ambulans</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emergency-cases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kasus Gawat Darurat</CardTitle>
              <CardDescription>Pemantauan dan penanganan kasus darurat</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencyCases.map(emergencyCase => (
                  <Card key={emergencyCase.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{emergencyCase.caseNumber} - {emergencyCase.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {emergencyCase.age} thn, {emergencyCase.gender === 'L' ? 'Laki-laki' : 'Perempuan'} • Datang: {emergencyCase.arrivalTime}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Keluhan Utama:</span> {emergencyCase.chiefComplaint}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Dokter:</span> {emergencyCase.attendingDoctor}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getTriageColor(emergencyCase.triageLevel)}>
                            Triage {emergencyCase.triageLevel}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            {emergencyCase.emergencyType === 'trauma' ? 'Trauma' : 
                             emergencyCase.emergencyType === 'medical' ? 'Medis' : 
                             emergencyCase.emergencyType === 'pediatric' ? 'Anak' : 'Obstetri'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge className={getStatusColor(emergencyCase.status)}>
                          {emergencyCase.status === 'waiting' && 'Menunggu'}
                          {emergencyCase.status === 'in-progress' && 'Ditangani'}
                          {emergencyCase.status === 'completed' && 'Selesai'}
                          {emergencyCase.status === 'transferred' && 'Dirujuk'}
                          {emergencyCase.status === 'discharged' && 'Dipulangkan'}
                        </Badge>
                        
                        <Badge variant="outline">
                          {emergencyCase.priority === 'immediate' && 'Segera'}
                          {emergencyCase.priority === 'urgent' && 'Urgen'}
                          {emergencyCase.priority === 'semi-urgent' && 'Semi Urgen'}
                          {emergencyCase.priority === 'non-urgent' && 'Non Urgen'}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {emergencyCase.status === 'waiting' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Stethoscope className="h-4 w-4 mr-2" />
                              Tangani
                            </Button>
                            <Button size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Panggil Dokter
                            </Button>
                          </>
                        )}
                        {emergencyCase.status === 'in-progress' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Selesaikan Pemeriksaan
                          </Button>
                        )}
                        {emergencyCase.status === 'completed' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <FileText className="h-4 w-4 mr-2" />
                              Cetak Laporan
                            </Button>
                            <Button size="sm" className="flex-1">
                              <Users className="h-4 w-4 mr-2" />
                              Rujuk ke Unit
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resource-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Fasilitas IGD</CardTitle>
              <CardDescription>Pemantauan ketersediaan tempat tidur, peralatan, dan staf</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      Tempat Tidur
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resources.filter(r => r.type === 'bed').map(resource => (
                        <div key={resource.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-muted-foreground">{resource.location}</p>
                          </div>
                          <Badge className={getResourceStatusColor(resource.status)}>
                            {resource.status === 'available' && 'Tersedia'}
                            {resource.status === 'occupied' && 'Digunakan'}
                            {resource.status === 'maintenance' && 'Perawatan'}
                            {resource.status === 'unavailable' && 'Tidak Tersedia'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Syringe className="h-5 w-5 text-green-500" />
                      Peralatan & Staf
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[...resources.filter(r => r.type === 'equipment'), ...resources.filter(r => r.type === 'staff')].map(resource => (
                        <div key={resource.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-muted-foreground">{resource.location}</p>
                          </div>
                          <Badge className={getResourceStatusColor(resource.status)}>
                            {resource.status === 'available' && 'Tersedia'}
                            {resource.status === 'occupied' && 'Digunakan'}
                            {resource.status === 'maintenance' && 'Perawatan'}
                            {resource.status === 'unavailable' && 'Tidak Tersedia'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ambulance-service" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Layanan Ambulans</CardTitle>
              <CardDescription>Pemantauan dan koordinasi ambulans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ambulanceCalls.map(call => (
                  <Card key={call.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{call.caseNumber} - {call.patientName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{call.pickupLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{call.destination}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(call.status)}>
                          {call.status === 'dispatched' && 'Dikirim'}
                          {call.status === 'en-route' && 'Dalam Perjalanan'}
                          {call.status === 'arrived' && 'Tiba di Lokasi'}
                          {call.status === 'transfer-completed' && 'Transfer Selesai'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Dikirim Pada</p>
                          <p className="font-medium">{call.dispatchedTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Perkiraan Tiba</p>
                          <p className="font-medium">{call.estimatedArrival}</p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-1">Kru Ambulans</p>
                        <div className="flex flex-wrap gap-1">
                          {call.crew.map((member, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {call.status === 'dispatched' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tandai Sedang Menuju
                          </Button>
                        )}
                        {call.status === 'en-route' && (
                          <Button size="sm" className="w-full">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Tandai Tiba di Lokasi
                          </Button>
                        )}
                        {call.status === 'arrived' && (
                          <Button size="sm" className="w-full">
                            <Ambulance className="h-4 w-4 mr-2" />
                            Bawa ke RS
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
      </Tabs>
    </div>
  );
}