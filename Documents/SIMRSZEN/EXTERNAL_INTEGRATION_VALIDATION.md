# Validasi Integrasi Eksternal SIMRS ZEN

## Tujuan
Dokumen ini menjelaskan proses validasi dan pengujian untuk integrasi eksternal SIMRS ZEN, khususnya integrasi dengan BPJS dan Satu Sehat.

## 1. Validasi Integrasi BPJS

### 1.1. Konfigurasi BPJS
Sebelum melakukan validasi, pastikan konfigurasi BPJS telah disiapkan:

- Consumer ID
- Consumer Secret
- Username
- Password
- User Key
- Base URL
- Service Name

### 1.2. Endpoint yang Divalidasi

#### 1.2.1. Autentikasi
- **Endpoint**: `/api/bpjs/auth/get-token`
- **Metode**: POST
- **Deskripsi**: Mendapatkan token akses untuk komunikasi dengan API BPJS
- **Parameter**: consumerId, consumerSecret, userName, userPassword
- **Respons Sukses**:
```json
{
  "response": {
    "token": "string",
    "expires_in": "string"
  }
}
```

#### 1.2.2. Pencarian Pasien
- **Endpoint**: `/api/bpjs/pcare/peserta/{noKartu}`
- **Metode**: GET
- **Deskripsi**: Mendapatkan data pasien dari sistem BPJS berdasarkan nomor kartu
- **Parameter**: noKartu
- **Respons Sukses**:
```json
{
  "metaData": {
    "code": "string",
    "message": "string"
  },
  "response": {
    "peserta": {
      "noKartu": "string",
      "nama": "string",
      "pisa": "string",
      "prolanisPRB": "string",
      "tglCetakKartu": "string",
      "tglLahir": "string",
      "jenisKelamin": "string",
      "ketStatusPeserta": "string",
      "kdJenisPeserta": "string",
      "nmJenisPeserta": "string",
      "kdKelas": "string",
      "nmKelas": "string",
      "kdPpkRujukan": "string",
      "nmPpkRujukan": "string",
      "alamat": "string",
      "noTelepon": "string",
      "email": "string",
      "pekerjaan": "string",
      "kdPekerjaan": "string",
      "nmPekerjaan": "string",
      "keterangan": "string",
      "kdCabang": "string",
      "nmCabang": "string",
      "kdUnit": "string",
      "nmUnit": "string",
      "nmPenjamin": "string",
      "tglTat": "string",
      "tglPulang": "string",
      "flagTat": "string",
      "flagPulang": "string",
      "kdWp": "string",
      "nmWp": "string",
      "noMr": "string",
      "nik": "string",
      "statusRekamMedis": "string",
      "jenisBy": "string",
      "kdJenisBy": "string",
      "nmJenisBy": "string",
      "informasi": {
        "dinsos": "string",
        "prolanisPRB": "string",
        "noSKTM": "string"
      },
      "hakKelas": {
        "keterangan": "string",
        "kdHakKelas": "string",
        "nmHakKelas": "string"
      },
      "penjamin": [
        {
          "kdPenjamin": "string",
          "nmPenjamin": "string"
        }
      ],
      "provinsi": {
        "kdProvinsi": "string",
        "nmProvinsi": "string"
      },
      "kabupaten": {
        "kdKabupaten": "string",
        "nmKabupaten": "string"
      },
      "kecamatan": {
        "kdKecamatan": "string",
        "nmKecamatan": "string"
      },
      "desa": {
        "kdDesa": "string",
        "nmDesa": "string",
        "kdPos": "string"
      },
      "ketTkk": {
        "kdKetTkk": "string",
        "nmKetTkk": "string"
      },
      "cob": {
        "kdCob": "string",
        "nmCob": "string"
      },
      "dokter": {
        "kdDokter": "string",
        "nmDokter": "string"
      },
      "spesialis": {
        "kdSpesialis": "string",
        "nmSpesialis": "string",
        "kdSubSpesialis": "string",
        "nmSubSpesialis": "string",
        "kdSarana": "string",
        "nmSarana": "string"
      },
      "gigi": {
        "kdGigi": "string",
        "nmGigi": "string"
      },
      "bed": {
        "kelas1": {
          "tersedia": "string",
          "terpakai": "string"
        },
        "kelas2": {
          "tersedia": "string",
          "terpakai": "string"
        },
        "kelas3": {
          "tersedia": "string",
          "terpakai": "string"
        },
        "vip": {
          "tersedia": "string",
          "terpakai": "string"
        },
        "vvip": {
          "tersedia": "string",
          "terpakai": "string"
        }
      },
      "rujukan": {
        "asalRujukan": {
          "kdAsalRujukan": "string",
          "nmAsalRujukan": "string"
        },
        "tglRujukan": "string",
        "noRujukan": "string",
        "ppkRujukan": {
          "kdPpkRujukan": "string",
          "nmPpkRujukan": "string"
        }
      }
    }
  }
}
```

#### 1.2.3. Pendaftaran Antrean
- **Endpoint**: `/api/bpjs/antrean/add`
- **Metode**: POST
- **Deskripsi**: Mendaftarkan antrean pasien BPJS ke sistem antrian online
- **Parameter**: kodebooking, jenispasien, nomorkartu, nik, nohp, kodepoli, namapoli, pasienbaru, norm, tanggalperiksa, kodedokter, namadokter, jampraktek, jeniskunjungan, nomorreferensi, nomorantrean, angkaantrean, estimasidilayani, sisakuotajkn, kuotajkn, keterangan
- **Respons Sukses**:
```json
{
  "metadata": {
    "code": "string",
    "message": "string"
  },
  "response": {
    "nomorantrean": "string",
    "keterangan": "string"
  }
}
```

### 1.3. Prosedur Validasi

#### 1.3.1. Pengujian Fungsional
1. Uji koneksi ke server BPJS
2. Uji autentikasi dengan kredensial yang valid
3. Uji pencarian data pasien dengan nomor kartu valid
4. Uji pendaftaran antrean online
5. Uji sinkronisasi data

#### 1.3.2. Pengujian Non-Fungsional
1. Uji performa dengan beban tinggi
2. Uji keamanan komunikasi
3. Uji toleransi kesalahan
4. Uji logging dan monitoring

### 1.4. Checklist Validasi BPJS
- [ ] Autentikasi berhasil
- [ ] Pencarian data pasien berhasil
- [ ] Pendaftaran antrean berhasil
- [ ] Sinkronisasi data berjalan lancar
- [ ] Error handling bekerja dengan baik
- [ ] Logging dan monitoring aktif
- [ ] Performa sesuai spesifikasi

## 2. Validasi Integrasi Satu Sehat

### 2.1. Konfigurasi Satu Sehat
Pastikan konfigurasi Satu Sehat telah disiapkan:

- Client ID
- Client Secret
- Base URL
- Organization ID
- Authorization URL

### 2.2. Endpoint yang Divalidasi

#### 2.2.1. Autentikasi
- **Endpoint**: `/oauth2/token`
- **Metode**: POST
- **Deskripsi**: Mendapatkan token akses untuk komunikasi dengan API Satu Sehat
- **Parameter**: client_id, client_secret, grant_type
- **Respons Sukses**:
```json
{
  "access_token": "string",
  "token_type": "string",
  "expires_in": "number",
  "refresh_token": "string"
}
```

#### 2.2.2. Registrasi Pasien
- **Endpoint**: `/fhir-r4/Bundle`
- **Metode**: POST
- **Deskripsi**: Mengirimkan data pasien ke sistem Satu Sehat
- **Payload**:
```json
{
  "resourceType": "Bundle",
  "type": "transaction",
  "entry": [
    {
      "fullUrl": "urn:uuid:example-patient-id",
      "resource": {
        "resourceType": "Patient",
        "id": "example-patient-id",
        "identifier": [
          {
            "system": "http://sys-ids.kemkes.go.id/patient",
            "value": "string"
          }
        ],
        "name": [
          {
            "use": "official",
            "family": "string",
            "given": ["string"]
          }
        ],
        "gender": "male|female|other|unknown",
        "birthDate": "date",
        "address": [
          {
            "use": "home",
            "text": "string"
          }
        ]
      },
      "request": {
        "method": "POST",
        "url": "Patient"
      }
    }
  ]
}
```

#### 2.2.3. Registrasi Tenaga Kesehatan
- **Endpoint**: `/fhir-r4/Practitioner`
- **Metode**: POST
- **Deskripsi**: Mengirimkan data tenaga kesehatan ke sistem Satu Sehat
- **Payload**:
```json
{
  "resourceType": "Practitioner",
  "identifier": [
    {
      "system": "http://sys-ids.kemkes.go.id/practitioner",
      "value": "string"
    }
  ],
  "name": [
    {
      "use": "official",
      "family": "string",
      "given": ["string"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "string"
    }
  ],
  "gender": "male|female|other|unknown",
  "birthDate": "date"
}
```

#### 2.2.4. Kirim Data Kunjungan
- **Endpoint**: `/fhir-r4/Encounter`
- **Metode**: POST
- **Deskripsi**: Mengirimkan data kunjungan pasien ke sistem Satu Sehat
- **Payload**:
```json
{
  "resourceType": "Encounter",
  "status": "finished",
  "class": {
    "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
    "code": "AMB",
    "display": "Ambulatory"
  },
  "subject": {
    "reference": "Patient/example-patient-id"
  },
  "participant": [
    {
      "individual": {
        "reference": "Practitioner/example-practitioner-id"
      }
    }
  ],
  "period": {
    "start": "dateTime",
    "end": "dateTime"
  }
}
```

### 2.3. Prosedur Validasi

#### 2.3.1. Pengujian Fungsional
1. Uji koneksi ke server Satu Sehat
2. Uji autentikasi dengan kredensial valid
3. Uji registrasi pasien
4. Uji registrasi tenaga kesehatan
5. Uji pengiriman data kunjungan
6. Uji sinkronisasi data

#### 2.3.2. Pengujian Non-Fungsional
1. Uji performa dengan beban tinggi
2. Uji keamanan komunikasi
3. Uji toleransi kesalahan
4. Uji logging dan monitoring

### 2.4. Checklist Validasi Satu Sehat
- [ ] Autentikasi berhasil
- [ ] Registrasi pasien berhasil
- [ ] Registrasi tenaga kesehatan berhasil
- [ ] Pengiriman data kunjungan berhasil
- [ ] Sinkronisasi data berjalan lancar
- [ ] Error handling bekerja dengan baik
- [ ] Logging dan monitoring aktif
- [ ] Performa sesuai spesifikasi

## 3. Validasi Keseluruhan

### 3.1. Jadwal Validasi
- Validasi awal: Sebelum deployment produksi
- Validasi berkala: Bulanan
- Validasi pasca-update: Setiap update besar

### 3.2. Dokumentasi Validasi
Setiap sesi validasi harus didokumentasikan dengan:
- Tanggal pelaksanaan
- Nama pelaksana
- Hasil uji
- Masalah yang ditemukan
- Tindakan perbaikan
- Status validasi

### 3.3. Monitoring dan Alerting
- Gunakan sistem monitoring untuk melacak status integrasi
- Siapkan alerting untuk kegagalan komunikasi
- Lacak metrik kinerja integrasi
- Buat laporan berkala tentang kesehatan integrasi

## 4. Penanganan Error dan Troubleshooting

### 4.1. Kategori Error Umum
- Error autentikasi
- Error jaringan
- Error format data
- Error kuota

### 4.2. Prosedur Troubleshooting
1. Cek log error secara detail
2. Validasi kembali konfigurasi
3. Uji koneksi ke server eksternal
4. Cek format data yang dikirim
5. Hubungi pihak eksternal jika diperlukan

### 4.3. Recovery Prosedur
1. Identifikasi penyebab kegagalan
2. Lakukan perbaikan
3. Uji kembali integrasi
4. Resume proses yang tertunda
5. Validasi ulang data yang terpengaruh