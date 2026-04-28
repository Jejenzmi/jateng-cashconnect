-- Script inisialisasi database untuk SIMRS ZEN

-- Membuat tabel hospital_profile
CREATE TABLE IF NOT EXISTS hospital_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_name VARCHAR(255),
    hospital_code VARCHAR(50),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    website VARCHAR(255),
    logo_url TEXT,  -- URL logo rumah sakit yang disimpan di MinIO
    enable_bsre_signature BOOLEAN DEFAULT FALSE, -- Fitur TTE BSre aktif/tidak
    bsre_api_config JSONB, -- Konfigurasi API untuk integrasi BSre
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat tabel user
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Harus disimpan dalam bentuk hash
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,  -- Contoh: admin, staff, doctor
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat tabel patient
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_number VARCHAR(50) UNIQUE NOT NULL,  -- Nomor rekam medis
    identity_number VARCHAR(50),  -- NIK
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,  -- male, female
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    blood_type VARCHAR(5),  -- A, B, AB, O
    marital_status VARCHAR(20),  -- single, married, divorced, widowed
    occupation VARCHAR(100),
    education VARCHAR(100),
    religion VARCHAR(50),
    emergency_contact VARCHAR(255),
    insurance_provider VARCHAR(255),  -- Nama perusahaan asuransi
    insurance_number VARCHAR(100),  -- Nomor kartu asuransi
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat tabel department
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    head_doctor_id VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Membuat tabel visit
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    visit_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    visit_type VARCHAR(50) NOT NULL,  -- rawat_jalan, rawat_inap, gawat_darurat, kontrol
    department_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    complaint TEXT,  -- Keluhan utama pasien
    diagnosis TEXT,  -- Diagnosa awal
    treatment TEXT,  -- Penanganan awal
    notes TEXT,  -- Catatan dokter
    status VARCHAR(50) NOT NULL,  -- registered, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (doctor_id) REFERENCES users(id)
);

-- Membuat tabel queue_ticket
CREATE TABLE IF NOT EXISTS queue_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) NOT NULL,  -- Contoh: A-001
    service_desk VARCHAR(100) NOT NULL,  -- Nama loket atau layanan
    status VARCHAR(50) NOT NULL,  -- waiting, called, served, cancelled
    patient_id UUID NOT NULL,
    department_id UUID NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    called_at TIMESTAMP WITH TIME ZONE,
    served_at TIMESTAMP WITH TIME ZONE,
    estimated_wait_time INTEGER,  -- Estimasi waktu tunggu dalam menit
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Membuat tabel smart_display_config
CREATE TABLE IF NOT EXISTS smart_display_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,  -- Nama konfigurasi
    device_type VARCHAR(50) NOT NULL,  -- queue_display, info_display, wayfinding
    department_id UUID,  -- Bisa null untuk konfigurasi global
    location VARCHAR(255) NOT NULL,  -- Lokasi layar
    screen_layout JSONB,  -- Layout layar dalam bentuk JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Membuat tabel smart_display_device
CREATE TABLE IF NOT EXISTS smart_display_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_name VARCHAR(255) NOT NULL,
    device_token VARCHAR(255) UNIQUE NOT NULL,  -- Token otentikasi perangkat
    config_id UUID NOT NULL,
    last_connected TIMESTAMP WITH TIME ZONE,
    is_online BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),  -- Lokasi perangkat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (config_id) REFERENCES smart_display_configs(id)
);

-- Membuat tabel audit_log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,  -- Nama tabel yang diubah
    record_id UUID NOT NULL,  -- ID record yang diubah
    action VARCHAR(20) NOT NULL,  -- INSERT, UPDATE, DELETE
    old_values JSONB,  -- Nilai lama sebelum perubahan
    new_values JSONB,  -- Nilai baru setelah perubahan
    user_id UUID,  -- ID pengguna yang melakukan perubahan
    ip_address INET,  -- Alamat IP pengguna
    user_agent TEXT,  -- User agent browser
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabel-tabel untuk modul akuntansi
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_number VARCHAR(20) UNIQUE NOT NULL,  -- Nomor akun (misal: 1-10001)
    account_name VARCHAR(255) NOT NULL,  -- Nama akun (misal: Kas di Tangan)
    account_type VARCHAR(50) NOT NULL,  -- asset, liability, equity, revenue, expense, cash
    parent_account UUID REFERENCES accounts(id),  -- Untuk hierarki akun
    balance DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_number VARCHAR(50) UNIQUE NOT NULL,  -- Nomor jurnal otomatis (misal: JU-20231201-001)
    journal_date DATE NOT NULL,
    description TEXT,
    total_debit DECIMAL(15,2) NOT NULL,
    total_credit DECIMAL(15,2) NOT NULL,
    posted BOOLEAN DEFAULT FALSE,  -- Sudah diposting atau belum
    posted_at TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL,  -- ID user yang membuat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS journal_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_id UUID NOT NULL,
    account_id UUID NOT NULL,
    debit DECIMAL(15,2) DEFAULT 0.00,
    credit DECIMAL(15,2) DEFAULT 0.00,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (journal_id) REFERENCES journals(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabel untuk menyimpan kategori arus kas
CREATE TABLE IF NOT EXISTS cash_flow_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,  -- Nama kategori (Contoh: Pendapatan Operasional)
    type VARCHAR(50) NOT NULL,  -- operating, investing, financing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel untuk menyimpan item-item laporan arus kas
CREATE TABLE IF NOT EXISTS cash_flow_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL,
    account_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,  -- Nama item arus kas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES cash_flow_categories(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabel untuk menyimpan data pendapatan dan beban bulanan
CREATE TABLE IF NOT EXISTS revenue_expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    period VARCHAR(7) NOT NULL,  -- Format YYYY-MM
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- revenue, expense
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabel untuk menyimpan data arus kas bulanan
CREATE TABLE IF NOT EXISTS cash_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    period VARCHAR(7) NOT NULL,  -- Format YYYY-MM
    amount DECIMAL(15,2) NOT NULL,
    type VARCHAR(20) NOT NULL,  -- cash_in, cash_out
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Tabel untuk rasio keuangan
CREATE TABLE IF NOT EXISTS financial_ratios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period VARCHAR(7) NOT NULL,  -- Format YYYY-MM
    ratio_type VARCHAR(50) NOT NULL,  -- current_ratio, debt_to_equity, roa, roe, dll
    value DECIMAL(10,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel-tabel untuk modul ambulans
CREATE TABLE IF NOT EXISTS ambulances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,  -- Nomor kendaraan
    brand_model VARCHAR(100) NOT NULL,  -- Merk dan model
    year INTEGER NOT NULL,  -- Tahun pembuatan
    capacity INTEGER NOT NULL,  -- Kapasitas penumpang
    status VARCHAR(20) NOT NULL DEFAULT 'available',  -- available, maintenance, on_mission
    driver_name VARCHAR(255),  -- Nama supir
    driver_phone VARCHAR(20),  -- Nomor telepon supir
    equipment JSONB,  -- Daftar peralatan dalam bentuk JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ambulance_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,  -- Nomor SIM
    phone VARCHAR(20),
    shift VARCHAR(20),  -- Pagi, Siang, Malam
    status VARCHAR(20) NOT NULL DEFAULT 'available',  -- available, on_duty, off_duty
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ambulance_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ambulance_id UUID NOT NULL,
    driver_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    trip_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    purpose VARCHAR(20) NOT NULL,  -- emergency, transfer, scheduled
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, in_transit, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (ambulance_id) REFERENCES ambulances(id),
    FOREIGN KEY (driver_id) REFERENCES ambulance_drivers(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Tabel-tabel untuk form builder
CREATE TABLE IF NOT EXISTS form_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    fields JSONB,  -- Struktur field dalam bentuk JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID NOT NULL,  -- ID user yang membuat
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS form_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_template_id UUID NOT NULL,
    field_order INTEGER NOT NULL,
    field_type VARCHAR(20) NOT NULL,  -- text, textarea, number, date, checkbox, radio, select, section_header
    field_label VARCHAR(255) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_placeholder VARCHAR(255),
    field_options JSONB,  -- Opsi untuk radio/select
    is_required BOOLEAN DEFAULT FALSE,
    validation_rules JSONB,  -- Aturan validasi dalam bentuk JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (form_template_id) REFERENCES form_templates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    form_template_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    submitted_data JSONB,  -- Data yang disubmit dalam bentuk JSON
    submitted_by UUID NOT NULL,  -- ID user yang submit
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft, submitted, reviewed, approved
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (form_template_id) REFERENCES form_templates(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id)
);

-- Tabel untuk konfigurasi tanda tangan elektronik
CREATE TABLE IF NOT EXISTS electronic_signature_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_profile_id UUID NOT NULL,
    signature_type VARCHAR(50) NOT NULL,  -- bsre, other
    is_enabled BOOLEAN DEFAULT FALSE,
    api_endpoint VARCHAR(500),  -- Endpoint API untuk layanan TTE
    api_key_encrypted TEXT,  -- Kunci API yang dienkripsi
    config_metadata JSONB,  -- Konfigurasi tambahan dalam bentuk JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (hospital_profile_id) REFERENCES hospital_profile(id) ON DELETE CASCADE
);

-- Tabel-tabel untuk modul SDM
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number VARCHAR(50) UNIQUE NOT NULL,  -- Nomor pegawai
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    join_date DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL,  -- permanent, contract, probation
    salary_grade VARCHAR(50),  -- Golongan gaji
    bank_account VARCHAR(100),  -- Nomor rekening
    npwp VARCHAR(50),  -- Nomor Pokok Wajib Pajak
    bpjs_ketenagakerjaan VARCHAR(50),  -- Nomor BPJS Ketenagakerjaan
    bpjs_kesehatan VARCHAR(50),  -- Nomor BPJS Kesehatan
    photo_url TEXT,  -- URL foto karyawan di MinIO
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    leave_type VARCHAR(50) NOT NULL,  -- annual, sick, maternity, etc
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending, approved, rejected
    approved_by UUID,  -- ID user yang menyetujui
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    period VARCHAR(7) NOT NULL,  -- Format YYYY-MM
    basic_salary DECIMAL(15,2) NOT NULL,
    allowances DECIMAL(15,2) DEFAULT 0.00,
    deductions DECIMAL(15,2) DEFAULT 0.00,
    net_salary DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft, processed, paid
    processed_by UUID,  -- ID user yang memproses
    processed_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (processed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payroll_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_id UUID NOT NULL,
    component_type VARCHAR(20) NOT NULL,  -- allowance, deduction
    name VARCHAR(255) NOT NULL,  -- Nama komponen gaji
    amount DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (payroll_id) REFERENCES payrolls(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE NOT NULL,
    check_out TIMESTAMP WITH TIME ZONE,
    work_duration DECIMAL(5,2),  -- Durasi kerja dalam jam
    status VARCHAR(30) NOT NULL DEFAULT 'present',  -- present, absent, leave, business_trip, holiday
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Membuat fungsi untuk menghasilkan nomor jurnal otomatis
CREATE OR REPLACE FUNCTION generate_journal_number()
RETURNS VARCHAR AS $$
DECLARE
    new_number VARCHAR(50);
    current_date_str VARCHAR(8);
BEGIN
    current_date_str := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Ambil jumlah jurnal hari ini untuk membuat urutan
    SELECT 
        CASE 
            WHEN COUNT(*) = 0 THEN '001' 
            ELSE LPAD(CAST(MAX(SUBSTRING(journal_number, LENGTH(journal_number) - 2, 3)) AS INTEGER) + 1, 3, '0')
        END
    INTO new_number
    FROM journals 
    WHERE SUBSTRING(journal_number FROM POSITION('-' IN REVERSE(journal_number)) + 1 FOR 8) = current_date_str;
    
    new_number := 'JU-' || current_date_str || '-' || new_number;
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Membuat trigger untuk update kolom updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Menerapkan trigger ke tabel-tabel yang relevan
CREATE TRIGGER update_hospital_profile_updated_at 
    BEFORE UPDATE ON hospital_profile 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at 
    BEFORE UPDATE ON patients 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at 
    BEFORE UPDATE ON departments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at 
    BEFORE UPDATE ON visits 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_display_configs_updated_at 
    BEFORE UPDATE ON smart_display_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_smart_display_devices_updated_at 
    BEFORE UPDATE ON smart_display_devices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounts_updated_at 
    BEFORE UPDATE ON accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at 
    BEFORE UPDATE ON journals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_lines_updated_at 
    BEFORE UPDATE ON journal_lines 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_flow_categories_updated_at 
    BEFORE UPDATE ON cash_flow_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_flow_items_updated_at 
    BEFORE UPDATE ON cash_flow_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_revenue_expense_items_updated_at 
    BEFORE UPDATE ON revenue_expense_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_items_updated_at 
    BEFORE UPDATE ON cash_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_ratios_updated_at 
    BEFORE UPDATE ON financial_ratios 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ambulances_updated_at 
    BEFORE UPDATE ON ambulances 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ambulance_drivers_updated_at 
    BEFORE UPDATE ON ambulance_drivers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ambulance_trips_updated_at 
    BEFORE UPDATE ON ambulance_trips 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_templates_updated_at 
    BEFORE UPDATE ON form_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_fields_updated_at 
    BEFORE UPDATE ON form_fields 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at 
    BEFORE UPDATE ON form_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_electronic_signature_configs_updated_at 
    BEFORE UPDATE ON electronic_signature_configs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at 
    BEFORE UPDATE ON leave_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payrolls_updated_at 
    BEFORE UPDATE ON payrolls 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_components_updated_at 
    BEFORE UPDATE ON payroll_components 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at 
    BEFORE UPDATE ON attendances 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indeks untuk performa
CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
CREATE INDEX IF NOT EXISTS idx_queue_tickets_status ON queue_tickets(status);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_department_id ON visits(department_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_journals_date ON journals(journal_date);
CREATE INDEX IF NOT EXISTS idx_journals_posted ON journals(posted);
CREATE INDEX IF NOT EXISTS idx_journal_lines_journal_id ON journal_lines(journal_id);
CREATE INDEX IF NOT EXISTS idx_revenue_expense_items_period ON revenue_expense_items(period);
CREATE INDEX IF NOT EXISTS idx_cash_items_period ON cash_items(period);
CREATE INDEX IF NOT EXISTS idx_financial_ratios_period ON financial_ratios(period);
CREATE INDEX IF NOT EXISTS idx_ambulances_vehicle_number ON ambulances(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_ambulance_trips_date ON ambulance_trips(trip_date);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_patient_id ON form_submissions(patient_id);
CREATE INDEX IF NOT EXISTS idx_hospital_profile_enable_bsre_signature ON hospital_profile(enable_bsre_signature);
CREATE INDEX IF NOT EXISTS idx_employees_employee_number ON employees(employee_number);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payrolls_period ON payrolls(period);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON attendances(date);
CREATE INDEX IF NOT EXISTS idx_attendances_employee_id ON attendances(employee_id);