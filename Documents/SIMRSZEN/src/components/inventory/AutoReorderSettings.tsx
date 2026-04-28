import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Settings, RefreshCw, AlertTriangle, Zap } from "lucide-react";
import { toast } from "sonner";

interface Medicine {
  id: string;
  name: string;
  code: string;
  stock: number;
  min_stock: number | null;
  unit: string;
  settings: {
    id: string;
    auto_reorder_enabled: boolean;
    reorder_point: number;
    reorder_quantity: number;
    max_stock: number | null;
    preferred_supplier: string | null;
    lead_time_days: number;
  } | null;
}

export default function AutoReorderSettings() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [autoReorderEnabled, setAutoReorderEnabled] = useState(true);
  const [reorderPoint, setReorderPoint] = useState("");
  const [reorderQuantity, setReorderQuantity] = useState("");
  const [maxStock, setMaxStock] = useState("");
  const [preferredSupplier, setPreferredSupplier] = useState("");
  const [leadTimeDays, setLeadTimeDays] = useState("7");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const medicinesData = await getApi("/generic-api");

      const settingsData = await getApi("/generic-api");

      const medicinesWithSettings = (medicinesData || []).map(med => ({
        ...med,
        settings: settingsData?.find(s => s.medicine_id === med.id) || null,
      }));

      setMedicines(medicinesWithSettings);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSettings = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    if (medicine.settings) {
      setAutoReorderEnabled(medicine.settings.auto_reorder_enabled);
      setReorderPoint(medicine.settings.reorder_point.toString());
      setReorderQuantity(medicine.settings.reorder_quantity.toString());
      setMaxStock(medicine.settings.max_stock?.toString() || "");
      setPreferredSupplier(medicine.settings.preferred_supplier || "");
      setLeadTimeDays(medicine.settings.lead_time_days.toString());
    } else {
      setAutoReorderEnabled(true);
      setReorderPoint((medicine.min_stock || 10).toString());
      setReorderQuantity("100");
      setMaxStock("");
      setPreferredSupplier("");
      setLeadTimeDays("7");
    }
    setShowEditDialog(true);
  };

  const handleSaveSettings = async () => {
    if (!selectedMedicine || !reorderPoint || !reorderQuantity) {
      toast.error("Lengkapi field yang wajib diisi");
      return;
    }

    setIsSubmitting(true);

    try {
      const settingsData = {
        medicine_id: selectedMedicine.id,
        auto_reorder_enabled: autoReorderEnabled,
        reorder_point: parseInt(reorderPoint),
        reorder_quantity: parseInt(reorderQuantity),
        max_stock: maxStock ? parseInt(maxStock) : null,
        preferred_supplier: preferredSupplier || null,
        lead_time_days: parseInt(leadTimeDays) || 7,
      };

      if (selectedMedicine.settings) {
        // Update existing
        await putApi("/generic-api", {});
      } else {
        // Insert new
        await postApi("/generic-api", {});
      }

      toast.success("Pengaturan berhasil disimpan");
      setShowEditDialog(false);
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan pengaturan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckReorders = async () => {
    try {
      // Find medicines that need reordering
      const needsReorder = medicines.filter(med => {
        if (!med.settings?.auto_reorder_enabled) return false;
        return med.stock <= med.settings.reorder_point;
      });

      if (needsReorder.length === 0) {
        toast.info("Tidak ada obat yang perlu di-reorder saat ini");
        return;
      }

      // Create auto PO for each supplier group
      const supplierGroups = needsReorder.reduce((acc, med) => {
        const supplier = med.settings?.preferred_supplier || "Default Supplier";
        if (!acc[supplier]) acc[supplier] = [];
        acc[supplier].push(med);
        return acc;
      }, {} as Record<string, Medicine[]>);

      for (const [supplier, meds] of Object.entries(supplierGroups)) {
        const poNumber = `PO-${Date.now()}`; // Simple PO number generation

        const total = meds.reduce((sum, med) => {
          return sum + (med.settings?.reorder_quantity || 100) * 10000;
        }, 0);

        const po = await postApi("/generic-api", {});

        if (po.length === 0) {
          throw new Error("Failed to create purchase order");
        }

        const items = meds.map(med => ({
          purchase_order_id: po[0].id,
          medicine_id: med.id,
          quantity: med.settings?.reorder_quantity || 100,
          unit_price: 10000,
          total_price: (med.settings?.reorder_quantity || 100) * 10000,
        }));

        for (const item of items) {
          await postApi("/generic-api", {});
        }

        // Update last auto order date
        for (const med of meds) {
          if (med.settings) {
            await putApi("/generic-api", {});
          }
        }
      }

      toast.success(`${needsReorder.length} obat membutuhkan reorder. PO telah dibuat.`);
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.message || "Gagal mengecek reorder");
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockMedicines = medicines.filter(med => {
    const threshold = med.settings?.reorder_point || med.min_stock || 10;
    return med.stock <= threshold;
  });

  return (
    <>
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <Zap className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {medicines.filter(m => m.settings?.auto_reorder_enabled).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Auto-Reorder Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={lowStockMedicines.length > 0 ? "border-amber-500/50" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <AlertTriangle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lowStockMedicines.length}</p>
                  <p className="text-sm text-muted-foreground">Perlu Reorder</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex items-center justify-between h-full">
              <div>
                <p className="font-medium">Cek Reorder Otomatis</p>
                <p className="text-sm text-muted-foreground">Generate PO untuk stok rendah</p>
              </div>
              <Button onClick={handleCheckReorders}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cek Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Pengaturan Auto-Reorder</CardTitle>
                <CardDescription>Konfigurasi reorder point dan quantity per obat</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari obat..."
                  className="pl-10 w-48"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredMedicines.map((medicine) => {
                  const needsReorder = medicine.stock <= (medicine.settings?.reorder_point || medicine.min_stock || 10);
                  return (
                    <div
                      key={medicine.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${needsReorder ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{medicine.name}</p>
                            {needsReorder && (
                              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600">
                                Perlu Reorder
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Stok: {medicine.stock} {medicine.unit}
                            {medicine.settings && (
                              <> • Reorder Point: {medicine.settings.reorder_point}</>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {medicine.settings ? (
                          <Badge variant={medicine.settings.auto_reorder_enabled ? "default" : "secondary"}>
                            {medicine.settings.auto_reorder_enabled ? "Auto ON" : "Auto OFF"}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Belum diatur</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSettings(medicine)}
                        >
                          <Settings className="h-4 w-4 mr-1" />
                          Atur
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pengaturan Auto-Reorder</DialogTitle>
          </DialogHeader>
          {selectedMedicine && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="font-semibold">{selectedMedicine.name}</p>
                <p className="text-sm text-muted-foreground">
                  Stok saat ini: {selectedMedicine.stock} {selectedMedicine.unit}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto-Reorder Aktif</Label>
                <Switch checked={autoReorderEnabled} onCheckedChange={setAutoReorderEnabled} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reorder Point *</Label>
                  <Input
                    type="number"
                    placeholder="50"
                    value={reorderPoint}
                    onChange={(e) => setReorderPoint(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Trigger reorder saat stok mencapai nilai ini</p>
                </div>
                <div className="space-y-2">
                  <Label>Reorder Quantity *</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={reorderQuantity}
                    onChange={(e) => setReorderQuantity(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Jumlah yang dipesan saat reorder</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Max Stock</Label>
                  <Input
                    type="number"
                    placeholder="500"
                    value={maxStock}
                    onChange={(e) => setMaxStock(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lead Time (hari)</Label>
                  <Input
                    type="number"
                    placeholder="7"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Preferred Supplier</Label>
                <Input
                  placeholder="Nama supplier"
                  value={preferredSupplier}
                  onChange={(e) => setPreferredSupplier(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Batal</Button>
            <Button onClick={handleSaveSettings} disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}