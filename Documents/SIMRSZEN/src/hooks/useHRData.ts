import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data SDM
interface Employee {
  id: string;
  employee_number: string;
  full_name: string;
  position: string;
  department: string;
  join_date: string;
  employment_status: string;
  salary_grade?: string;
  bank_account?: string;
  npwp?: string;
  bpjs_ketenagakerjaan?: string;
  bpjs_kesehatan?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

interface Payroll {
  id: string;
  employee_id: string;
  period: string; // Format YYYY-MM
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: 'draft' | 'processed' | 'paid';
  processed_by?: string;
  processed_at?: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  check_in: string;
  check_out?: string;
  work_duration?: number; // Durasi kerja dalam jam
  status: 'present' | 'absent' | 'leave' | 'business_trip' | 'holiday';
  created_at: string;
  updated_at: string;
}

interface PayrollComponent {
  id: string;
  payroll_id: string;
  component_type: 'allowance' | 'deduction';
  name: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

// Interface untuk data shift kerja
export interface WorkShift {
  id: string;
  shift_code: string;
  shift_name: string;
  start_time: string; // Format waktu ISO
  end_time: string; // Format waktu ISO
  break_duration: number; // Dalam menit
  is_night_shift: boolean;
  allowance_amount: number;
  is_active: boolean;
  faskes_type_id?: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk jadwal shift
export interface ShiftSchedule {
  id: string;
  employee_id: string;
  work_shift_id: string;
  date: string; // Format tanggal ISO
  status: 'scheduled' | 'worked' | 'cancelled' | 'swapped';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function useHRData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all employees
  const { data: employees, isLoading: isLoadingEmployees } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const result = await getApi<Employee[]>`
          SELECT 
            id,
            employee_number,
            full_name,
            position,
            department,
            join_date,
            employment_status,
            salary_grade,
            bank_account,
            npwp,
            bpjs_ketenagakerjaan,
            bpjs_kesehatan,
            photo_url,
            created_at,
            updated_at
          FROM employees
          ORDER BY employee_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }
    },
  });

  // Fetch all leave requests
  const { data: leaveRequests, isLoading: isLoadingLeaveRequests } = useQuery<LeaveRequest[]>({
    queryKey: ["leave-requests"],
    queryFn: async () => {
      try {
        const result = await getApi<LeaveRequest[]>`
          SELECT 
            lr.id,
            lr.employee_id,
            lr.leave_type,
            lr.start_date,
            lr.end_date,
            lr.reason,
            lr.status,
            lr.approved_by,
            lr.approved_at,
            lr.created_at,
            lr.updated_at,
            e.full_name as employee_name
          FROM leave_requests lr
          LEFT JOIN employees e ON lr.employee_id = e.id
          ORDER BY lr.created_at DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching leave requests:", error);
        throw error;
      }
    },
  });

  // Fetch all payrolls
  const { data: payrolls, isLoading: isLoadingPayrolls } = useQuery<Payroll[]>({
    queryKey: ["payrolls"],
    queryFn: async () => {
      try {
        const result = await getApi<Payroll[]>`
          SELECT 
            p.id,
            p.employee_id,
            p.period,
            p.basic_salary,
            p.allowances,
            p.deductions,
            p.net_salary,
            p.status,
            p.processed_by,
            p.processed_at,
            p.paid_at,
            p.created_at,
            p.updated_at,
            e.full_name as employee_name,
            e.position,
            e.department
          FROM payrolls p
          LEFT JOIN employees e ON p.employee_id = e.id
          ORDER BY p.period DESC, e.full_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        throw error;
      }
    },
  });

  // Fetch attendance records for today
  const { data: todayAttendance } = useQuery<Attendance[]>({
    queryKey: ["today-attendance"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const result = await getApi<Attendance[]>`
          SELECT 
            a.id,
            a.employee_id,
            a.date,
            a.check_in,
            a.check_out,
            a.work_duration,
            a.status,
            a.created_at,
            a.updated_at,
            e.full_name as employee_name
          FROM attendances a
          LEFT JOIN employees e ON a.employee_id = e.id
          WHERE a.date = ${today}
          ORDER BY a.check_in
        `;
        return result;
      } catch (error) {
        console.error("Error fetching today's attendance:", error);
        throw error;
      }
    },
  });

  // Get HR dashboard statistics
  const { data: hrStats } = useQuery({
    queryKey: ["hr-stats"],
    queryFn: async () => {
      try {
        // Total employees
        const totalEmployeesRes = await getApi<{ count: number }[]>`
          SELECT COUNT(*) as count FROM employees
        `;
        const totalEmployees = totalEmployeesRes[0]?.count || 0;

        // Present today
        const presentTodayRes = await getApi<{ count: number }[]>`
          SELECT COUNT(*) as count 
          FROM attendances 
          WHERE date = ${new Date().toISOString().split('T')[0]} 
          AND status = 'present'
        `;
        const presentToday = presentTodayRes[0]?.count || 0;

        // Pending leave requests
        const pendingLeaveRes = await getApi<{ count: number }[]>`
          SELECT COUNT(*) as count 
          FROM leave_requests 
          WHERE status = 'pending'
        `;
        const pendingLeave = pendingLeaveRes[0]?.count || 0;

        // Pending payroll
        const pendingPayrollRes = await getApi<{ count: number }[]>`
          SELECT COUNT(*) as count 
          FROM payrolls 
          WHERE status = 'draft'
        `;
        const pendingPayroll = pendingPayrollRes[0]?.count || 0;

        return {
          totalEmployees,
          presentToday,
          pendingLeave,
          pendingPayroll,
        };
      } catch (error) {
        console.error("Error fetching HR stats:", error);
        throw error;
      }
    },
  });

  // Create new employee
  const createEmployee = useMutation({
    mutationFn: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Employee[]>`
        INSERT INTO employees (
          employee_number,
          full_name,
          position,
          department,
          join_date,
          employment_status,
          salary_grade,
          bank_account,
          npwp,
          bpjs_ketenagakerjaan,
          bpjs_kesehatan,
          photo_url
        ) VALUES (
          ${employeeData.employee_number},
          ${employeeData.full_name},
          ${employeeData.position},
          ${employeeData.department},
          ${employeeData.join_date},
          ${employeeData.employment_status},
          ${employeeData.salary_grade},
          ${employeeData.bank_account},
          ${employeeData.npwp},
          ${employeeData.bpjs_ketenagakerjaan},
          ${employeeData.bpjs_kesehatan},
          ${employeeData.photo_url}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Karyawan Berhasil Ditambahkan",
        description: "Data karyawan telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Karyawan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update employee
  const updateEmployee = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Employee> & { id: string }) => {
      const result = await getApi<Employee[]>`
        UPDATE employees 
        SET 
          employee_number = ${updateData.employee_number},
          full_name = ${updateData.full_name},
          position = ${updateData.position},
          department = ${updateData.department},
          join_date = ${updateData.join_date},
          employment_status = ${updateData.employment_status},
          salary_grade = ${updateData.salary_grade},
          bank_account = ${updateData.bank_account},
          npwp = ${updateData.npwp},
          bpjs_ketenagakerjaan = ${updateData.bpjs_ketenagakerjaan},
          bpjs_kesehatan = ${updateData.bpjs_kesehatan},
          photo_url = ${updateData.photo_url},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Karyawan Berhasil Diperbarui",
        description: "Data karyawan telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Karyawan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit leave request
  const submitLeaveRequest = useMutation({
    mutationFn: async (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<LeaveRequest[]>`
        INSERT INTO leave_requests (
          employee_id,
          leave_type,
          start_date,
          end_date,
          reason
        ) VALUES (
          ${leaveData.employee_id},
          ${leaveData.leave_type},
          ${leaveData.start_date},
          ${leaveData.end_date},
          ${leaveData.reason}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
      toast({
        title: "Permohonan Cuti Dikirim",
        description: "Permohonan cuti telah dikirimkan untuk persetujuan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Mengirim Permohonan Cuti",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Process payroll
  const processPayroll = useMutation({
    mutationFn: async (payrollData: Omit<Payroll, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Payroll[]>`
        INSERT INTO payrolls (
          employee_id,
          period,
          basic_salary,
          allowances,
          deductions,
          net_salary,
          status
        ) VALUES (
          ${payrollData.employee_id},
          ${payrollData.period},
          ${payrollData.basic_salary},
          ${payrollData.allowances},
          ${payrollData.deductions},
          ${payrollData.net_salary},
          'processed'
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      toast({
        title: "Payroll Diproses",
        description: "Data payroll telah diproses.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memproses Payroll",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    employees,
    leaveRequests,
    payrolls,
    todayAttendance,
    hrStats,
    isLoadingEmployees,
    isLoadingLeaveRequests,
    isLoadingPayrolls,
    createEmployee: createEmployee.mutate,
    updateEmployee: updateEmployee.mutate,
    submitLeaveRequest: submitLeaveRequest.mutate,
    processPayroll: processPayroll.mutate,
    isCreatingEmployee: createEmployee.isPending,
    isUpdatingEmployee: updateEmployee.isPending,
    isSubmittingLeave: submitLeaveRequest.isPending,
    isProcessingPayroll: processPayroll.isPending,
  };
}

// Fungsi tambahan yang dibutuhkan
export function useAttendance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all attendance records
  const { data: attendanceRecords, isLoading } = useQuery<Attendance[]>({
    queryKey: ["attendance-records"],
    queryFn: async () => {
      try {
        const result = await getApi<Attendance[]>`
          SELECT 
            a.id,
            a.employee_id,
            a.date,
            a.check_in,
            a.check_out,
            a.work_duration,
            a.status,
            a.created_at,
            a.updated_at,
            e.full_name as employee_name
          FROM attendances a
          LEFT JOIN employees e ON a.employee_id = e.id
          ORDER BY a.date DESC, a.check_in
        `;
        return result;
      } catch (error) {
        console.error("Error fetching attendance records:", error);
        throw error;
      }
    },
  });

  return { data: attendanceRecords, isLoading };
}

export function useEmployees() {
  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      try {
        const result = await getApi<Employee[]>`
          SELECT 
            id,
            employee_number,
            full_name,
            position,
            department,
            join_date,
            employment_status,
            salary_grade,
            bank_account,
            npwp,
            bpjs_ketenagakerjaan,
            bpjs_kesehatan,
            photo_url,
            created_at,
            updated_at
          FROM employees
          ORDER BY employee_number
        `;
        return result;
      } catch (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }
    },
  });

  return { data: employees, isLoading };
}

export function useAddAttendance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (attendanceData: Omit<Attendance, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Attendance[]>`
        INSERT INTO attendances (
          employee_id,
          date,
          check_in,
          check_out,
          work_duration,
          status
        ) VALUES (
          ${attendanceData.employee_id},
          ${attendanceData.date},
          ${attendanceData.check_in},
          ${attendanceData.check_out},
          ${attendanceData.work_duration},
          ${attendanceData.status}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-records"] });
      queryClient.invalidateQueries({ queryKey: ["today-attendance"] });
      toast({
        title: "Absensi Berhasil Ditambahkan",
        description: "Data absensi karyawan telah ditambahkan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Absensi",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addAttendance: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useAddEmployee() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (employeeData: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Employee[]>`
        INSERT INTO employees (
          employee_number,
          full_name,
          position,
          department,
          join_date,
          employment_status,
          salary_grade,
          bank_account,
          npwp,
          bpjs_ketenagakerjaan,
          bpjs_kesehatan,
          photo_url
        ) VALUES (
          ${employeeData.employee_number},
          ${employeeData.full_name},
          ${employeeData.position},
          ${employeeData.department},
          ${employeeData.join_date},
          ${employeeData.employment_status},
          ${employeeData.salary_grade},
          ${employeeData.bank_account},
          ${employeeData.npwp},
          ${employeeData.bpjs_ketenagakerjaan},
          ${employeeData.bpjs_kesehatan},
          ${employeeData.photo_url}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Karyawan Berhasil Ditambahkan",
        description: "Data karyawan telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Karyawan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addEmployee: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useUpdateEmployee() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Employee> & { id: string }) => {
      const result = await getApi<Employee[]>`
        UPDATE employees 
        SET 
          employee_number = ${updateData.employee_number},
          full_name = ${updateData.full_name},
          position = ${updateData.position},
          department = ${updateData.department},
          join_date = ${updateData.join_date},
          employment_status = ${updateData.employment_status},
          salary_grade = ${updateData.salary_grade},
          bank_account = ${updateData.bank_account},
          npwp = ${updateData.npwp},
          bpjs_ketenagakerjaan = ${updateData.bpjs_ketenagakerjaan},
          bpjs_kesehatan = ${updateData.bpjs_kesehatan},
          photo_url = ${updateData.photo_url},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Karyawan Berhasil Diperbarui",
        description: "Data karyawan telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Karyawan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updateEmployee: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useDeleteEmployee() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (employeeId: string) => {
      await deleteApi("/generic-api");
      return employeeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Karyawan Berhasil Dihapus",
        description: "Data karyawan telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Karyawan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    deleteEmployee: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useDepartments() {
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      try {
        const result = await getApi<{ id: string; name: string; head: string }[]>`
          SELECT 
            id,
            name,
            head
          FROM departments
          ORDER BY name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching departments:", error);
        throw error;
      }
    },
  });

  return { data: departments, isLoading };
}

export function useEmployeeGrades() {
  const { data: grades, isLoading } = useQuery({
    queryKey: ["employee-grades"],
    queryFn: async () => {
      try {
        const result = await getApi<{ grade: string; description: string; base_salary: number }[]>`
          SELECT 
            grade,
            description,
            base_salary
          FROM employee_grades
          ORDER BY grade
        `;
        return result;
      } catch (error) {
        console.error("Error fetching employee grades:", error);
        throw error;
      }
    },
  });

  return { data: grades, isLoading };
}

export function usePayroll() {
  const { data: payrolls, isLoading } = useQuery<Payroll[]>({
    queryKey: ["payrolls"],
    queryFn: async () => {
      try {
        const result = await getApi<Payroll[]>`
          SELECT 
            p.id,
            p.employee_id,
            p.period,
            p.basic_salary,
            p.allowances,
            p.deductions,
            p.net_salary,
            p.status,
            p.processed_by,
            p.processed_at,
            p.paid_at,
            p.created_at,
            p.updated_at,
            e.full_name as employee_name,
            e.position,
            e.department
          FROM payrolls p
          LEFT JOIN employees e ON p.employee_id = e.id
          ORDER BY p.period DESC, e.full_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching payrolls:", error);
        throw error;
      }
    },
  });

  return { data: payrolls, isLoading };
}

export function useCreatePayroll() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payrollData: Omit<Payroll, 'id' | 'status' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<Payroll[]>`
        INSERT INTO payrolls (
          employee_id,
          period,
          basic_salary,
          allowances,
          deductions,
          net_salary,
          status
        ) VALUES (
          ${payrollData.employee_id},
          ${payrollData.period},
          ${payrollData.basic_salary},
          ${payrollData.allowances},
          ${payrollData.deductions},
          ${payrollData.net_salary},
          'draft'
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      toast({
        title: "Draft Payroll Dibuat",
        description: "Data draft payroll telah dibuat.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Draft Payroll",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    createPayroll: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useUpdatePayroll() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Payroll> & { id: string }) => {
      const result = await getApi<Payroll[]>`
        UPDATE payrolls 
        SET 
          employee_id = ${updateData.employee_id},
          period = ${updateData.period},
          basic_salary = ${updateData.basic_salary},
          allowances = ${updateData.allowances},
          deductions = ${updateData.deductions},
          net_salary = ${updateData.net_salary},
          status = ${updateData.status},
          processed_by = ${updateData.processed_by},
          processed_at = ${updateData.processed_at},
          paid_at = ${updateData.paid_at},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      toast({
        title: "Payroll Berhasil Diperbarui",
        description: "Data payroll telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Payroll",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    updatePayroll: mutation.mutate,
    isPending: mutation.isPending
  };
}

export function useSalaryComponents() {
  const { data: components, isLoading } = useQuery<PayrollComponent[]>({
    queryKey: ["salary-components"],
    queryFn: async () => {
      try {
        const result = await getApi<PayrollComponent[]>`
          SELECT 
            sc.id,
            sc.payroll_id,
            sc.component_type,
            sc.name,
            sc.amount,
            sc.created_at,
            sc.updated_at,
            p.period,
            e.full_name as employee_name
          FROM salary_components sc
          LEFT JOIN payrolls p ON sc.payroll_id = p.id
          LEFT JOIN employees e ON p.employee_id = e.id
          ORDER BY sc.component_type, sc.name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching salary components:", error);
        throw error;
      }
    },
  });

  return { data: components, isLoading };
}

// Fungsi untuk menghitung PPh 21 (Pajak Penghasilan Pasal 21)
export function calculatePPh21(grossIncome: number, deductions: number, maritalStatus: 'single' | 'married' = 'single', numberOfDependents: number = 0): number {
  // Ini adalah perhitungan sederhana untuk demonstrasi
  // Dalam implementasi nyata, perhitungan PPh 21 lebih kompleks
  
  // Hitung Penghasilan Neto Setahun
  const annualGross = grossIncome * 12;
  const annualDeductions = deductions * 12;
  const netAnnualIncome = annualGross - annualDeductions;
  
  // Hitung PTNP (Penghasilan Tidak Kena Pajak)
  let ptkp = 54000000; // PTKP tahun 2023 untuk pekerja tunggal tanpa anak
  if (maritalStatus === 'married') {
    ptkp += 4500000; // Tambahan untuk istri
  }
  ptkp += numberOfDependents * 4500000; // Tambahan per anak maksimal 3 anak
  
  // Hitung Penghasilan Kena Pajak
  const taxableIncome = Math.max(0, netAnnualIncome - ptkp);
  
  // Tarif Progresif PPh 21
  let tax = 0;
  if (taxableIncome <= 60000000) {
    tax = taxableIncome * 0.05;
  } else if (taxableIncome <= 250000000) {
    tax = 60000000 * 0.05 + (taxableIncome - 60000000) * 0.15;
  } else if (taxableIncome <= 500000000) {
    tax = 60000000 * 0.05 + (250000000 - 60000000) * 0.15 + (taxableIncome - 250000000) * 0.25;
  } else {
    tax = 60000000 * 0.05 + (250000000 - 60000000) * 0.15 + (500000000 - 250000000) * 0.25 + (taxableIncome - 500000000) * 0.3;
  }
  
  // Kembalikan pajak bulanan
  return tax / 12;
}

// Fungsi untuk menghitung BPJS (Kesehatan dan Ketenagakerjaan)
export function calculateBPJS(grossIncome: number, employeeOnly: boolean = false): { bpjsKesehatan: number; bpjsKetenagakerjaan: number; total: number } {
  // Persentase kontribusi berdasarkan PP 85/2015 untuk BPJS Kesehatan dan PP 71/2020 untuk BPJS Ketenagakerjaan
  const bpjsKesehatanPercentage = 0.01; // 1% dari gaji
  const jhtEmployeePercentage = 0.02; // 2% JHT untuk karyawan
  const jpPercentage = 0.02; // 2% JP (Jaminan Pensiun) untuk karyawan
  const jkkPercentage = 0.0024; // 0.24% JKK rata-rata
  const jkmPercentage = 0.003; // 0.3% JKM
  
  const maxBpjsCalculationBase = 15000000; // Batas maksimum perhitungan BPJS
  const calculationBase = Math.min(grossIncome, maxBpjsCalculationBase);
  
  const bpjsKesehatan = calculationBase * bpjsKesehatanPercentage;
  
  let bpjsKetenagakerjaan = 0;
  if (!employeeOnly) {
    // Jika termasuk kontribusi perusahaan
    bpjsKetenagakerjaan = 
      calculationBase * jhtEmployeePercentage +  // JHT karyawan
      calculationBase * jpPercentage +  // JP karyawan
      calculationBase * jkkPercentage +  // JKK perusahaan
      calculationBase * jkmPercentage;   // JKM perusahaan
  } else {
    // Hanya kontribusi karyawan
    bpjsKetenagakerjaan = 
      calculationBase * jhtEmployeePercentage +  // JHT karyawan
      calculationBase * jpPercentage;  // JP karyawan
  }
  
  const total = bpjsKesehatan + bpjsKetenagakerjaan;
  
  return {
    bpjsKesehatan,
    bpjsKetenagakerjaan,
    total
  };
}

export function usePerformanceReviews() {
  const { data: performanceReviews, isLoading } = useQuery({
    queryKey: ["performance-reviews"],
    queryFn: async () => {
      try {
        const result = await getApi<any[]>`
          SELECT 
            pr.id,
            pr.employee_id,
            pr.review_period,
            pr.reviewer_id,
            pr.performance_score,
            pr.comments,
            pr.created_at,
            e.full_name as employee_name,
            r.full_name as reviewer_name
          FROM performance_reviews pr
          LEFT JOIN employees e ON pr.employee_id = e.id
          LEFT JOIN employees r ON pr.reviewer_id = r.id
          ORDER BY pr.review_period DESC, e.full_name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching performance reviews:", error);
        throw error;
      }
    },
  });

  return { data: performanceReviews, isLoading };
}

export function useAddPerformanceReview() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (reviewData: { 
      employee_id: string; 
      review_period: string; 
      reviewer_id: string; 
      performance_score: number; 
      comments: string 
    }) => {
      const result = await getApi<any[]>`
        INSERT INTO performance_reviews (
          employee_id,
          review_period,
          reviewer_id,
          performance_score,
          comments
        ) VALUES (
          ${reviewData.employee_id},
          ${reviewData.review_period},
          ${reviewData.reviewer_id},
          ${reviewData.performance_score},
          ${reviewData.comments}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["performance-reviews"] });
      toast({
        title: "Ulasan Kinerja Ditambahkan",
        description: "Data ulasan kinerja karyawan telah ditambahkan.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menambahkan Ulasan Kinerja",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    addPerformanceReview: mutation.mutate,
    isPending: mutation.isPending
  };
}

// Hook khusus untuk data shift
export function useWorkShifts(faskesTypeId?: string) {
  const queryKey = faskesTypeId ? ["work-shifts", faskesTypeId] : ["work-shifts"];
  
  const { data: shifts, isLoading } = useQuery<WorkShift[]>({
    queryKey,
    queryFn: async () => {
      try {
        let result;
        if (faskesTypeId) {
          result = await getApi<WorkShift[]>`
            SELECT 
              id,
              shift_code,
              shift_name,
              start_time::text,
              end_time::text,
              break_duration,
              is_night_shift,
              allowance_amount,
              is_active,
              faskes_type_id,
              created_at,
              updated_at
            FROM work_shifts
            WHERE faskes_type_id = ${faskesTypeId} OR faskes_type_id IS NULL
            ORDER BY shift_name
          `;
        } else {
          result = await getApi<WorkShift[]>`
            SELECT 
              id,
              shift_code,
              shift_name,
              start_time::text,
              end_time::text,
              break_duration,
              is_night_shift,
              allowance_amount,
              is_active,
              faskes_type_id,
              created_at,
              updated_at
            FROM work_shifts
            ORDER BY shift_name
          `;
        }
        return result;
      } catch (error) {
        console.error("Error fetching work shifts:", error);
        throw error;
      }
    },
  });

  return { data: shifts, isLoading };
}

// Hook untuk jadwal shift
export function useShiftSchedules(employeeId?: string) {
  const queryKey = employeeId ? ["shift-schedules", employeeId] : ["shift-schedules"];
  
  const { data: schedules, isLoading } = useQuery<ShiftSchedule[]>({
    queryKey,
    queryFn: async () => {
      try {
        let result;
        if (employeeId) {
          result = await getApi<ShiftSchedule[]>`
            SELECT 
              ss.id,
              ss.employee_id,
              ss.work_shift_id,
              ss.date::text,
              ss.status,
              ss.notes,
              ss.created_at,
              ss.updated_at,
              ws.shift_name
            FROM shift_schedules ss
            LEFT JOIN work_shifts ws ON ss.work_shift_id = ws.id
            WHERE ss.employee_id = ${employeeId}
            ORDER BY ss.date
          `;
        } else {
          result = await getApi<ShiftSchedule[]>`
            SELECT 
              ss.id,
              ss.employee_id,
              ss.work_shift_id,
              ss.date::text,
              ss.status,
              ss.notes,
              ss.created_at,
              ss.updated_at,
              ws.shift_name
            FROM shift_schedules ss
            LEFT JOIN work_shifts ws ON ss.work_shift_id = ws.id
            ORDER BY ss.date, ss.employee_id
          `;
        }
        return result;
      } catch (error) {
        console.error("Error fetching shift schedules:", error);
        throw error;
      }
    },
  });

  return { data: schedules, isLoading };
}

// Stub types and hooks for HR components
export interface OvertimeRecord {
  id: string;
  employee_id: string;
  date: string;
  hours: number;
  rate: number;
  total: number;
  status: string;
  created_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  period: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  status: string;
  created_at: string;
}

export interface TrainingRecord {
  id: string;
  employee_id: string;
  training_name: string;
  start_date: string;
  end_date: string;
  status: string;
  certificate_url?: string;
  created_at: string;
}

export function calculateOvertimeRate(hourlyRate: number, hours: number): number {
  return hourlyRate * hours * 1.5;
}

export function useLeaveRequests(employeeId?: string) {
  return { data: [] as any[], isLoading: false };
}

export function useAddLeaveRequest() {
  return { mutate: (_data: any) => {}, isPending: false };
}

export function useUpdateLeaveRequest() {
  return { mutate: (_data: any) => {}, isPending: false };
}

export function useOvertimeRecords(employeeId?: string) {
  return { data: [] as OvertimeRecord[], isLoading: false };
}

export function useAddOvertime() {
  return { mutate: (_data: Partial<OvertimeRecord>) => {}, isPending: false };
}

export function useUpdateOvertime() {
  return { mutate: (_data: Partial<OvertimeRecord>) => {}, isPending: false };
}

export function useTrainingRecords(employeeId?: string) {
  return { data: [] as TrainingRecord[], isLoading: false };
}

export function useAddTraining() {
  return { mutate: (_data: Partial<TrainingRecord>) => {}, isPending: false };
}
