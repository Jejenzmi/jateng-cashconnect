// Utilitas validasi form untuk SIMRS ZEN

// Validasi NIK (Nomor Induk Kependudukan)
export const validateNIK = (nik: string): boolean => {
  if (!nik || nik.length !== 16 || isNaN(Number(nik))) {
    return false;
  }

  // Validasi format dasar NIK
  const yearOfBirth = parseInt(nik.substring(6, 8), 10);
  const currentYear = new Date().getFullYear() % 100;
  
  // Memastikan tahun lahir masuk akal
  if (yearOfBirth > currentYear + 20) {
    return false;
  }

  return true;
};

// Validasi nomor HP
export const validatePhone = (phone: string): boolean => {
  if (!phone) return false;
  
  // Format nomor HP Indonesia
  const phoneRegex = /^(^\+62|^[1-9])(\d){8,13}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validasi email
export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validasi tanggal lahir
export const validateBirthDate = (dateStr: string): boolean => {
  if (!dateStr) return false;
  
  const date = new Date(dateStr);
  const today = new Date();
  const minDate = new Date();
  
  // Tanggal lahir tidak boleh setelah hari ini
  if (date > today) {
    return false;
  }
  
  // Tanggal lahir tidak boleh lebih awal dari 150 tahun yang lalu
  minDate.setFullYear(today.getFullYear() - 150);
  if (date < minDate) {
    return false;
  }
  
  return true;
};

// Validasi BPJS Number
export const validateBPJSNumber = (bpjsNumber: string): boolean => {
  if (!bpjsNumber) return false;
  
  // Nomor BPJS harus 13 digit angka
  const bpjsRegex = /^\d{13}$/;
  return bpjsRegex.test(bpjsNumber);
};

// Validasi harga/angka
export const validatePrice = (price: string): boolean => {
  if (!price) return false;
  
  const num = parseFloat(price);
  return !isNaN(num) && num >= 0;
};

// Validator umum
export const validators = {
  nik: validateNIK,
  phone: validatePhone,
  email: validateEmail,
  birthDate: validateBirthDate,
  bpjsNumber: validateBPJSNumber,
  price: validatePrice,
};