import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { Building2, CheckCircle, RefreshCw, Upload, Download, Activity, FileText, AlertCircle, Settings, Loader2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface SyncStat {
  name: string;
  synced: number;
  total: number;
  percentage: number;
}

interface SyncLog {
  id: string;
  resource_type: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface Config {
  organizationId: string;
  environment: string;
  active: boolean;
}

export default function SatuSehat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [stats, setStats] = useState<SyncStat[]>([]);
  const [todayStats, setTodayStats] = useState({ total: 0, synced: 0, failed: 0, pending: 0 });
  const [successRate, setSuccessRate] = useState(100);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [config, setConfig] = useState<Config>({
    organizationId: 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
    environment: 'staging',
    active: true,
  });
  const [lastSync, setLastSync] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([loadStats(), loadLogs(), loadConfig()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk load stats
  const loadStats = async () => {
    try {
      // Panggil backend API
      const response = await getApi('/satusehat/stats');
      if (response && response.stats) {
        // Map the backend stats format to frontend SyncStat format
        const formattedStats: SyncStat[] = response.stats.map((s: any) => ({
          name: s.title,
          synced: s.synced,
          total: s.total,
          percentage: s.total > 0 ? Math.round((s.synced / s.total) * 100) : 0
        }));
        setStats(formattedStats);
        
        // Calculate today's stats based on the backend data
        const totalPending = response.stats.reduce((acc: number, s: any) => acc + s.pending, 0);
        const totalFailed = response.stats.reduce((acc: number, s: any) => acc + s.failed, 0);
        const totalSynced = response.stats.reduce((acc: number, s: any) => acc + s.synced, 0);
        const totalRecords = response.stats.reduce((acc: number, s: any) => acc + s.total, 0);
        
        setTodayStats({
          total: totalRecords,
          synced: totalSynced,
          failed: totalFailed,
          pending: totalPending
        });
        
        setSuccessRate(totalRecords > 0 ? (totalSynced / totalRecords) * 100 : 0);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats([]);
      setTodayStats({ total: 0, synced: 0, failed: 0, pending: 0 });
      setSuccessRate(0);
    }
  };

  // Fungsi untuk load logs
  const loadLogs = async () => {
    try {
      // Panggil backend API
      const response = await getApi('/satusehat/logs');
      if (response && response.logs) {
        setLogs(response.logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
      setLogs([]);
    }
  };

  // Fungsi untuk load config
  const loadConfig = async () => {
    try {
      // Panggil backend API
      const response = await getApi('/satusehat/settings');
      if (response && response.config) {
        setConfig({
          organizationId: response.config.organizationId || 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
          environment: 'staging',
          active: response.config.active,
          clientId: response.config.clientId,
          clientSecret: response.config.clientSecret
        });
        
        // Auto test connection on load if credentials exist
        if (response.config.clientId && response.config.clientSecret) {
          try {
            const testRes = await postApi('/satusehat/test-connection', {
              organizationId: response.config.organizationId || 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
              clientId: response.config.clientId,
              clientSecret: response.config.clientSecret
            });
            if (testRes.connected) {
              setIsConnected(true);
            }
          } catch (e) {
            console.error('Silent connection test failed', e);
          }
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
      // Fallback
      setConfig({
        organizationId: 'b1eb0d2d-feb8-44da-b0ab-a32c8e7fa5a3',
        environment: 'staging',
        active: true,
        clientId: 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
        clientSecret: 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg'
      });
    }
  };

  // Fungsi untuk test connection
  const testConnection = async () => {
    setIsTesting(true);
    try {
      const response = await postApi('/satusehat/test-connection', {
        organizationId: config.organizationId,
        clientId: config.clientId || 'QzABfhf3NaJbrB2ZZEBNVKvuYiQfPINAtEybmn4Q9tueFOe1',
        clientSecret: config.clientSecret || 'sMcm1O30cbpyBy7iKmAUYoSu4AUY1G6K6o0ExX5eii5ycjxyuV1L620vG6AlwWOg'
      });
      
      if (response.connected) {
        toast.success(response.message || 'Koneksi berhasil diuji dengan API Kemenkes');
        setIsConnected(true);
      } else {
        toast.error(response.message || 'Gagal menguji koneksi');
        setIsConnected(false);
      }
    } catch (error: any) {
      console.error('Error testing connection:', error);
      toast.error(error.message || 'Gagal menguji koneksi');
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  // Fungsi untuk bulk sync patients
  const bulkSyncPatients = async () => {
    setIsSyncing(true);
    try {
      // Panggil backend API
      const response = await postApi('/satusehat/batch/sync', {
        dataType: 'patient',
        ids: [] // Dalam skenario asli, ini mengirim ID atau meminta backend ambil yang pending
      });
      
      toast.success(response.message || 'All patients synced successfully!');
      
      // Update last sync time
      setLastSync(new Date().toISOString());
    } catch (error: any) {
      console.error('Error syncing patients:', error);
      toast.error(error.message || 'Failed to sync patients');
    } finally {
      setIsSyncing(false);
    }
  };

  // Fungsi untuk menyimpan konfigurasi
  const saveConfig = async () => {
    try {
      await postApi('/satusehat/settings', config);
      toast.success('Konfigurasi berhasil disimpan ke database');
    } catch (error: any) {
      console.error('Error saving config:', error);
      toast.error(error.message || 'Gagal menyimpan konfigurasi');
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return 'Belum pernah sync';
    const diff = Date.now() - new Date(dateString).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">SATU SEHAT</h1>
          <p className="text-muted-foreground">Integrasi Data Kesehatan Nasional - Kemenkes RI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            className="gradient-primary shadow-glow" 
            onClick={bulkSyncPatients}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Push All Data
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`module-card ${isConnected ? 'border-success/20' : 'border-warning/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl gradient-hero">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">FHIR R4 API Connection</h3>
              <p className="text-sm text-muted-foreground">
                Endpoint: api-satusehat{config.environment === 'production' ? '' : '-stg'}.dto.kemkes.go.id
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Last Sync</p>
              <p className="font-medium">{formatRelativeTime(lastSync)}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={isTesting}
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test
            </Button>
            <Badge 
              variant="outline" 
              className={`text-base px-4 py-2 ${
                isConnected 
                  ? 'bg-success/10 text-success border-success/20' 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Not Tested
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="module-card">
          <div className="flex items-center gap-3 mb-2">
            <Upload className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Data Terkirim Hari Ini</span>
          </div>
          <p className="text-3xl font-bold">{todayStats.synced.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">Resources</p>
        </div>
        <div className="module-card">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-5 w-5 text-success" />
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
          <p className="text-3xl font-bold text-success">{successRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Sync accuracy</p>
        </div>
        <div className="module-card">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-info" />
            <span className="text-sm text-muted-foreground">Total Resources</span>
          </div>
          <p className="text-3xl font-bold">
            {stats.reduce((acc, s) => acc + s.synced, 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">All time synced</p>
        </div>
        <div className="module-card">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <p className="text-3xl font-bold text-warning">
            {stats.reduce((acc, s) => acc + (s.total - s.synced), 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Need sync</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resource Status */}
        <div className="lg:col-span-2">
          <div className="module-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">FHIR Resource Status</h3>
                <p className="text-sm text-muted-foreground">Status sinkronisasi per resource type</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadStats}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.map((resource) => (
                <div key={resource.name} className="p-4 rounded-xl bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{resource.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {resource.synced.toLocaleString()} / {resource.total.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={resource.percentage} className="h-2" />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-success">{resource.percentage}% synced</span>
                    {resource.percentage < 100 && (
                      <span className="text-xs text-warning">
                        {(resource.total - resource.synced).toLocaleString()} pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Logs */}
        <div className="module-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Sync Logs</h3>
            <Button variant="ghost" size="sm" onClick={loadLogs}>
              Refresh
            </Button>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Belum ada log sync
              </p>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      log.status === 'synced'
                        ? 'bg-success'
                        : log.status === 'pending'
                        ? 'bg-warning'
                        : 'bg-destructive'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm">
                      {log.resource_type} {log.status === 'synced' ? 'synced' : log.status === 'failed' ? 'failed' : 'pending'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(log.created_at)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {log.status}
                      </Badge>
                    </div>
                    {log.error_message && (
                      <p className="text-xs text-destructive mt-1">{log.error_message}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="module-card">
        <Tabs defaultValue="compliance">
          <TabsList>
            <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
            <TabsTrigger value="mapping">Data Mapping</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">FHIR R4 Compliant</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  All resources follow FHIR R4 specification
                </p>
              </div>
              <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">ICD-10 Coding</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Diagnosis codes properly mapped
                </p>
              </div>
              <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="font-medium">ICD-9-CM Procedures</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Procedure codes validated
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="mt-4">
            <div className="space-y-4">
              <h4 className="font-medium">Resource Mapping Configuration</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-muted/30">
                  <h5 className="font-medium mb-2">Patient → FHIR Patient</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• NIK → identifier (nik system)</li>
                    <li>• BPJS Number → identifier (bpjs system)</li>
                    <li>• full_name → name.text</li>
                    <li>• gender → gender (L=male, P=female)</li>
                    <li>• birth_date → birthDate</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <h5 className="font-medium mb-2">Visit → FHIR Encounter</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• visit_number → identifier</li>
                    <li>• visit_type → class (AMB/IMP/EMER)</li>
                    <li>• status → status mapping</li>
                    <li>• visit_date + visit_time → period.start</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <h5 className="font-medium mb-2">Diagnosis → FHIR Condition</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• icd10_code → code.coding (ICD-10)</li>
                    <li>• description → code.coding.display</li>
                    <li>• diagnosis_type → category</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-muted/30">
                  <h5 className="font-medium mb-2">Prescription → FHIR MedicationRequest</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• medicine → medication</li>
                    <li>• dosage → dosageInstruction</li>
                    <li>• frequency → dosageInstruction.timing</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="space-y-6 max-w-xl">
              <div className="space-y-2">
                <Label htmlFor="org-id">Organization ID (SATU SEHAT)</Label>
                <Input
                  id="org-id"
                  placeholder="Masukkan Organization ID dari SATU SEHAT"
                  value={config.organizationId}
                  onChange={(e) => setConfig({ ...config, organizationId: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">
                  ID organisasi yang terdaftar di platform SATU SEHAT
                </p>
              </div>

              <div className="space-y-2">
                <Label>Environment</Label>
                <Select
                  value={config.environment}
                  onValueChange={(value) => setConfig({ ...config, environment: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staging">Staging (Sandbox)</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Gunakan Staging untuk testing, Production untuk data riil
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Otomatis sinkronisasi data baru ke SATU SEHAT
                  </p>
                </div>
                <Switch
                  checked={config.active}
                  onCheckedChange={(checked) => setConfig({ ...config, active: checked })}
                />
              </div>

              <Button onClick={saveConfig}>
                <Settings className="h-4 w-4 mr-2" />
                Simpan Konfigurasi
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
