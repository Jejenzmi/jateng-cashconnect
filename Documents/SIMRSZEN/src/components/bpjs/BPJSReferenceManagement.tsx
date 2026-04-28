import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Edit, 
  Download,
  RefreshCw,
  Settings,
  FileText,
  ShieldCheck,
  Users,
  Calendar,
  Stethoscope,
  Clock,
  Pill,
  HeartPulse,
  Activity,
  Bed,
  FilePlus,
  ClipboardList,
  Monitor,
  Mail,
  MapPin,
  Phone,
  User,
  BookOpen
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

const BPJSReferenceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'diagnosa' | 'poli' | 'faskes' | 'dokter' | 'dpjp' | 'region' | 'other'>('diagnosa');
  const [loading, setLoading] = useState(false);
  
  // State untuk pencarian referensi
  const [searchParam, setSearchParam] = useState('');
  const [faskesParam1, setFaskesParam1] = useState('');
  const [faskesParam2, setFaskesParam2] = useState('1');
  const [pelayanan, setPelayanan] = useState('1');
  const [tglPelayanan, setTglPelayanan] = useState(new Date().toISOString().split('T')[0]);
  const [spesialis, setSpesialis] = useState('');
  const [propinsiId, setPropinsiId] = useState('');
  const [kabupatenId, setKabupatenId] = useState('');
  const [refType, setRefType] = useState('kelasrawat');
  
  // State untuk data referensi
  const [referenceData, setReferenceData] = useState<any[]>([]);

  const handleSearchReference = async () => {
    if (!searchParam && activeTab !== 'region' && activeTab !== 'other') {
      toast.error('Silakan masukkan parameter pencarian');
      return;
    }

    setLoading(true);
    try {
      let response;
      let paramName = '';
      
      switch (activeTab) {
        case 'diagnosa':
          paramName = 'diagnosa';
          // Dalam implementasi nyata, kita akan memanggil:
          // response = await apiClient.get(`/bpjs/vclaim2/ref/diagnosa/${searchParam}`);
          
          // Simulasi data
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = {
            data: {
              data: {
                response: {
                  diagnosa: [
                    { kode: 'A04', nama: 'A04 - Other bacterial intestinal infections' },
                    { kode: 'B15', nama: 'B15 - Hepatitis A with hepatic coma' },
                  ]
                }
              }
            }
          };
          break;
          
        case 'poli':
          paramName = 'poli';
          // Dalam implementasi nyata, kita akan memanggil:
          // response = await apiClient.get(`/bpjs/vclaim2/ref/poli/${searchParam}`);
          
          // Simulasi data
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = {
            data: {
              data: {
                response: {
                  poli: [
                    { kode: 'ICU', nama: 'Intensive Care Unit' },
                    { kode: 'INT', nama: 'Poli Penyakit Dalam' },
                    { kode: 'IVP', nama: 'Intravena Pydografi' },
                  ]
                }
              }
            }
          };
          break;
          
        case 'faskes':
          if (!faskesParam1) {
            toast.error('Silakan masukkan nama atau kode faskes');
            return;
          }
          paramName = 'faskes';
          // Dalam implementasi nyata, kita akan memanggil:
          // response = await apiClient.get(`/bpjs/vclaim2/ref/faskes/${faskesParam1}/${faskesParam2}`);
          
          // Simulasi data
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = {
            data: {
              data: {
                response: {
                  faskes: [
                    { kode: '00161001', nama: 'PUSKESMAS SANGIRAN - KAB. SIMEULUE' },
                    { kode: '00161002', nama: 'PUSKESMAS SIMEULUE - KAB. SIMEULUE' },
                  ]
                }
              }
            }
          };
          break;
          
        case 'dokter':
          paramName = 'dokter';
          // Dalam implementasi nyata, kita akan memanggil:
          // response = await apiClient.get(`/bpjs/vclaim2/ref/dokter/${searchParam}`);
          
          // Simulasi data
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = {
            data: {
              data: {
                response: {
                  list: [
                    { kode: '3', nama: 'Satro Jadhit, dr' },
                    { kode: '2', nama: 'Satroni Lawa, dr' },
                  ]
                }
              }
            }
          };
          break;
          
        case 'dpjp':
          if (!pelayanan || !tglPelayanan || !spesialis) {
            toast.error('Silakan lengkapi semua parameter DPJP');
            return;
          }
          paramName = 'dpjp';
          // Dalam implementasi nyata, kita akan memanggil:
          // response = await apiClient.get(`/bpjs/vclaim2/ref/dpjp/${pelayanan}/${tglPelayanan}/${spesialis}`);
          
          // Simulasi data
          await new Promise(resolve => setTimeout(resolve, 1000));
          response = {
            data: {
              data: {
                response: {
                  list: [
                    { kode: '31486', nama: 'Satro Jadhit, dr' },
                    { kode: '31492', nama: 'Satroni Lawa, dr' },
                  ]
                }
              }
            }
          };
          break;
          
        case 'region':
          // Special handling for region references
          if (refType === 'propinsi') {
            paramName = 'propinsi';
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get('/bpjs/vclaim2/ref/propinsi');
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            response = {
              data: {
                data: {
                  response: {
                    list: [
                      { kode: '16', nama: 'Bali' },
                      { kode: '17', nama: 'Banten' },
                      { kode: '31', nama: 'DKI Jakarta' },
                      { kode: '32', nama: 'Jawa Barat' },
                    ]
                  }
                }
              }
            };
          } else if (refType === 'kabupaten' && propinsiId) {
            paramName = 'kabupaten';
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get(`/bpjs/vclaim2/ref/kabupaten/${propinsiId}`);
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            response = {
              data: {
                data: {
                  response: {
                    list: [
                      { kode: '0227', nama: 'KAB. BADUNG' },
                      { kode: '0230', nama: 'KAB. BANGLI' },
                    ]
                  }
                }
              }
            };
          } else if (refType === 'kecamatan' && kabupatenId) {
            paramName = 'kecamatan';
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get(`/bpjs/vclaim2/ref/kecamatan/${kabupatenId}`);
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            response = {
              data: {
                data: {
                  response: {
                    list: [
                      { kode: '3139', nama: 'KUTA' },
                      { kode: '3135', nama: 'KUTA UTARA' },
                    ]
                  }
                }
              }
            };
          } else {
            toast.error('Silakan lengkapi parameter wilayah');
            return;
          }
          break;
          
        case 'other':
          // Special handling for other reference types
          if (refType === 'diagnosaprb') {
            paramName = 'diagnosaprb';
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get('/bpjs/vclaim2/ref/diagnosaprb');
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            response = {
              data: {
                data: {
                  response: {
                    list: [
                      { kode: '01', nama: 'Diabetes Mellitus' },
                      { kode: '02', nama: 'Hypertensi' },
                      { kode: '03', nama: 'Asthma' },
                    ]
                  }
                }
              }
            };
          } else if (refType === 'obatprb') {
            if (!searchParam) {
              toast.error('Silakan masukkan nama obat untuk pencarian');
              return;
            }
            paramName = 'obatprb';
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get(`/bpjs/vclaim2/ref/obatprb/${searchParam}`);
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            response = {
              data: {
                data: {
                  response: {
                    list: [
                      { kode: '00019100017', nama: 'Analog Insulin Long Acting inj 100 UI/ml' },
                      { kode: '00012300016', nama: 'Analog Insulin Mix Acting inj 100 UI/ml' },
                    ]
                  }
                }
              }
            };
          } else {
            paramName = refType;
            // Dalam implementasi nyata, kita akan memanggil:
            // response = await apiClient.get(`/bpjs/vclaim2/ref/${refType}${refType === 'kelasrawat' || refType === 'ruangrawat' || refType === 'spesialistik' || refType === 'carakeluar' || refType === 'pascapulang' ? '' : '/' + searchParam}`);
            
            // Simulasi data
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (refType === 'kelasrawat') {
              response = {
                data: {
                  data: {
                    response: {
                      list: [
                        { kode: '1', nama: 'VVIP' },
                        { kode: '2', nama: 'VIP' },
                        { kode: '3', nama: 'Kelas 1' },
                        { kode: '4', nama: 'Kelas 2' },
                        { kode: '5', nama: 'Kelas 3' },
                      ]
                    }
                  }
                }
              };
            } else if (refType === 'ruangrawat') {
              response = {
                data: {
                  data: {
                    response: {
                      list: [
                        { kode: '3', nama: 'Ruang Melati I' },
                        { kode: '4', nama: 'Ruang Melati II' },
                        { kode: '5', nama: 'Ruang Kamboja I' },
                      ]
                    }
                  }
                }
              };
            } else if (refType === 'spesialistik') {
              response = {
                data: {
                  data: {
                    response: {
                      list: [
                        { kode: '11', nama: 'Spesialis Anestesiologi dan Reanimasi' },
                        { kode: '27', nama: 'Spesialis Forensik' },
                        { kode: '28', nama: 'Spesialis Onkologi' },
                      ]
                    }
                  }
                }
              };
            } else if (refType === 'carakeluar') {
              response = {
                data: {
                  data: {
                    response: {
                      list: [
                        { kode: '1', nama: 'Atas Persetujuan Dokter' },
                        { kode: '2', nama: 'Dirujuk' },
                        { kode: '3', nama: 'Atas Permintaan Sendiri' },
                      ]
                    }
                  }
                }
              };
            } else if (refType === 'pascapulang') {
              response = {
                data: {
                  data: {
                    response: {
                      list: [
                        { kode: '1', nama: 'Sembuh' },
                        { kode: '2', nama: 'Dirujuk' },
                        { kode: '3', nama: 'Pulang Paksa' },
                      ]
                    }
                  }
                }
              };
            } else if (refType === 'procedure') {
              response = {
                data: {
                  data: {
                    response: {
                      procedure: [
                        { kode: '21.05', nama: 'Control of epistaxis by (transantral) ligation of the maxillary artery' },
                        { kode: '382.2', nama: 'Chronic atticoantral suppurative otitis media' },
                      ]
                    }
                  }
                }
              };
            }
          }
          break;
      }
      
      if (response) {
        if (paramName === 'diagnosa') {
          setReferenceData(response.data.data.response.diagnosa || []);
        } else if (paramName === 'poli') {
          setReferenceData(response.data.data.response.poli || []);
        } else if (paramName === 'faskes') {
          setReferenceData(response.data.data.response.faskes || []);
        } else if (paramName === 'dokter' || paramName === 'dpjp' || paramName === 'diagnosaprb' || paramName === 'obatprb') {
          setReferenceData(response.data.data.response.list || []);
        } else if (paramName === 'procedure') {
          setReferenceData(response.data.data.response.procedure || []);
        } else {
          setReferenceData(response.data.data.response.list || []);
        }
        toast.success(`Referensi ${paramName} berhasil dimuat`);
      }
    } catch (error: any) {
      toast.error(`Gagal memuat referensi ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Referensi BPJS</h1>
        </div>
        <p className="text-muted-foreground">
          Data referensi dari sistem BPJS Kesehatan untuk kebutuhan operasional
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'diagnosa' | 'poli' | 'faskes' | 'dokter' | 'dpjp' | 'region' | 'other')}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="diagnosa">Diagnosa</TabsTrigger>
          <TabsTrigger value="poli">Poli</TabsTrigger>
          <TabsTrigger value="faskes">Faskes</TabsTrigger>
          <TabsTrigger value="dokter">Dokter</TabsTrigger>
          <TabsTrigger value="dpjp">DPJP</TabsTrigger>
          <TabsTrigger value="region">Wilayah</TabsTrigger>
          <TabsTrigger value="other">Lainnya</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagnosa">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Diagnosa (ICD-10)</CardTitle>
              <CardDescription>
                Pencarian data diagnosa berdasarkan kode atau nama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="searchParam">Kode atau Nama Diagnosa</Label>
                  <Input
                    id="searchParam"
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                    placeholder="Contoh: A04 atau Hepatitis"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Diagnosa
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian Diagnosa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Diagnosa</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="poli">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Poli</CardTitle>
              <CardDescription>
                Pencarian data poli berdasarkan kode atau nama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="searchParamPoli">Kode atau Nama Poli</Label>
                  <Input
                    id="searchParamPoli"
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                    placeholder="Contoh: INT atau Penyakit Dalam"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Poli
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian Poli
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Poli</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faskes">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Fasilitas Kesehatan</CardTitle>
              <CardDescription>
                Pencarian data fasilitas kesehatan berdasarkan nama dan jenis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="faskesParam1">Nama atau Kode Faskes</Label>
                  <Input
                    id="faskesParam1"
                    value={faskesParam1}
                    onChange={(e) => setFaskesParam1(e.target.value)}
                    placeholder="Contoh: RS atau PUSKESMAS"
                  />
                </div>
                
                <div>
                  <Label htmlFor="faskesParam2">Jenis Faskes</Label>
                  <Select value={faskesParam2} onValueChange={setFaskesParam2}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Faskes 1 (Puskesmas, Klinik)</SelectItem>
                      <SelectItem value="2">Faskes 2 (RS, Lab, Apotek)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Faskes
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian Faskes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Faskes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dokter">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Dokter</CardTitle>
              <CardDescription>
                Pencarian data dokter dalam faskes berdasarkan nama
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="searchParamDokter">Nama Dokter/DPJP</Label>
                  <Input
                    id="searchParamDokter"
                    value={searchParam}
                    onChange={(e) => setSearchParam(e.target.value)}
                    placeholder="Contoh: dr. Satro atau dr. Budi"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari Dokter
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian Dokter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Dokter</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dpjp">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Dokter DPJP</CardTitle>
              <CardDescription>
                Pencarian data dokter DPJP untuk pengisian DPJP Layan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <Label htmlFor="pelayanan">Jenis Pelayanan</Label>
                  <Select value={pelayanan} onValueChange={setPelayanan}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Rawat Inap</SelectItem>
                      <SelectItem value="2">Rawat Jalan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tglPelayanan">Tanggal Pelayanan</Label>
                  <Input
                    id="tglPelayanan"
                    type="date"
                    value={tglPelayanan}
                    onChange={(e) => setTglPelayanan(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="spesialis">Kode Spesialis/Subspesialis</Label>
                  <Input
                    id="spesialis"
                    value={spesialis}
                    onChange={(e) => setSpesialis(e.target.value)}
                    placeholder="Contoh: 11 atau 27"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Cari DPJP
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Pencarian DPJP
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama Dokter</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="region">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Wilayah</CardTitle>
              <CardDescription>
                Data referensi propinsi, kabupaten, dan kecamatan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="refTypeRegion">Tipe Referensi</Label>
                  <Select value={refType} onValueChange={(value) => {
                    setRefType(value);
                    if (value !== 'kabupaten' && value !== 'kecamatan') {
                      setPropinsiId('');
                      setKabupatenId('');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="propinsi">Propinsi</SelectItem>
                      <SelectItem value="kabupaten">Kabupaten</SelectItem>
                      <SelectItem value="kecamatan">Kecamatan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(refType === 'kabupaten' || refType === 'kecamatan') && (
                  <div>
                    <Label htmlFor="propinsiId">
                      {refType === 'kabupaten' ? 'Kode Propinsi' : 'Kode Kabupaten'}
                    </Label>
                    <Input
                      id="propinsiId"
                      value={refType === 'kabupaten' ? propinsiId : kabupatenId}
                      onChange={(e) => refType === 'kabupaten' ? setPropinsiId(e.target.value) : setKabupatenId(e.target.value)}
                      placeholder={`Contoh: ${refType === 'kabupaten' ? '32' : '0227'}`}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {refType === 'propinsi' ? 'Muat Propinsi' : 
                       refType === 'kabupaten' ? 'Muat Kabupaten' : 'Muat Kecamatan'}
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Referensi {refType === 'propinsi' ? 'Propinsi' : 
                                     refType === 'kabupaten' ? 'Kabupaten' : 'Kecamatan'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kode</TableHead>
                          <TableHead>Nama</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Referensi Lainnya</CardTitle>
              <CardDescription>
                Data referensi lainnya seperti kelas rawat, spesialistik, dll
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="refTypeOther">Tipe Referensi</Label>
                  <Select value={refType} onValueChange={setRefType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kelasrawat">Kelas Rawat</SelectItem>
                      <SelectItem value="ruangrawat">Ruang Rawat</SelectItem>
                      <SelectItem value="spesialistik">Spesialistik</SelectItem>
                      <SelectItem value="carakeluar">Cara Keluar</SelectItem>
                      <SelectItem value="pascapulang">Pasca Pulang</SelectItem>
                      <SelectItem value="procedure">Procedure/Tindakan</SelectItem>
                      <SelectItem value="diagnosaprb">Diagnosa PRB</SelectItem>
                      <SelectItem value="obatprb">Obat PRB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(refType === 'procedure' || refType === 'obatprb') && (
                  <div>
                    <Label htmlFor="searchParamOther">
                      {refType === 'procedure' ? 'Nama atau Kode Procedure' : 'Nama Obat Generik'}
                    </Label>
                    <Input
                      id="searchParamOther"
                      value={searchParam}
                      onChange={(e) => setSearchParam(e.target.value)}
                      placeholder={refType === 'procedure' ? 'Contoh: 21.05 atau Control' : 'Contoh: Insulin atau Analog'}
                    />
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleSearchReference} disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Muat Referensi {refType}
                    </>
                  )}
                </Button>
              </div>
              
              {referenceData.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Hasil Referensi {refType}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{refType === 'procedure' ? 'Kode' : 'Kode'}</TableHead>
                          <TableHead>Nama</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {referenceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{item.kode}</TableCell>
                            <TableCell>{item.nama}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BPJSReferenceManagement;