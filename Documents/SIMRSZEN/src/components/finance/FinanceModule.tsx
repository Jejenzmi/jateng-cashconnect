import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  FileText, Users, Calendar, Calculator,
  Building, PiggyBank, Receipt, PieChart,
  ArrowUpDown, Package, UserRound
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Pie } from "recharts";

interface FinancialReport {
  id: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  department: string;
}

interface EmployeePayroll {
  id: string;
  employeeName: string;
  position: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  status: 'pending' | 'processed' | 'paid';
}

interface CostCenter {
  id: string;
  name: string;
  budget: number;
  spent: number;
  variance: number;
  department: string;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  department: string;
}

export default function FinanceModule() {
  const [activeTab, setActiveTab] = useState('financial-reports');
  
  const financialReports: FinancialReport[] = [
    { id: 'rep-1', period: 'Jan 2026', revenue: 1200000000, expenses: 800000000, profit: 400000000, department: 'UMUM' },
    { id: 'rep-2', period: 'Feb 2026', revenue: 1350000000, expenses: 850000000, profit: 500000000, department: 'UMUM' },
    { id: 'rep-3', period: 'Mar 2026', revenue: 1420000000, expenses: 920000000, profit: 500000000, department: 'UMUM' },
    { id: 'rep-4', period: 'Jan 2026', revenue: 300000000, expenses: 200000000, profit: 100000000, department: 'LABORATORIUM' },
    { id: 'rep-5', period: 'Feb 2026', revenue: 320000000, expenses: 210000000, profit: 110000000, department: 'LABORATORIUM' },
    { id: 'rep-6', period: 'Mar 2026', revenue: 350000000, expenses: 220000000, profit: 130000000, department: 'LABORATORIUM' },
  ];

  const employees: EmployeePayroll[] = [
    { id: 'emp-1', employeeName: 'Dr. Andrianto Sp.PD', position: 'Dokter Spesialis', basicSalary: 15000000, allowances: 5000000, deductions: 1200000, netSalary: 18800000, month: 'April 2026', status: 'pending' },
    { id: 'emp-2', employeeName: 'Siti Aisyah S.Kep', position: 'Perawat Senior', basicSalary: 8000000, allowances: 2000000, deductions: 800000, netSalary: 9200000, month: 'April 2026', status: 'processed' },
    { id: 'emp-3', employeeName: 'Bambang Sutedjo S.Farm', position: 'Apoteker', basicSalary: 9000000, allowances: 2500000, deductions: 900000, netSalary: 10600000, month: 'April 2026', status: 'paid' },
    { id: 'emp-4', employeeName: 'Rina Hapsari ST', position: 'IT Support', basicSalary: 7000000, allowances: 1500000, deductions: 700000, netSalary: 7800000, month: 'April 2026', status: 'pending' },
  ];

  const costCenters: CostCenter[] = [
    { id: 'cc-1', name: 'Ruangan VIP', budget: 500000000, spent: 420000000, variance: -80000000, department: 'Rawat Inap' },
    { id: 'cc-2', name: 'Farmasi', budget: 300000000, spent: 310000000, variance: 10000000, department: 'Farmasi' },
    { id: 'cc-3', name: 'Laboratorium', budget: 250000000, spent: 220000000, variance: -30000000, department: 'Laboratorium' },
    { id: 'cc-4', name: 'Radiologi', budget: 400000000, spent: 380000000, variance: -20000000, department: 'Radiologi' },
    { id: 'cc-5', name: 'Administrasi', budget: 200000000, spent: 180000000, variance: -20000000, department: 'Administrasi' },
  ];

  const transactions: Transaction[] = [
    { id: 'trans-1', description: 'Pendapatan Rawat Jalan', amount: 250000000, type: 'income', category: 'Pelayanan', date: '2026-04-01', department: 'Rawat Jalan' },
    { id: 'trans-2', description: 'Pembelian Obat Generik', amount: 45000000, type: 'expense', category: 'Farmasi', date: '2026-04-02', department: 'Farmasi' },
    { id: 'trans-3', description: 'Pendapatan Laboratorium', amount: 80000000, type: 'income', category: 'Pelayanan', date: '2026-04-03', department: 'Laboratorium' },
    { id: 'trans-4', description: 'Biaya Listrik Bulanan', amount: 25000000, type: 'expense', category: 'Operasional', date: '2026-04-05', department: 'Administrasi' },
    { id: 'trans-5', description: 'Pembayaran Gaji April', amount: 450000000, type: 'expense', category: 'SDM', date: '2026-04-10', department: 'SDM' },
    { id: 'trans-6', description: 'Pendapatan Rawat Inap', amount: 180000000, type: 'income', category: 'Pelayanan', date: '2026-04-15', department: 'Rawat Inap' },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 1200, expenses: 800 },
    { name: 'Feb', revenue: 1350, expenses: 850 },
    { name: 'Mar', revenue: 1420, expenses: 920 },
    { name: 'Apr*', revenue: 1500, expenses: 950 },
  ];

  const departmentRevenue = [
    { name: 'Rawat Jalan', value: 450 },
    { name: 'Rawat Inap', value: 320 },
    { name: 'Laboratorium', value: 280 },
    { name: 'Farmasi', value: 220 },
    { name: 'Radiologi', value: 230 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Keuangan & Akunting
          </h1>
          <p className="text-muted-foreground">Manajemen keuangan rumah sakit dan akuntansi</p>
        </div>
        <Button>
          <Receipt className="h-4 w-4 mr-2" />
          Entri Transaksi
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendapatan Bulan Ini</p>
                <p className="text-2xl font-bold">Rp 1.5 M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Biaya Bulan Ini</p>
                <p className="text-2xl font-bold">Rp 950 Jt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Laba Bulan Ini</p>
                <p className="text-2xl font-bold">Rp 550 Jt</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserRound className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pegawai Aktif</p>
                <p className="text-2xl font-bold">128</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial-reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Laporan Keuangan</span>
          </TabsTrigger>
          <TabsTrigger value="payroll-management" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Manajemen Gaji</span>
          </TabsTrigger>
          <TabsTrigger value="cost-center" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span>Cost Center</span>
          </TabsTrigger>
          <TabsTrigger value="transaction-log" className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span>Transaksi</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial-reports" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Pendapatan & Biaya</CardTitle>
                <CardDescription>Perkembangan bulanan tahun 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `Rp${value}J`} />
                    <Tooltip formatter={(value) => [`Rp${value} Jt`, '']} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#10b981" name="Pendapatan" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Biaya" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribusi Pendapatan per Departemen</CardTitle>
                <CardDescription>Kontribusi pendapatan dari masing-masing departemen</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <Pie
                    data={departmentRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentRevenue.map((entry, index) => (
                      <text key={`cell-${index}`} x={300} y={index * 20 + 20} textAnchor="start">
                        {`${entry.name}: ${(entry.value / 1500 * 100).toFixed(1)}%`}
                      </text>
                    ))}
                  </Pie>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Laporan Laba Rugi</CardTitle>
              <CardDescription>Rincian pendapatan dan biaya per departemen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Periode</th>
                      <th className="text-left py-2">Departemen</th>
                      <th className="text-right py-2">Pendapatan</th>
                      <th className="text-right py-2">Biaya</th>
                      <th className="text-right py-2">Laba</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialReports.map(report => (
                      <tr key={report.id} className="border-b">
                        <td className="py-2">{report.period}</td>
                        <td className="py-2">{report.department}</td>
                        <td className="py-2 text-right text-green-600">{formatCurrency(report.revenue)}</td>
                        <td className="py-2 text-right text-red-600">{formatCurrency(report.expenses)}</td>
                        <td className="py-2 text-right font-medium">
                          {report.profit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(report.profit))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll-management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Penggajian</CardTitle>
              <CardDescription>Pengelolaan gaji pegawai dan proses pembayaran</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map(employee => (
                  <Card key={employee.id} className="border-2 hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{employee.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{employee.position}</p>
                          <p className="text-sm mt-1">Bulan: {employee.month}</p>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status === 'pending' && 'Menunggu Proses'}
                          {employee.status === 'processed' && 'Sudah Diproses'}
                          {employee.status === 'paid' && 'Sudah Dibayar'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Gaji Pokok</p>
                          <p className="font-medium">{formatCurrency(employee.basicSalary)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tunjangan</p>
                          <p className="font-medium text-green-600">+{formatCurrency(employee.allowances)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Potongan</p>
                          <p className="font-medium text-red-600">-{formatCurrency(employee.deductions)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Bersih</p>
                          <p className="font-bold text-lg">{formatCurrency(employee.netSalary)}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {employee.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Calculator className="h-4 w-4 mr-2" />
                              Hitung Gaji
                            </Button>
                            <Button size="sm" className="flex-1">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Proses Pembayaran
                            </Button>
                          </>
                        )}
                        {employee.status === 'processed' && (
                          <Button size="sm" className="w-full">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Bayar Gaji
                          </Button>
                        )}
                        {employee.status === 'paid' && (
                          <Button variant="outline" size="sm" className="w-full">
                            <Receipt className="h-4 w-4 mr-2" />
                            Lihat Slip Gaji
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

        <TabsContent value="cost-center" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manajemen Cost Center</CardTitle>
              <CardDescription>Pemantauan anggaran dan realisasi per unit biaya</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Nama Cost Center</th>
                      <th className="text-left py-2">Departemen</th>
                      <th className="text-right py-2">Anggaran</th>
                      <th className="text-right py-2">Realisasi</th>
                      <th className="text-right py-2">Selisih</th>
                      <th className="text-center py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costCenters.map(center => (
                      <tr key={center.id} className="border-b">
                        <td className="py-2 font-medium">{center.name}</td>
                        <td className="py-2">{center.department}</td>
                        <td className="py-2 text-right">{formatCurrency(center.budget)}</td>
                        <td className="py-2 text-right">{formatCurrency(center.spent)}</td>
                        <td className={`py-2 text-right font-medium ${center.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {center.variance >= 0 ? '+' : ''}{formatCurrency(center.variance)}
                        </td>
                        <td className="py-2 text-center">
                          <Badge variant={center.variance >= 0 ? "destructive" : "default"}>
                            {center.variance >= 0 ? 'Melebihi Anggaran' : 'Dalam Anggaran'}
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

        <TabsContent value="transaction-log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Transaksi Keuangan</CardTitle>
              <CardDescription>Catatan transaksi masuk dan keluar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex gap-3 mt-1">
                        <p className="text-sm text-muted-foreground">{transaction.category}</p>
                        <p className="text-sm text-muted-foreground">{transaction.department}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-medium ${getTypeColor(transaction.type)}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}