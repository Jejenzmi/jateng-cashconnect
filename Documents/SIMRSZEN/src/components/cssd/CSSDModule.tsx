import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scissors, FlaskConical, Package, FileText, 
  Calendar, Clock, CheckCircle, AlertTriangle, 
  Search, Filter, Users, Activity
} from "lucide-react";

interface Instrument {
  id: string;
  name: string;
  type: string;
  sterilizationDate: string;
  expiryDate: string;
  batchNumber: string;
  sterilizationMethod: string;
  status: 'ready' | 'in-process' | 'sterilized' | 'distributed' | 'contaminated';
  location: string;
  quantity: number;
}

interface SterilizationProcess {
  id: string;
  instrumentId: string;
  instrumentName: string;
  batchNumber: string;
  startDate: string;
  endDate: string;
  temperature: number;
  pressure: number;
  duration: number;
  operator: string;
  status: 'processing' | 'completed' | 'failed';
}

interface SterileInventory {
  id: string;
  instrumentId: string;
  instrumentName: string;
  batchNumber: string;
  receivedDate: string;
  quantity: number;
  location: string;
  expiryDate: string;
  status: 'available' | 'reserved' | 'disposed';
}

export default function CSSDModule() {
  const [activeTab, setActiveTab] = useState('instrument-tracking');
  
  const [instruments, setInstruments] = useState<Instrument[]>([
    {
      id: 'ins-1',
      name: 'Forceps Chirurgica',
      type: 'Forceps',
      sterilizationDate: '2026-04-20',
      expiryDate: '2026-05-20',
      batchNumber: 'BST-2026-001',
      sterilizationMethod: 'Autoclave',
      status: 'sterilized',
      location: 'Unit Bedah',
      quantity: 5
    },
    {
      id: 'ins-2',
      name: 'Scalpel Handle No. 3',
      type: 'Scalpel',
      sterilizationDate: '2026-04-19',
      expiryDate: '2026-05-19',
      batchNumber: 'BST-2026-002',
      sterilizationMethod: 'Autoclave',
      status: 'distributed',
      location: 'ICU',
      quantity: 3
    },
    {
      id: 'ins-3',
      name: 'Klem Artery',
      type: 'Clamp',
      sterilizationDate: '2026-04-20',
      expiryDate: '2026-05-20',
      batchNumber: 'BST-2026-003',
      sterilizationMethod: 'Gas Plasma',
      status: 'ready',
      location: 'CSSD',
      quantity: 8
    },
    {
      id: 'ins-4',
      name: 'Pin Bedah',
      type: 'Surgical Pin',
      sterilizationDate: '2026-04-18',
      expiryDate: '2026-05-18',
      batchNumber: 'BST-2026-004',
      sterilizationMethod: 'Ethylene Oxide',
      status: 'in-process',
      location: 'CSSD',
      quantity: 20
    }
  ]);

  const [processes, setProcesses] = useState<SterilizationProcess[]>([
    {
      id: 'proc-1',
      instrumentId: 'ins-4',
      instrumentName: 'Pin Bedah',
      batchNumber: 'BST-2026-004',
      startDate: '2026-04-20 08:00',
      endDate: '2026-04-20 09:30',
      temperature: 134,
      pressure: 2.1,
      duration: 15,
      operator: 'Suster Ani',
      status: 'processing'
    },
    {
      id: 'proc-2',
      instrumentId: 'ins-1',
      instrumentName: 'Forceps Chirurgica',
      batchNumber: 'BST-2026-001',
      startDate: '2026-04-20 07:00',
      endDate: '2026-04-20 08:00',
      temperature: 121,
      pressure: 1.0,
      duration: 15,
      operator: 'Suster Budi',
      status: 'completed'
    }
  ]);

  const [inventory, setInventory] = useState<SterileInventory[]>([
    {
      id: 'inv-1',
      instrumentId: 'ins-1',
      instrumentName: 'Forceps Chirurgica',
      batchNumber: 'BST-2026-001',
      receivedDate: '2026-04-20',
      quantity: 5,
      location: 'Unit Bedah',
      expiryDate: '2026-05-20',
      status: 'available'
    },
    {
      id: 'inv-2',
      instrumentId: 'ins-3',
      instrumentName: 'Klem Artery',
      batchNumber: 'BST-2026-003',
      receivedDate: '2026-04-20',
      quantity: 8,
      location: 'CSSD',
      expiryDate: '2026-05-20',
      status: 'available'
    },
    {
      id: 'inv-3',
      instrumentId: 'ins-2',
      instrumentName: 'Scalpel Handle No. 3',
      batchNumber: 'BST-2026-002',
      receivedDate: '2026-04-19',
      quantity: 3,
      location: 'ICU',
      expiryDate: '2026-05-19',
      status: 'reserved'
    }
  ]);

  const getInstrumentStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-process':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'sterilized':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'distributed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'contaminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProcessStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'disposed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const readyInstruments = instruments.filter(i => i.status === 'ready').length;
  const inProcessInstruments = instruments.filter(i => i.status === 'in-process').length;
  const sterilizedInstruments = instruments.filter(i => i.status === 'sterilized').length;
  const contaminatedInstruments = instruments.filter(i => i.status === 'contaminated').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scissors className="h-8 w-8" />
            CSSD (Central Sterile Supply Department)
          </h1>
          <p className="text-muted-foreground">Manajemen sterilisasi alat medis dan perlengkapan medis</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Tambah Alat
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Scissors className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alat Siap Pakai</p>
                <p className="text-2xl font-bold">{readyInstruments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dalam Proses</p>
                <p className="text-2xl font-bold">{inProcessInstruments}</p>
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
                <p className="text-sm text-muted-foreground">Steril</p>
                <p className="text-2xl font-bold">{sterilizedInstruments}</p>
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
                <p className="text-sm text-muted-foreground">Kontaminasi</p>
                <p className="text-2xl font-bold">{contaminatedInstruments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="instrument-tracking" className="flex items-center gap-2">
            <Scissors className="h-4 w-4" />
            <span>Pelacakan Alat</span>
          </TabsTrigger>
          <TabsTrigger value="sterilization-process" className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4" />
            <span>Proses Sterilisasi</span>
          </TabsTrigger>
          <TabsTrigger value="sterile-inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>Persediaan Steril</span>
          </TabsTrigger>
          <TabsTrigger value="batch-records" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Catatan Batch</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="instrument-tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pelacakan Alat Medis</CardTitle>
              <CardDescription>Daftar alat medis beserta status sterilisasinya</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {instruments.map(instrument => (
                  <Card key={instrument.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{instrument.name}</h3>
                          <p className="text-sm text-muted-foreground">Tipe: {instrument.type}</p>
                          <p className="text-sm">Batch: {instrument.batchNumber}</p>
                          <p className="text-sm">Lokasi: {instrument.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getInstrumentStatusColor(instrument.status)}>
                            {instrument.status === 'ready' && 'Siap Sterilisasi'}
                            {instrument.status === 'in-process' && 'Dalam Proses'}
                            {instrument.status === 'sterilized' && 'Steril'}
                            {instrument.status === 'distributed' && 'Didistribusikan'}
                            {instrument.status === 'contaminated' && 'Kontaminasi'}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Metode: {instrument.sterilizationMethod}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Tanggal Sterilisasi</p>
                          <p className="font-medium">{instrument.sterilizationDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kadaluarsa</p>
                          <p className="font-medium">{instrument.expiryDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Activity className="h-4 w-4 mr-2" />
                          Proses Sterilisasi
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sterilization-process" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proses Sterilisasi</CardTitle>
              <CardDescription>Monitoring proses sterilisasi alat medis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processes.map(process => (
                  <Card key={process.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{process.instrumentName}</h3>
                          <p className="text-sm text-muted-foreground">Batch: {process.batchNumber}</p>
                          <p className="text-sm">Operator: {process.operator}</p>
                        </div>
                        <Badge className={getProcessStatusColor(process.status)}>
                          {process.status === 'processing' && 'Dalam Proses'}
                          {process.status === 'completed' && 'Selesai'}
                          {process.status === 'failed' && 'Gagal'}
                        </Badge>
                      </div>

                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Mulai</p>
                          <p className="font-medium">{process.startDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Selesai</p>
                          <p className="font-medium">{process.endDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Suhu (°C)</p>
                          <p className="font-medium">{process.temperature}°C</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Durasi (mnt)</p>
                          <p className="font-medium">{process.duration}mnt</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {process.status === 'processing' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Clock className="h-4 w-4 mr-2" />
                              Monitor
                            </Button>
                            <Button size="sm" className="flex-1">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Tandai Selesai
                            </Button>
                          </>
                        )}
                        {process.status === 'completed' && (
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

        <TabsContent value="sterile-inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persediaan Alat Steril</CardTitle>
              <CardDescription>Manajemen persediaan alat steril yang tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory.map(item => (
                  <Card key={item.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{item.instrumentName}</h3>
                          <p className="text-sm text-muted-foreground">Batch: {item.batchNumber}</p>
                          <p className="text-sm">Lokasi: {item.location}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getInventoryStatusColor(item.status)}>
                            {item.status === 'available' && 'Tersedia'}
                            {item.status === 'reserved' && 'Dipesan'}
                            {item.status === 'disposed' && 'Dibuang'}
                          </Badge>
                          <p className="text-xs mt-1 text-muted-foreground">
                            Jumlah: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Diterima</p>
                          <p className="font-medium">{item.receivedDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Kadaluarsa</p>
                          <p className="font-medium">{item.expiryDate}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Search className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Package className="h-4 w-4 mr-2" />
                          Distribusikan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch-records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Catatan Batch Sterilisasi</CardTitle>
              <CardDescription>Rekam jejak batch proses sterilisasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Batch</th>
                      <th className="text-left py-2">Alat</th>
                      <th className="text-left py-2">Tanggal</th>
                      <th className="text-left py-2">Metode</th>
                      <th className="text-left py-2">Operator</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map(process => (
                      <tr key={process.id} className="border-b">
                        <td className="py-2 font-medium">{process.batchNumber}</td>
                        <td className="py-2">{process.instrumentName}</td>
                        <td className="py-2">{process.startDate}</td>
                        <td className="py-2">Autoclave</td>
                        <td className="py-2">{process.operator}</td>
                        <td className="py-2">
                          <Badge className={getProcessStatusColor(process.status)}>
                            {process.status === 'processing' && 'Dalam Proses'}
                            {process.status === 'completed' && 'Selesai'}
                            {process.status === 'failed' && 'Gagal'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}