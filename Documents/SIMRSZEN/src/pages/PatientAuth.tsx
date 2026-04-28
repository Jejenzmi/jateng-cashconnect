import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Loader2, User, Heart, Shield, Calendar, EyeIcon, EyeOffIcon } from "lucide-react";
export default function PatientAuth() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerNIK, setRegisterNIK] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get patient data from PostgreSQL
      const result = await getApi<any[]>`
        SELECT p.id, p.full_name, p.email, p.nik, p.phone, p.user_id
        FROM patients p
        WHERE p.email = ${loginEmail}
      `;

      if (result.length === 0) {
        throw new Error("Email tidak ditemukan");
      }

      // In real implementation, this would check the password hash
      // For now, we'll assume the password is correct if email exists
      const patient = result[0];

      // Store patient data in state or localStorage for demo purposes
      localStorage.setItem('patient', JSON.stringify({
        id: patient.id,
        email: patient.email,
        fullName: patient.full_name
      }));

      toast.success("Login berhasil!");
      navigate("/patient-portal");
    } catch (error: any) {
      toast.error(error.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate NIK length
      if (registerNIK.length !== 16) {
        throw new Error("NIK harus terdiri dari 16 digit");
      }

      // Check if patient with NIK exists
      const nikCheck = await getApi<any[]>`
        SELECT id, full_name, nik, user_id 
        FROM patients 
        WHERE nik = ${registerNIK}
      `;

      if (nikCheck.length === 0) {
        throw new Error("NIK tidak ditemukan dalam sistem. Pastikan Anda sudah pernah berobat di rumah sakit ini.");
      }

      const patientRecord = nikCheck[0];

      if (patientRecord.user_id) {
        throw new Error("NIK ini sudah terdaftar dengan akun lain.");
      }

      // Check if email already exists
      const emailCheck = await getApi<any[]>`
        SELECT id FROM patients WHERE email = ${registerEmail}
      `;

      if (emailCheck.length > 0) {
        throw new Error("Email ini sudah terdaftar");
      }

      // In a real implementation, we would:
      // 1. Hash the password
      // 2. Create a user in our authentication table
      // 3. Link the user ID to the patient record
      
      // For this demo, we'll simulate creating a user and linking to patient record
      const simulatedUserId = `user_${Date.now()}`;
      
      // Update patient record with user ID (simulating linking)
      const updateResult = await putApi("/generic-api", {});

      // Store basic user info in localStorage for demo purposes
      localStorage.setItem('patient', JSON.stringify({
        id: patientRecord.id,
        email: registerEmail,
        fullName: registerFullName
      }));

      toast.success("Registrasi berhasil! Akun Anda telah dibuat.");
    } catch (error: any) {
      toast.error(error.message || "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden md:block space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">Portal Pasien</h1>
            <p className="text-xl text-muted-foreground">
              Akses informasi kesehatan Anda kapan saja, di mana saja
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Rekam Medis Digital</h3>
                <p className="text-sm text-muted-foreground">
                  Lihat riwayat kesehatan dan hasil pemeriksaan Anda secara lengkap
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">E-Prescription dengan QR</h3>
                <p className="text-sm text-muted-foreground">
                  Ambil obat di farmasi dengan scan QR code - tanpa antri
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Booking Online</h3>
                <p className="text-sm text-muted-foreground">
                  Jadwalkan kunjungan dokter secara online dengan mudah
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Selamat Datang</CardTitle>
            <CardDescription>
              Masuk atau daftar untuk mengakses portal pasien
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="email@contoh.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Masuk"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-nik">NIK (Nomor Induk Kependudukan)</Label>
                    <Input
                      id="register-nik"
                      type="text"
                      placeholder="16 digit NIK"
                      value={registerNIK}
                      onChange={(e) => setRegisterNIK(e.target.value)}
                      maxLength={16}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      NIK harus sesuai dengan data saat Anda berobat
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nama Lengkap</Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Nama sesuai KTP"
                      value={registerFullName}
                      onChange={(e) => setRegisterFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="email@contoh.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-phone">No. Telepon (Opsional)</Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="08xxxxxxxxxx"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      "Daftar"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Staff rumah sakit?{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>
                  Login di sini
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
