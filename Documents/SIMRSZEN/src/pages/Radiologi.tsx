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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
interface RadiologyExam {
  id: string;
  patient_id: string;
  patient_name: string;
  exam_type: string;
  exam_date: string;
  modality: string;
  status: 'ordered' | 'scheduled' | 'in_progress' | 'completed' | 'verified' | 'reported';
  priority: 'normal' | 'urgent' | 'stat';
  assigned_radiographer: string;
  assigned_radiologist: string;
  findings?: string;
  impression?: string;
  created_at: string;
}

interface RadiologyModality {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'maintenance' | 'offline';
}

const Radiologi = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState<RadiologyExam[]>([]);
  const [modalities, setModalities] = useState<RadiologyModality[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch radiology exams
      const examsResult = await getApi<RadiologyExam[]>`
        SELECT 
          id,
          patient_id,
          patient_name,
          exam_type,
          exam_date,
          modality,
          status,
          priority,
          assigned_radiographer,
          assigned_radiologist,
          findings,
          impression,
          created_at
        FROM radiology_exams
        ORDER BY created_at DESC
      `;
      
      // Fetch modalities
      const modalitiesResult = await getApi<RadiologyModality[]>`
        SELECT 
          id,
          name,
          type,
          status
        FROM radiology_modalities
        ORDER BY name
      `;
      
      setExams(examsResult);
      setModalities(modalitiesResult);
    } catch (error) {
      console.error('Error fetching radiology data:', error);
      toast({
        title: "Gagal memuat data radiologi",
        description: "Terjadi kesalahan saat memuat data pemeriksaan radiologi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = exams.filter(exam =>
    exam.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.exam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.modality.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CardTitle>Manajemen Radiologi</CardTitle>
          <CardDescription>
            Pengelolaan pemeriksaan radiologi dan hasilnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="exams" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="exams">Pemeriksaan</TabsTrigger>
              <TabsTrigger value="modalities">Modalitas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="exams">
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Cari pemeriksaan berdasarkan nama pasien, jenis tes, atau modalitas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      Tambah Pemeriksaan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Pemeriksaan Radiologi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="patient">Pilih Pasien</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih pasien" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Ahmad Fauzi (MRN: MRN001)</SelectItem>
                            <SelectItem value="2">Siti Nurhaliza (MRN: MRN002)</SelectItem>
                            <SelectItem value="3">Budi Santoso (MRN: MRN003)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="exam_type">Jenis Pemeriksaan</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis pemeriksaan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xray">Foto Rontgen (X-Ray)</SelectItem>
                            <SelectItem value="ct_scan">CT Scan</SelectItem>
                            <SelectItem value="mri">MRI</SelectItem>
                            <SelectItem value="fluoroscopy">Fluoroskopi</SelectItem>
                            <SelectItem value="mammography">Mammografi</SelectItem>
                            <SelectItem value="angiography">Angiografi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="modality">Modalitas</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih modalitas" />
                          </SelectTrigger>
                          <SelectContent>
                            {modalities
                              .filter(m => m.status === 'available')
                              .map(m => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.name} ({m.type})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="priority">Prioritas</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih prioritas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="stat">STAT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="radiographer">Teknisi Radiografer</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih teknisi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tech1">Andi Prasetyo, S.Tr.Rad</SelectItem>
                            <SelectItem value="tech2">Sri Lestari, S.Tr.Rad</SelectItem>
                            <SelectItem value="tech3">Bambang Kurniawan, S.Tr.Rad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="radiologist">Dokter Spesialis Radiologi</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih dokter" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rad1">Dr. Yuni Astuti, Sp.Rad</SelectItem>
                            <SelectItem value="rad2">Dr. Agus Santoso, Sp.Rad</SelectItem>
                            <SelectItem value="rad3">Dr. Rina Kusuma, Sp.Rad</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button>Tambah Pemeriksaan</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pemeriksaan</TableHead>
                    <TableHead>Nama Pasien</TableHead>
                    <TableHead>Jenis Tes</TableHead>
                    <TableHead>Modalitas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Prioritas</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dokter Rad</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.id}</TableCell>
                      <TableCell>{exam.patient_name}</TableCell>
                      <TableCell>{exam.exam_type}</TableCell>
                      <TableCell>{exam.modality}</TableCell>
                      <TableCell>{new Date(exam.exam_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          exam.priority === 'stat' ? 'destructive' : 
                          exam.priority === 'urgent' ? 'default' : 'secondary'
                        }>
                          {exam.priority === 'stat' && 'STAT'}
                          {exam.priority === 'urgent' && 'Urgent'}
                          {exam.priority === 'normal' && 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          exam.status === 'ordered' ? 'secondary' : 
                          exam.status === 'scheduled' ? 'default' : 
                          exam.status === 'in_progress' ? 'outline' : 
                          exam.status === 'completed' ? 'secondary' : 
                          exam.status === 'verified' ? 'success' : 
                          'destructive'
                        }>
                          {exam.status === 'ordered' && 'Dipesan'}
                          {exam.status === 'scheduled' && 'Terjadwal'}
                          {exam.status === 'in_progress' && 'Sedang Dikerjakan'}
                          {exam.status === 'completed' && 'Selesai'}
                          {exam.status === 'verified' && 'Diverifikasi'}
                          {exam.status === 'reported' && 'Dilaporkan'}
                        </Badge>
                      </TableCell>
                      <TableCell>{exam.assigned_radiologist}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Detail</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="modalities">
              <div className="flex justify-between items-center mb-6">
                <Input
                  placeholder="Cari modalitas..."
                  className="max-w-sm"
                />
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      Tambah Modalitas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tambah Modalitas Radiologi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="modality_name">Nama Modalitas</Label>
                        <Input id="modality_name" placeholder="Nama modalitas (contoh: CT Scanner 64 Slice)" />
                      </div>
                      
                      <div>
                        <Label htmlFor="modality_type">Tipe Modalitas</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe modalitas" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="xray">X-Ray</SelectItem>
                            <SelectItem value="ct">CT Scan</SelectItem>
                            <SelectItem value="mri">MRI</SelectItem>
                            <SelectItem value="ultrasound">USG</SelectItem>
                            <SelectItem value="mammography">Mammografi</SelectItem>
                            <SelectItem value="fluoroscopy">Fluoroskopi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="modality_status">Status</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Tersedia</SelectItem>
                            <SelectItem value="maintenance">Dalam Perawatan</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button>Tambah Modalitas</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modalities.map((modality) => (
                    <TableRow key={modality.id}>
                      <TableCell className="font-medium">{modality.name}</TableCell>
                      <TableCell>{modality.type}</TableCell>
                      <TableCell>
                        <Badge variant={
                          modality.status === 'available' ? 'success' : 
                          modality.status === 'maintenance' ? 'warning' : 
                          'destructive'
                        }>
                          {modality.status === 'available' && 'Tersedia'}
                          {modality.status === 'maintenance' && 'Perawatan'}
                          {modality.status === 'offline' && 'Offline'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Radiologi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Pemeriksaan</span>
                <span className="font-medium">{exams.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Dalam Proses</span>
                <span className="font-medium">
                  {exams.filter(e => ['in_progress', 'scheduled'].includes(e.status)).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Menunggu Pelaporan</span>
                <span className="font-medium">
                  {exams.filter(e => e.status === 'verified').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prioritas Tinggi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exams
                .filter(exam => exam.priority === 'stat' || exam.priority === 'urgent')
                .slice(0, 3)
                .map(exam => (
                  <div key={exam.id} className="flex justify-between items-center p-2 bg-destructive/10 rounded">
                    <span className="text-sm">{exam.patient_name}</span>
                    <Badge variant={exam.priority === 'stat' ? "destructive" : "default"}>
                      {exam.priority === 'stat' ? 'STAT' : 'Urgent'}
                    </Badge>
                  </div>
                ))
              }
              {exams.filter(exam => exam.priority === 'stat' || exam.priority === 'urgent').length === 0 && (
                <p className="text-sm text-muted-foreground">Tidak ada pemeriksaan dengan prioritas tinggi</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Modalitas Tersedia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {modalities
                .filter(m => m.status === 'available')
                .slice(0, 3)
                .map(modality => (
                  <div key={modality.id} className="flex justify-between items-center p-2 bg-secondary rounded">
                    <div>
                      <p className="text-sm font-medium">{modality.name}</p>
                      <p className="text-xs text-muted-foreground">{modality.type}</p>
                    </div>
                    <Badge variant="success">Tersedia</Badge>
                  </div>
                ))}
              <p className="text-sm text-muted-foreground">
                {modalities.filter(m => m.status === 'available').length}/{modalities.length} modalitas tersedia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Radiologi;