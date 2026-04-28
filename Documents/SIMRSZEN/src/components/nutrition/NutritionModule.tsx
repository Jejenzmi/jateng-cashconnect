import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Utensils, Activity, FileText, Calendar, 
  User, Users, Stethoscope, AlertTriangle,
  Search, Filter, CheckCircle, XCircle
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  medicalRecordNumber: string;
  age: number;
  gender: 'L' | 'P';
  room: string;
  attendingDoctor: string;
  diagnosis: string;
  dietPlan: string;
  status: 'active' | 'discharged' | 'transferred';
}

interface NutritionMenu {
  id: string;
  name: string;
  description: string;
  type: 'regular' | 'diabetic' | 'cardiac' | 'kidney' | 'liquid' | 'soft';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  allergens: string[];
}

interface MealPlan {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  notes: string;
  status: 'planned' | 'prepared' | 'served' | 'consumed';
}

interface NutritionMonitoring {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  mealConsumed: number; // percentage
  caloriesConsumed: number;
  notes: string;
}

export default function NutritionModule() {
  const [activeTab, setActiveTab] = useState('menu-planning');
  
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 'pat-1',
      name: 'Ahmad Fauzi',
      medicalRecordNumber: 'MR-2026-001',
      age: 55,
      gender: 'L',
      room: '201-A',
      attendingDoctor: 'Dr. Andrianto Sp.PD',
      diagnosis: 'DM Tipe 2 dengan komplikasi nefropati',
      dietPlan: 'Diet DM Rendah Garam',
      status: 'active'
    },
    {
      id: 'pat-2',
      name: 'Siti Nurhaliza',
      medicalRecordNumber: 'MR-2026-002',
      age: 42,
      gender: 'P',
      room: '305-B',
      attendingDoctor: 'Dr. Rina Sp.KDR',
      diagnosis: 'Hipertensi Esensial',
      dietPlan: 'Diet Rendah Garam',
      status: 'active'
    },
    {
      id: 'pat-3',
      name: 'Budi Santoso',
      medicalRecordNumber: 'MR-2026-003',
      age: 68,
      gender: 'L',
      room: 'ICU-01',
      attendingDoctor: 'Dr. Agus Sp.An',
      diagnosis: 'Gagal Ginjal Kronik',
      dietPlan: 'Diet Rendah Protein',
      status: 'active'
    }
  ]);

  const [menus, setMenus] = useState<NutritionMenu[]>([
    {
      id: 'menu-1',
      name: 'Nasi Putih',
      description: 'Nasi putih pulen',
      type: 'regular',
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      ingredients: ['Beras premium'],
      allergens: []
    },
    {
      id: 'menu-2',
      name: 'Ayam Rebus',
      description: 'Dada ayam rebus tanpa kulit',
      type: 'diabetic',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      ingredients: ['Dada ayam', 'Air', 'Garam secukupnya'],
      allergens: []
    },
    {
      id: 'menu-3',
      name: 'Sayur Bayam',
      description: 'Sayur bayam kuah bening',
      type: 'kidney',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      ingredients: ['Bayam', 'Bawang putih', 'Air'],
      allergens: []
    },
    {
      id: 'menu-4',
      name: 'Buah Apel',
      description: 'Apel merah segar',
      type: 'diabetic',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      ingredients: ['Apel merah'],
      allergens: []
    }
  ]);

  const [mealPlans, setMealPlans] = useState<MealPlan[]>([
    {
      id: 'plan-1',
      patientId: 'pat-1',
      patientName: 'Ahmad Fauzi',
      date: '2026-04-20',
      breakfast: 'Oatmeal dengan susu rendah lemak',
      lunch: 'Nasi merah, ayam rebus, tumis brokoli',
      dinner: 'Ikan salmon panggang, sayur bayam, ubi jalar',
      snacks: ['Buah apel', 'Yogurt rendah lemak'],
      notes: 'Hindari gula tambahan',
      status: 'served'
    },
    {
      id: 'plan-2',
      patientId: 'pat-2',
      patientName: 'Siti Nurhaliza',
      date: '2026-04-20',
      breakfast: 'Oatmeal gandum, telur rebus',
      lunch: 'Nasi putih, ikan nila bakar, sayur asem',
      dinner: 'Nasi merah, ayam panggang, sup brokoli',
      snacks: ['Buah pir', 'Kacang almond'],
      notes: 'Garam maksimal 5gr/hari',
      status: 'planned'
    }
  ]);

  const [monitoring, setMonitoring] = useState<NutritionMonitoring[]>([
    {
      id: 'mon-1',
      patientId: 'pat-1',
      patientName: 'Ahmad Fauzi',
      date: '2026-04-20',
      mealTime: 'breakfast',
      mealConsumed: 80,
      caloriesConsumed: 420,
      notes: 'Pasien makan 4/5 porsi, tidak suka oatmeal'
    },
    {
      id: 'mon-2',
      patientId: 'pat-1',
      patientName: 'Ahmad Fauzi',
      date: '2026-04-20',
      mealTime: 'lunch',
      mealConsumed: 100,
      caloriesConsumed: 580,
      notes: 'Pasien makan semua porsi'
    },
    {
      id: 'mon-3',
      patientId: 'pat-2',
      patientName: 'Siti Nurhaliza',
      date: '2026-04-20',
      mealTime: 'breakfast',
      mealConsumed: 90,
      caloriesConsumed: 450,
      notes: 'Pasien makan hampir semua porsi'
    }
  ]);

  const getDietTypeColor = (type: string) => {
    switch (type) {
      case 'diabetic':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cardiac':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'kidney':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'liquid':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'soft':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMealStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'prepared':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'served':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'consumed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPatientStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'discharged':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'transferred':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const activePatients = patients.filter(p => p.status === 'active').length;
  const diabeticDiet = patients.filter(p => p.dietPlan.toLowerCase().includes('dm')).length;
  const cardiacDiet = patients.filter(p => p.dietPlan.toLowerCase().includes('jantung')).length;
  const kidneyDiet = patients.filter(p => p.dietPlan.toLowerCase().includes('ginjal')).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="h-8 w-8" />
            Gizi Klinik
          </h1>
          <p className="text-muted-foreground">Manajemen diet dan nutrisi pasien</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Tambah Rencana Makanan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pasien Aktif</p>
                <p className="text-2xl font-bold">{activePatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Utensils className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diet DM</p>
                <p className="text-2xl font-bold">{diabeticDiet}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diet Jantung</p>
                <p className="text-2xl font-bold">{cardiacDiet}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Diet Ginjal</p>
                <p className="text-2xl font-bold">{kidneyDiet}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="menu-planning" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span>Perencanaan Menu</span>
          </TabsTrigger>
          <TabsTrigger value="patient-nutrition-monitoring" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Monitoring Nutrisi</span>
          </TabsTrigger>
          <TabsTrigger value="diet-reconciliation" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Rekonsiliasi Diet</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu-planning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Perencanaan Menu</CardTitle>
              <CardDescription>Daftar menu sesuai jenis diet pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menus.map(menu => (
                  <Card key={menu.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{menu.name}</h3>
                          <p className="text-sm text-muted-foreground">{menu.description}</p>
                          <p className="text-sm mt-2">
                            <span className="font-medium">Kalori:</span> {menu.calories} kcal
                          </p>
                        </div>
                        <Badge className={getDietTypeColor(menu.type)}>
                          {menu.type === 'regular' && 'Reguler'}
                          {menu.type === 'diabetic' && 'Diabetes'}
                          {menu.type === 'cardiac' && 'Jantung'}
                          {menu.type === 'kidney' && 'Ginjal'}
                          {menu.type === 'liquid' && 'Cair'}
                          {menu.type === 'soft' && 'Lunak'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Protein</p>
                          <p className="font-medium">{menu.protein}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Karbohidrat</p>
                          <p className="font-medium">{menu.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Lemak</p>
                          <p className="font-medium">{menu.fat}g</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Alergen</p>
                          <p className="font-medium">
                            {menu.allergens.length > 0 ? menu.allergens.join(', ') : 'Tidak ada'}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                        <Button size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Gunakan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patient-nutrition-monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Intake Nutrisi</CardTitle>
              <CardDescription>Pemantauan konsumsi makanan pasien</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patients.map(patient => {
                  const patientMonitoring = monitoring.filter(m => m.patientId === patient.id);
                  return (
                    <Card key={patient.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{patient.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              No. MR: {patient.medicalRecordNumber} • Kamar: {patient.room}
                            </p>
                            <p className="text-sm">Diet: {patient.dietPlan}</p>
                          </div>
                          <Badge className={getPatientStatusColor(patient.status)}>
                            {patient.status === 'active' && 'Aktif'}
                            {patient.status === 'discharged' && 'Pulang'}
                            {patient.status === 'transferred' && 'Dirujuk'}
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Catatan Konsumsi Hari Ini:</h4>
                          <div className="space-y-2">
                            {patientMonitoring.length > 0 ? (
                              patientMonitoring.map(record => (
                                <div key={record.id} className="p-3 border rounded flex justify-between">
                                  <div>
                                    <p className="font-medium capitalize">{record.mealTime}</p>
                                    <p className="text-sm text-muted-foreground">{record.date}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">{record.mealConsumed}% dikonsumsi</p>
                                    <p className="text-sm">{record.caloriesConsumed} kcal</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 border rounded text-center text-muted-foreground">
                                Tidak ada catatan konsumsi hari ini
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Activity className="h-4 w-4 mr-2" />
                            Tambah Catatan
                          </Button>
                          <Button size="sm" className="flex-1">
                            <FileText className="h-4 w-4 mr-2" />
                            Cetak Laporan
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diet-reconciliation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rekonsiliasi Diet</CardTitle>
              <CardDescription>Rekonsiliasi diet dengan dokter penanggung jawab</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealPlans.map(plan => {
                  const patient = patients.find(p => p.id === plan.patientId);
                  return (
                    <Card key={plan.id} className="border-2 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{plan.patientName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {patient?.medicalRecordNumber} • {patient?.room}
                            </p>
                            <p className="text-sm">Dokter: {patient?.attendingDoctor}</p>
                          </div>
                          <Badge className={getMealStatusColor(plan.status)}>
                            {plan.status === 'planned' && 'Direncanakan'}
                            {plan.status === 'prepared' && 'Disiapkan'}
                            {plan.status === 'served' && 'Disajikan'}
                            {plan.status === 'consumed' && 'Dikonsumsi'}
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-3">
                          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                            <div>
                              <p className="text-xs text-muted-foreground">Sarapan</p>
                              <p className="font-medium">{plan.breakfast}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Makan Siang</p>
                              <p className="font-medium">{plan.lunch}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Makan Malam</p>
                              <p className="font-medium">{plan.dinner}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Camilan</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {plan.snacks.map((snack, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {snack}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground">Catatan</p>
                            <p className="font-medium">{plan.notes}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Stethoscope className="h-4 w-4 mr-2" />
                            Konsultasi dengan Dokter
                          </Button>
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verifikasi Diet
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}