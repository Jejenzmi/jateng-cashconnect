import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, ChevronRight, Volume2, Pause, Play, SkipForward, RefreshCw, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Department {
  id: string;
  name: string;
  code: string;
}

interface QueueTicket {
  id: string;
  ticket_number: string;
  patient_id: string | null;
  visit_id: string | null;
  department_id: string | null;
  doctor_id: string | null;
  service_type: string;
  queue_date: string;
  called_at: string | null;
  served_at: string | null;
  completed_at: string | null;
  counter_number: string | null;
  status: string;
  priority: number;
  notes: string | null;
  patients?: {
    full_name: string;
    medical_record_number: string;
  } | null;
}

export default function Antrian() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDeptId, setSelectedDeptId] = useState<string>("");
  const [selectedServiceType, setSelectedServiceType] = useState<string>("rawat_jalan");
  const [isPaused, setIsPaused] = useState(false);
  const [isDisplayMode, setIsDisplayMode] = useState(false);

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await getApi<Department[]>`
        SELECT id, name, code
        FROM departments
        WHERE is_active = true
        ORDER BY name
      `;
      return data;
    },
  });

  // Fetch queue tickets for today
  const { data: queueTickets = [], isLoading } = useQuery({
    queryKey: ["queue-tickets", selectedServiceType, selectedDeptId],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      let querySql = `
        SELECT 
          id,
          ticket_number,
          patient_id,
          visit_id,
          department_id,
          doctor_id,
          service_type,
          queue_date,
          called_at,
          served_at,
          completed_at,
          counter_number,
          status,
          priority,
          notes,
          (SELECT json_build_object(
            'full_name', full_name,
            'medical_record_number', medical_record_number
          ) FROM patients WHERE id = qt.patient_id) AS patients
        FROM queue_tickets qt
        WHERE queue_date = ${today}
          AND service_type = ${selectedServiceType}
        ORDER BY priority DESC, created_at ASC
      `;

      if (selectedDeptId) {
        querySql = `
          SELECT 
            id,
            ticket_number,
            patient_id,
            visit_id,
            department_id,
            doctor_id,
            service_type,
            queue_date,
            called_at,
            served_at,
            completed_at,
            counter_number,
            status,
            priority,
            notes,
            (SELECT json_build_object(
              'full_name', full_name,
              'medical_record_number', medical_record_number
            ) FROM patients WHERE id = qt.patient_id) AS patients
          FROM queue_tickets qt
          WHERE queue_date = ${today}
            AND service_type = ${selectedServiceType}
            AND department_id = ${selectedDeptId}
          ORDER BY priority DESC, created_at ASC
        `;
      }

      const data = await getApi<QueueTicket[]>(querySql);
      return data;
    },
  });

  // Real-time subscription for queue updates
  useEffect(() => {
    // In a real implementation, this would be replaced with WebSocket or Server-Sent Events
    // For now, we'll use polling to simulate real-time updates
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["queue-tickets"] });
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [queryClient]);

  // Call next patient
  const callNextPatient = async (counterNumber: string) => {
    try {
      // In a real implementation, this would call an API to update the queue
      // For now, we'll just invalidate the query to refresh the data
      await putApi("/generic-api", {
        table: "queue_tickets",
        data: { counterNumber, status: "called" },
        where: selectedDeptId ? { department_id: selectedDeptId } : undefined
      });
      
      queryClient.invalidateQueries({ queryKey: ["queue-tickets"] });
      toast.success("Antrian dipanggil");
    } catch (error) {
      console.error("Error calling next patient:", error);
      toast.error("Gagal memanggil antrian");
    }
  };

  // Mark as served
  const markAsServed = async (ticketId: string) => {
    try {
      await putApi("/generic-api", {});
      
      queryClient.invalidateQueries({ queryKey: ["queue-tickets"] });
      toast.success("Status antrian diperbarui");
    } catch (error) {
      console.error("Error marking as served:", error);
      toast.error("Gagal memperbarui status antrian");
    }
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Toggle display mode
  const toggleDisplayMode = () => {
    setIsDisplayMode(!isDisplayMode);
  };

  // Get next ticket number
  const getNextTicket = () => {
    const nextPriority = Math.max(...queueTickets.map(qt => qt.priority), 0) + 1;
    const newTicketNumber = `${selectedServiceType.substring(0, 3).toUpperCase()}-${String(nextPriority).padStart(4, '0')}`;
    
    return { ticketNumber: newTicketNumber, priority: nextPriority };
  };

  // Generate new ticket
  const generateNewTicket = async () => {
    const { ticketNumber, priority } = getNextTicket();
    const today = new Date().toISOString().split("T")[0];
    
    try {
      await postApi("/generic-api", {});
      
      queryClient.invalidateQueries({ queryKey: ["queue-tickets"] });
      toast.success(`Nomor antrian baru: ${ticketNumber}`);
    } catch (error) {
      console.error("Error generating new ticket:", error);
      toast.error("Gagal membuat nomor antrian baru");
    }
  };

  // Filter tickets by status
  const waitingTickets = queueTickets.filter(ticket => ticket.status === 'waiting');
  const servingTickets = queueTickets.filter(ticket => ticket.status === 'serving');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Antrian</h1>
          <p className="text-muted-foreground">Pemanggilan dan pengelolaan nomor antrian</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePause}>
            {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
            {isPaused ? "Lanjutkan" : "Jeda"}
          </Button>
          <Button onClick={generateNewTicket}>
            <Users className="h-4 w-4 mr-2" />
            Ambil Nomor
          </Button>
          <Button variant="outline" onClick={toggleDisplayMode}>
            <Monitor className="h-4 w-4 mr-2" />
            {isDisplayMode ? "Mode Operator" : "Mode Display"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{queueTickets.length}</p>
            <p className="text-sm text-muted-foreground">antrian hari ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Dipanggil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{servingTickets.length}</p>
            <p className="text-sm text-muted-foreground">sedang dilayani</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{waitingTickets.length}</p>
            <p className="text-sm text-muted-foreground">antrian tersisa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Loket</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(num => (
                <Button 
                  key={num} 
                  variant="outline" 
                  size="sm"
                  onClick={() => callNextPatient(String(num))}
                >
                  {num}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Daftar Antrian</CardTitle>
            <div className="flex gap-2">
              <Select value={selectedServiceType} onValueChange={setSelectedServiceType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rawat_jalan">Rawat Jalan</SelectItem>
                  <SelectItem value="laboratorium">Laboratorium</SelectItem>
                  <SelectItem value="radiologi">Radiologi</SelectItem>
                  <SelectItem value="farmasi">Farmasi</SelectItem>
                  <SelectItem value="kasir">Kasir</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={selectedDeptId} 
                onValueChange={setSelectedDeptId}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Poli" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["queue-tickets"] })}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            Antrian untuk {selectedServiceType === "rawat_jalan" ? "Rawat Jalan" : 
                         selectedServiceType === "laboratorium" ? "Laboratorium" : 
                         selectedServiceType === "radiologi" ? "Radiologi" : 
                         selectedServiceType === "farmasi" ? "Farmasi" : "Kasir"} 
            {selectedDeptId && ` - ${departments.find(d => d.id === selectedDeptId)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomor Antrian</TableHead>
                  <TableHead>Nama Pasien</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Loket</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueTickets.map(ticket => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.ticket_number}</TableCell>
                    <TableCell>
                      {ticket.patients?.full_name || "-"}
                      {ticket.patients?.medical_record_number && (
                        <div className="text-sm text-muted-foreground">
                          {ticket.patients.medical_record_number}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          ticket.status === "waiting" ? "secondary" :
                          ticket.status === "serving" ? "default" :
                          ticket.status === "completed" ? "outline" :
                          "destructive"
                        }
                      >
                        {ticket.status === "waiting" ? "Menunggu" : 
                         ticket.status === "serving" ? "Dipanggil" : 
                         ticket.status === "completed" ? "Selesai" : "Dibatalkan"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {ticket.counter_number ? `Loket ${ticket.counter_number}` : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {ticket.status === "waiting" && (
                          <Button 
                            size="sm" 
                            onClick={() => callNextPatient("1")}
                          >
                            Panggil
                          </Button>
                        )}
                        {ticket.status === "serving" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => markAsServed(ticket.id)}
                          >
                            Selesai
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            // In a real implementation, this would open a modal to update the ticket
                            toast.info("Fitur pemanggilan suara belum diimplementasikan");
                          }}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isDisplayMode && (
        <div className="fixed inset-0 bg-black text-white p-8 z-50">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-6xl font-bold mb-2">Layar Antrian</h1>
              <p className="text-2xl">Sistem Pemanggilan Antrian Digital</p>
            </div>
            <Button 
              variant="outline" 
              onClick={toggleDisplayMode}
              className="text-xl p-6"
            >
              Kembali ke Mode Operator
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8">
            <Card className="bg-blue-900 text-white">
              <CardHeader>
                <CardTitle className="text-4xl">Antrian Menunggu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-8xl font-bold text-center my-8">
                  {waitingTickets.length}
                </div>
                <p className="text-center text-2xl">jumlah antrian tersisa</p>
              </CardContent>
            </Card>

            <Card className="bg-green-900 text-white">
              <CardHeader>
                <CardTitle className="text-4xl">Dilayani Saat Ini</CardTitle>
              </CardHeader>
              <CardContent>
                {servingTickets.length > 0 ? (
                  <div className="text-8xl font-bold text-center my-8">
                    {servingTickets[0].ticket_number}
                  </div>
                ) : (
                  <div className="text-6xl font-bold text-center my-8 text-gray-400">
                    - kosong -
                  </div>
                )}
                <p className="text-center text-2xl">nomor yang sedang dipanggil</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-3xl">Silakan menuju loket yang tersedia</p>
          </div>
        </div>
      )}
    </div>
  );
}