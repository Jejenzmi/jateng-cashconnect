import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bed, HeartPulse, Monitor, Calendar, 
  Users, FileText, Search, Filter,
  Clock, CheckCircle, AlertTriangle, XCircle
} from "lucide-react";
import { inpatientModuleConfig } from "@/config/inpatient-module.config";

interface Bed {
  id: string;
  roomNumber: string;
  bedNumber: string;
  floor: string;
  roomType: string;
  status: 'available' | 'occupied' | 'maintenance' | 'quarantine';
  patientId?: string;
  patientName?: string;
  admittedDate?: string;
}

interface Patient {
  id: string;
  name: string;
  roomNumber: string;
  bedNumber: string;
  admissionDate: string;
  attendingDoctor: string;
  diagnosis: string;
  vitalSigns?: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
}

export default function InpatientModule() {
  const [activeTab, setActiveTab] = useState('bed-management');
  const [beds, setBeds] = useState<Bed[]>([
    {
      id: 'bed-1',
      roomNumber: '201',
      bedNumber: 'B-01',
      floor: '2',
      roomType: 'Kelas I',
      status: 'occupied',
      patientId: 'pat-1',
      patientName: 'Ahmad Fauzi',
      admittedDate: '2026-04-15'
    },
    {
      id: 'bed-2',
      roomNumber: '201',
      bedNumber: 'B-02',
      floor: '2',
      roomType: 'Kelas I',
      status: 'available'
    },
    {
      id: 'bed-3',
      roomNumber: '202',
      bedNumber: 'B-01',
      floor: '2',
      roomType: 'VIP',
      status: 'occupied',
      patientId: 'pat-2',
      patientName: 'Siti Nurhaliza',
      admittedDate: '2026-04-16'
    },
    {
      id: 'bed-4',
      roomNumber: '203',
      bedNumber: 'B-01',
      floor: '2',
      roomType: 'Kelas II',
      status: 'maintenance'
    },
    {
      id: 'bed-5',
      roomNumber: '301',
      bedNumber: 'B-01',
      floor: '3',
      roomType: 'ICU',
      status: 'occupied',
      patientId: 'pat-3',
      patientName: 'Budi Santoso',
      admittedDate: '2026-04-17'
    },
    {
      id: 'bed-6',
      roomNumber: '302',
      bedNumber: 'B-01',
      floor: '3',
      roomType: 'ICU',
      status: 'available'
    }
  ]);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'pat-1',
      name: 'Ahmad Fauzi',
      roomNumber: '201',
      bedNumber: 'B-01',
      admissionDate: '2026-04-15',
      attendingDoctor: 'Dr. Andrianto Sp.PD',
      diagnosis: 'Pneumonia',
      vitalSigns: {
        temperature: 37.2,
        bloodPressure: '120/80',
        heartRate: 78,
        respiratoryRate: 18,
        oxygenSaturation: 98
      }
    },
    {
      id: 'pat-2',
      name: 'Siti Nurhaliza',
      roomNumber: '202',
      bedNumber: 'B-01',
      admissionDate: '2026-04-16',
      attendingDoctor: 'Dr. Siti Aisyah Sp.OG',
      diagnosis: 'Post-op Caesarean Section',
      vitalSigns: {
        temperature: 36.8,
        bloodPressure: '110/70',
        heartRate: 72,
        respiratoryRate: 16,
        oxygenSaturation: 99
      }
    },
    {
      id: 'pat-3',
      name: 'Budi Santoso',
      roomNumber: '301',
      bedNumber: 'B-01',
      admissionDate: '2026-04-17',
      attendingDoctor: 'Dr. Bambang Sp.An',
      diagnosis: 'Trauma Kepala Berat',
      vitalSigns: {
        temperature: 37.5,
        bloodPressure: '140/90',
        heartRate: 90,
        respiratoryRate: 22,
        oxygenSaturation: 95
      }
    }
  ]);

  const getBedStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'occupied':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'quarantine':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVitalSignStatus = (vital: keyof Patient['vitalSigns'], value: any) => {
    if (!value) return 'text-gray-500';
    
    switch (vital) {
      case 'temperature':
        return value > 37.5 ? 'text-red-500' : value < 36.0 ? 'text-blue-500' : 'text-green-500';
      case 'heartRate':
        return value > 100 || value < 60 ? 'text-red-500' : 'text-green-500';
      case 'respiratoryRate':
        return value > 20 || value < 12 ? 'text-red-500' : 'text-green-500';
      case 'oxygenSaturation':
        return value < 95 ? 'text-red-500' : 'text-green-500';
      case 'bloodPressure':
        const [systolic, diastolic] = value.split('/').map(Number);
        return systolic > 140 || diastolic > 90 ? 'text-red-500' : 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const availableBeds = beds.filter(bed => bed.status === 'available').length;
  const occupiedBeds = beds.filter(bed => bed.status === 'occupied').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'maintenance').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bed className="h-8 w-8" />
            Rawat Inap
          </h1>
          <p className="text-muted-foreground">Manajemen pasien rawat inap dan fasilitas perawatan</p>
        </div>
        <Button>
          <Bed className="h-4 w-4 mr-2" />
          Tambah Pasien
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bed className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tempat Tidur Tersedia</p>
                <p className="text-2xl font-bold">{availableBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pasien Terdaftar</p>
                <p className="text-2xl font-bold">{occupiedBeds}</p>
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
                <p className="text-sm text-muted-foreground">Perawatan</p>
                <p className="text-2xl font-bold">{maintenanceBeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Monitor className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ICU/CCU</p>
                <p className="text-2xl font-bold">
                  {beds.filter(b => b.roomType === 'ICU' && b.status === 'occupied').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="bed-management" className="flex items-center gap-2">
            <Bed className="h-4 w-4" />
            <span>Manajemen Kamar</span>
          </TabsTrigger>
          <TabsTrigger value="patient-monitoring" className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4" />
            <span>Monitoring Pasien</span>
          </TabsTrigger>
          <TabsTrigger value="icu-management" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>ICU/CCU</span>
          </TabsTrigger>
          <TabsTrigger value="schedule-management" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Jadwal Perawatan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bed-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kamar dan Tempat Tidur</CardTitle>
              <CardDescription>Kelola ketersediaan tempat tidur dan informasi pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {beds.map(bed => (
                  <Card key={bed.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{bed.roomNumber}/{bed.bedNumber}</h3>
                          <p className="text-sm text-muted-foreground">{bed.roomType} - Lantai {bed.floor}</p>
                          <p className="text-sm mt-2">
                            {bed.status === 'occupied' && (
                              <>
                                <span className="font-medium">{bed.patientName}</span>
                                <br />
                                <span className="text-xs text-muted-foreground">Dirawat sejak: {bed.admittedDate}</span>
                              </>
                            )}
                            {bed.status === 'maintenance' && (
                              <span className="text-xs text-muted-foreground">Perlu perawatan</span>
                            )}
                          </p>
                        </div>
                        <Badge className={getBedStatusColor(bed.status)}>
                          {bed.status === 'available' && 'Tersedia'}
                          {bed.status === 'occupied' && 'Terisi'}
                          {bed.status === 'maintenance' && 'Perawatan'}
                          {bed.status === 'quarantine' && 'Karantina'}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">
                          Detail
                        </Button>
                        {bed.status === 'available' && (
                          <Button size="sm">
                            Assign
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

        <TabsContent value="patient-monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Pasien Rawat Inap</CardTitle>
              <CardDescription>Pantau kondisi vital dan perkembangan pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map(patient => (
                  <Card key={patient.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{patient.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Kamar {patient.roomNumber}/{patient.bedNumber} • Dirawat sejak: {patient.admissionDate}
                          </p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Dokter Penanggung Jawab:</span> {patient.attendingDoctor}
                          </p>
                          <p className="text-sm">
                            <span className="font-medium">Diagnosis:</span> {patient.diagnosis}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{patient.roomNumber}/{patient.bedNumber}</Badge>
                        </div>
                      </div>

                      {patient.vitalSigns && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Suhu</p>
                            <p className={`text-lg font-bold ${getVitalSignStatus('temperature', patient.vitalSigns.temperature)}`}>
                              {patient.vitalSigns.temperature}°C
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">TD</p>
                            <p className={`text-lg font-bold ${getVitalSignStatus('bloodPressure', patient.vitalSigns.bloodPressure)}`}>
                              {patient.vitalSigns.bloodPressure}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Nadi</p>
                            <p className={`text-lg font-bold ${getVitalSignStatus('heartRate', patient.vitalSigns.heartRate)}`}>
                              {patient.vitalSigns.heartRate}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">RR</p>
                            <p className={`text-lg font-bold ${getVitalSignStatus('respiratoryRate', patient.vitalSigns.respiratoryRate)}`}>
                              {patient.vitalSigns.respiratoryRate}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">SpO₂</p>
                            <p className={`text-lg font-bold ${getVitalSignStatus('oxygenSaturation', patient.vitalSigns.oxygenSaturation)}`}>
                              {patient.vitalSigns.oxygenSaturation}%
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          Detail Pasien
                        </Button>
                        <Button variant="outline" size="sm">
                          Catat Vital Signs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="icu-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen ICU/CCU</CardTitle>
              <CardDescription>Pemantauan intensif pasien kritis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-red-500" />
                      Peralatan Medis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>ECG Monitor</span>
                        <Badge variant="secondary">Operasional</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Ventilator</span>
                        <Badge variant="destructive">Perlu Perawatan</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Infusion Pump</span>
                        <Badge variant="secondary">Operasional</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Syringe Pump</span>
                        <Badge variant="secondary">Operasional</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      Staff ICU
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Dr. Bambang Sp.An</span>
                        <Badge variant="outline">On Duty</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Perawat Siti A.</span>
                        <Badge variant="outline">On Duty</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Perawat Ahmad F.</span>
                        <Badge variant="outline">Off Duty</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 border rounded">
                        <span>Resepsionis</span>
                        <Badge variant="outline">On Duty</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Jadwal Perawatan Pasien</CardTitle>
              <CardDescription>Atur jadwal pemeriksaan, obat, dan perawatan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Hari Ini</h3>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Ganti Tanggal
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {patients.map(patient => (
                    <div key={patient.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-sm text-muted-foreground">Kamar {patient.roomNumber}/{patient.bedNumber}</p>
                        </div>
                        <Badge variant="outline">{patient.diagnosis}</Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>08:00</span>
                          <span className="text-muted-foreground">-</span>
                          <span>Pagi: Pemeriksaan Rutin</span>
                          <Badge variant="outline" className="ml-auto">Dokter</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>10:00</span>
                          <span className="text-muted-foreground">-</span>
                          <span>Obat: Paracetamol 500mg</span>
                          <Badge variant="outline" className="ml-auto">Perawat</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>14:00</span>
                          <span className="text-muted-foreground">-</span>
                          <span>Siang: Evaluasi Kondisi</span>
                          <Badge variant="outline" className="ml-auto">Dokter</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}