# Dokumentasi API SIMRS ZEN

## API Patients
Base URL: `http://localhost:3001/api/patients`

### Get All Patients
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pasien",
    "data": [
      {
        "id": "string",
        "nik": "string",
        "medicalRecordNumber": "string",
        "name": "string",
        "dateOfBirth": "datetime",
        "gender": "string",
        "bloodType": "string",
        "bpjsNumber": "string",
        "phone": "string",
        "address": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Patient by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (patient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pasien",
    "data": {
      "id": "string",
      "nik": "string",
      "medicalRecordNumber": "string",
      "name": "string",
      "dateOfBirth": "datetime",
      "gender": "string",
      "bloodType": "string",
      "bpjsNumber": "string",
      "phone": "string",
      "address": "string",
      "occupation": "string",
      "maritalStatus": "string",
      "religion": "string",
      "emergencyContactName": "string",
      "emergencyContactPhone": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Patient
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "nik": "string",
    "name": "string",
    "dateOfBirth": "string",
    "gender": "L|P",
    "bloodType": "string",
    "bpjsNumber": "string",
    "phone": "string",
    "address": "string",
    "occupation": "string",
    "maritalStatus": "string",
    "religion": "string",
    "emergencyContactName": "string",
    "emergencyContactPhone": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data pasien yang baru dibuat

### Update Patient
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (patient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body: Sama seperti create patient
- Response: Sama seperti GET, tetapi dengan data pasien yang diperbarui

### Delete Patient
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (patient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data pasien"
  }
  ```

## API Doctors
Base URL: `http://localhost:3001/api/doctors`

### Get All Doctors
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data dokter",
    "data": [
      {
        "id": "string",
        "nip": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string",
        "address": "string",
        "licenseNumber": "string",
        "employmentDate": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Doctor by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (doctor ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data dokter",
    "data": {
      "id": "string",
      "nip": "string",
      "fullName": "string",
      "specialization": "string",
      "phone": "string",
      "email": "string",
      "address": "string",
      "licenseNumber": "string",
      "employmentDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Doctor
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "nip": "string",
    "fullName": "string",
    "specialization": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "licenseNumber": "string",
    "employmentDate": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data dokter yang baru dibuat

### Update Doctor
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (doctor ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body: Sama seperti create doctor
- Response: Sama seperti GET, tetapi dengan data dokter yang diperbarui

### Delete Doctor
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (doctor ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data dokter"
  }
  ```

## API Medicines
Base URL: `http://localhost:3001/api/medicines`

### Get All Medicines
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data obat",
    "data": [
      {
        "id": "string",
        "name": "string",
        "genericName": "string",
        "dosageForm": "string",
        "strength": "string",
        "manufacturer": "string",
        "price": "number",
        "stock": "number",
        "unit": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Medicine by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (medicine ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data obat",
    "data": {
      "id": "string",
      "name": "string",
      "genericName": "string",
      "dosageForm": "string",
      "strength": "string",
      "manufacturer": "string",
      "price": "number",
      "stock": "number",
      "unit": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Medicine
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Body:
  ```json
  {
    "name": "string",
    "genericName": "string",
    "dosageForm": "string",
    "strength": "string",
    "manufacturer": "string",
    "price": "number",
    "stock": "number",
    "unit": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data obat yang baru dibuat

### Update Medicine
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (medicine ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Body: Sama seperti create medicine
- Response: Sama seperti GET, tetapi dengan data obat yang diperbarui

### Delete Medicine
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (medicine ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data obat"
  }
  ```

## API Rooms
Base URL: `http://localhost:3001/api/rooms`

### Get All Rooms
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data ruangan",
    "data": [
      {
        "id": "string",
        "name": "string",
        "type": "string",
        "floor": "number",
        "capacity": "number",
        "available": "number",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Room by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (room ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data ruangan",
    "data": {
      "id": "string",
      "name": "string",
      "type": "string",
      "floor": "number",
      "capacity": "number",
      "available": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Room
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body:
  ```json
  {
    "name": "string",
    "type": "string",
    "floor": "number",
    "capacity": "number"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data ruangan yang baru dibuat

### Update Room
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (room ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body: Sama seperti create room
- Response: Sama seperti GET, tetapi dengan data ruangan yang diperbarui

### Delete Room
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (room ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data ruangan"
  }
  ```

## API Laboratory Tests
Base URL: `http://localhost:3001/api/laboratory-tests`

### Get All Laboratory Tests
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tes laboratorium",
    "data": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "group": "string",
        "description": "string",
        "price": "number",
        "normalValues": "string",
        "sampleType": "string",
        "preparation": "string",
        "processingTime": "number",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Laboratory Test by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (laboratory test ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tes laboratorium",
    "data": {
      "id": "string",
      "name": "string",
      "code": "string",
      "group": "string",
      "description": "string",
      "price": "number",
      "normalValues": "string",
      "sampleType": "string",
      "preparation": "string",
      "processingTime": "number",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Laboratory Test
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Body:
  ```json
  {
    "name": "string",
    "code": "string",
    "group": "string",
    "description": "string",
    "price": "number",
    "normalValues": "string",
    "sampleType": "string",
    "preparation": "string",
    "processingTime": "number",
    "isActive": "boolean"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tes laboratorium yang baru dibuat

### Update Laboratory Test
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (laboratory test ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Body: Sama seperti create laboratory test
- Response: Sama seperti GET, tetapi dengan data tes laboratorium yang diperbarui

### Delete Laboratory Test
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (laboratory test ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data tes laboratorium"
  }
  ```

## API Schedules
Base URL: `http://localhost:3001/api/schedules`

### Get All Schedules
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data jadwal dokter",
    "data": [
      {
        "id": "string",
        "doctorId": "string",
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "dayOfWeek": "string",
        "startTime": "string",
        "endTime": "string",
        "maxVisits": "number",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Schedule by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (schedule ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data jadwal dokter",
    "data": {
      "id": "string",
      "doctorId": "string",
      "doctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string"
      },
      "dayOfWeek": "string",
      "startTime": "string",
      "endTime": "string",
      "maxVisits": "number",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "appointments": [
        {
          "id": "string",
          "appointmentDate": "datetime",
          "status": "string"
        }
      ]
    }
  }
  ```

### Create Schedule
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body:
  ```json
  {
    "doctorId": "string",
    "dayOfWeek": "string",
    "startTime": "string",
    "endTime": "string",
    "maxVisits": "number",
    "isActive": "boolean"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data jadwal dokter yang baru dibuat

### Update Schedule
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (schedule ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body: Sama seperti create schedule
- Response: Sama seperti GET, tetapi dengan data jadwal dokter yang diperbarui

### Delete Schedule
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (schedule ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data jadwal dokter"
  }
  ```

## API Radiology Exams
Base URL: `http://localhost:3001/api/radiology-exams`

### Get All Radiology Exams
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pemeriksaan radiologi",
    "data": [
      {
        "id": "string",
        "name": "string",
        "code": "string",
        "category": "string",
        "description": "string",
        "price": "number",
        "preparation": "string",
        "contraindications": "string",
        "isActive": "boolean",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Radiology Exam by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (radiology exam ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pemeriksaan radiologi",
    "data": {
      "id": "string",
      "name": "string",
      "code": "string",
      "category": "string",
      "description": "string",
      "price": "number",
      "preparation": "string",
      "contraindications": "string",
      "isActive": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Radiology Exam
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Body:
  ```json
  {
    "name": "string",
    "code": "string",
    "category": "string",
    "description": "string",
    "price": "number",
    "preparation": "string",
    "contraindications": "string",
    "isActive": "boolean"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data pemeriksaan radiologi yang baru dibuat

### Update Radiology Exam
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (radiology exam ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Body: Sama seperti create radiology exam
- Response: Sama seperti GET, tetapi dengan data pemeriksaan radiologi yang diperbarui

### Delete Radiology Exam
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (radiology exam ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data pemeriksaan radiologi"
  }
  ```

## API Appointments
Base URL: `http://localhost:3001/api/appointments`

### Get All Appointments
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data janji temu pasien",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "nik": "string"
        },
        "doctorId": "string",
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "scheduleId": "string",
        "schedule": {
          "id": "string",
          "dayOfWeek": "string",
          "startTime": "string",
          "endTime": "string"
        },
        "appointmentDate": "datetime",
        "reason": "string",
        "priority": "string",
        "status": "string",
        "cancellationReason": "string",
        "confirmedAt": "datetime",
        "completedAt": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Appointment by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (appointment ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data janji temu pasien",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "nik": "string",
        "phone": "string",
        "address": "string"
      },
      "doctorId": "string",
      "doctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string"
      },
      "scheduleId": "string",
      "schedule": {
        "id": "string",
        "dayOfWeek": "string",
        "startTime": "string",
        "endTime": "string"
      },
      "appointmentDate": "datetime",
      "reason": "string",
      "priority": "string",
      "status": "string",
      "cancellationReason": "string",
      "confirmedAt": "datetime",
      "completedAt": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Appointment
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "scheduleId": "string",
    "appointmentDate": "datetime",
    "reason": "string",
    "priority": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data janji temu yang baru dibuat

### Update Appointment
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (appointment ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body: Sama seperti create appointment
- Response: Sama seperti GET, tetapi dengan data janji temu yang diperbarui

### Delete Appointment
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (appointment ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data janji temu pasien"
  }
  ```

### Update Appointment Status
- Method: `PATCH`
- Endpoint: `/id/status`
- Params: `id` (appointment ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "status": "string",
    "cancellationReason": "string" // hanya untuk status 'cancelled'
  }
  ```
- Response: Sama seperti GET, tetapi dengan data janji temu yang statusnya telah diperbarui

## API Billing
Base URL: `http://localhost:3001/api/billing`

### Get All Bills
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tagihan",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "nik": "string",
          "medicalRecordNumber": "string"
        },
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "items": [
          {
            "id": "string",
            "itemName": "string",
            "quantity": "number",
            "unitPrice": "number",
            "totalPrice": "number",
            "notes": "string"
          }
        ],
        "totalAmount": "number",
        "discountPercent": "number",
        "discountAmount": "number",
        "finalAmount": "number",
        "paymentStatus": "string",
        "paymentMethod": "string",
        "paidAt": "datetime",
        "notes": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Bill by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tagihan",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "nik": "string",
        "medicalRecordNumber": "string"
      },
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string"
      },
      "items": [
        {
          "id": "string",
          "itemName": "string",
          "quantity": "number",
          "unitPrice": "number",
          "totalPrice": "number",
          "notes": "string"
        }
      ],
      "totalAmount": "number",
      "discountPercent": "number",
      "discountAmount": "number",
      "finalAmount": "number",
      "paymentStatus": "string",
      "paymentMethod": "string",
      "paidAt": "datetime",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Bill
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "visitId": "string",
    "items": [
      {
        "itemName": "string",
        "quantity": "number",
        "unitPrice": "number",
        "totalPrice": "number",
        "notes": "string"
      }
    ],
    "discountPercent": "number",
    "discountAmount": "number",
    "notes": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tagihan yang baru dibuat

### Update Bill
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body: Sama seperti create bill
- Response: Sama seperti GET, tetapi dengan data tagihan yang diperbarui

### Delete Bill
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data tagihan"
  }
  ```

### Update Payment Status
- Method: `PATCH`
- Endpoint: `/id/payment-status`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body:
  ```json
  {
    "paymentStatus": "string",
    "paymentMethod": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tagihan yang status pembayarannya telah diperbarui

## API Bills (Tagihan Utama)
Base URL: `http://localhost:3001/api/bills`

### Get All Bills
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tagihan utama",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string"
        },
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "items": [
          {
            "id": "string",
            "itemName": "string",
            "quantity": "number",
            "unitPrice": "number",
            "totalPrice": "number",
            "notes": "string"
          }
        ],
        "totalAmount": "number",
        "discountPercent": "number",
        "discountAmount": "number",
        "finalAmount": "number",
        "paymentStatus": "string",
        "paymentMethod": "string",
        "notes": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Bill by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tagihan utama",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "medicalRecordNumber": "string",
        "nik": "string",
        "phone": "string",
        "address": "string"
      },
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string"
      },
      "items": [
        {
          "id": "string",
          "itemName": "string",
          "quantity": "number",
          "unitPrice": "number",
          "totalPrice": "number",
          "notes": "string"
        }
      ],
      "totalAmount": "number",
      "discountPercent": "number",
      "discountAmount": "number",
      "finalAmount": "number",
      "paymentStatus": "string",
      "paymentMethod": "string",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Bill
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "visitId": "string",
    "discountPercent": "number",
    "discountAmount": "number",
    "paymentStatus": "string",
    "paymentMethod": "string",
    "notes": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tagihan utama yang baru dibuat

### Update Bill
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body: Sama seperti create bill
- Response: Sama seperti GET, tetapi dengan data tagihan utama yang diperbarui

### Delete Bill
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (bill ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data tagihan utama"
  }
  ```

## API Departments
Base URL: `http://localhost:3001/api/departments`

### Get All Departments
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data departemen",
    "data": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "headId": "string",
        "head": {
          "id": "string",
          "fullName": "string",
          "role": "string"
        },
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Department by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (department ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data departemen",
    "data": {
      "id": "string",
      "name": "string",
      "description": "string",
      "headId": "string",
      "head": {
        "id": "string",
        "fullName": "string",
        "role": "string"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Department
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN`
- Body:
  ```json
  {
    "name": "string",
    "description": "string",
    "headId": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data departemen yang baru dibuat

### Update Department
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (department ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN`
- Body: Sama seperti create department
- Response: Sama seperti GET, tetapi dengan data departemen yang diperbarui

### Delete Department
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (department ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data departemen"
  }
  ```

## API Prescriptions
Base URL: `http://localhost:3001/api/prescriptions`

### Get All Prescriptions
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data resep obat",
    "data": [
      {
        "id": "string",
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string",
          "patient": {
            "id": "string",
            "name": "string",
            "medicalRecordNumber": "string"
          }
        },
        "items": [
          {
            "id": "string",
            "medicineId": "string",
            "medicine": {
              "id": "string",
              "name": "string",
              "price": "number"
            },
            "quantity": "number",
            "dosage": "string",
            "frequency": "string",
            "duration": "number",
            "notes": "string"
          }
        ],
        "notes": "string",
        "status": "string",
        "issuedAt": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Prescription by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (prescription ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data resep obat",
    "data": {
      "id": "string",
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string"
        }
      },
      "items": [
        {
          "id": "string",
          "medicineId": "string",
          "medicine": {
            "id": "string",
            "name": "string",
            "price": "number"
          },
          "quantity": "number",
          "dosage": "string",
          "frequency": "string",
          "duration": "number",
          "notes": "string"
        }
      ],
      "notes": "string",
      "status": "string",
      "issuedAt": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Prescription
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "visitId": "string",
    "items": [
      {
        "medicineId": "string",
        "quantity": "number",
        "dosage": "string",
        "frequency": "string",
        "duration": "number",
        "notes": "string"
      }
    ],
    "notes": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data resep yang baru dibuat

### Update Prescription
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (prescription ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body: Sama seperti create prescription
- Response: Sama seperti GET, tetapi dengan data resep yang diperbarui

### Delete Prescription
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (prescription ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data resep obat"
  }
  ```

### Update Prescription Status
- Method: `PATCH`
- Endpoint: `/id/status`
- Params: `id` (prescription ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `PHARMACY_STAFF`
- Body:
  ```json
  {
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data resep yang statusnya telah diperbarui

## API Visits
Base URL: `http://localhost:3001/api/visits`

### Get All Visits
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data kunjungan pasien",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "nik": "string",
          "medicalRecordNumber": "string"
        },
        "doctorId": "string",
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "roomId": "string",
        "room": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "visitNumber": "string",
        "visitDate": "datetime",
        "chiefComplaint": "string",
        "diagnosis": "string",
        "notes": "string",
        "status": "string",
        "startedAt": "datetime",
        "completedAt": "datetime",
        "cancelledAt": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Visit by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (visit ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data kunjungan pasien",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "nik": "string",
        "medicalRecordNumber": "string",
        "phone": "string",
        "address": "string"
      },
      "doctorId": "string",
      "doctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string"
      },
      "roomId": "string",
      "room": {
        "id": "string",
        "name": "string",
        "type": "string"
      },
      "visitNumber": "string",
      "visitDate": "datetime",
      "chiefComplaint": "string",
      "diagnosis": "string",
      "notes": "string",
      "status": "string",
      "startedAt": "datetime",
      "completedAt": "datetime",
      "cancelledAt": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "prescriptions": [
        {
          "id": "string",
          "items": [
            {
              "id": "string",
              "medicine": {
                "id": "string",
                "name": "string"
              },
              "quantity": "number",
              "dosage": "string",
              "frequency": "string",
              "duration": "number",
              "notes": "string"
            }
          ]
        }
      ],
      "laboratoryOrders": [],
      "radiologyOrders": []
    }
  }
  ```

### Create Visit
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "roomId": "string",
    "visitDate": "datetime",
    "chiefComplaint": "string",
    "diagnosis": "string",
    "notes": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data kunjungan yang baru dibuat

### Update Visit
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (visit ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body: Sama seperti create visit
- Response: Sama seperti GET, tetapi dengan data kunjungan yang diperbarui

### Delete Visit
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (visit ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data kunjungan pasien"
  }
  ```

### Update Visit Status
- Method: `PATCH`
- Endpoint: `/id/status`
- Params: `id` (visit ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data kunjungan yang statusnya telah diperbarui

## API Inpatients
Base URL: `http://localhost:3001/api/inpatients`

### Get All Inpatients
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data rawat inap",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "nik": "string",
          "medicalRecordNumber": "string"
        },
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string",
          "chiefComplaint": "string"
        },
        "roomId": "string",
        "room": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "bedId": "string",
        "bed": {
          "id": "string",
          "name": "string",
          "roomNumber": "string"
        },
        "attendingDoctorId": "string",
        "attendingDoctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "admissionDate": "datetime",
        "admissionReason": "string",
        "dischargeDate": "datetime",
        "notes": "string",
        "status": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Inpatient by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (inpatient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data rawat inap",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "nik": "string",
        "medicalRecordNumber": "string",
        "phone": "string",
        "address": "string"
      },
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string",
        "chiefComplaint": "string"
      },
      "roomId": "string",
      "room": {
        "id": "string",
        "name": "string",
        "type": "string"
      },
      "bedId": "string",
      "bed": {
        "id": "string",
        "name": "string",
        "roomNumber": "string"
      },
      "attendingDoctorId": "string",
      "attendingDoctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string"
      },
      "admissionDate": "datetime",
      "admissionReason": "string",
      "dischargeDate": "datetime",
      "notes": "string",
      "status": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Inpatient
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "visitId": "string",
    "roomId": "string",
    "bedId": "string",
    "attendingDoctorId": "string",
    "admissionDate": "datetime",
    "admissionReason": "string",
    "notes": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data rawat inap yang baru dibuat

### Update Inpatient
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (inpatient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Body: Sama seperti create inpatient
- Response: Sama seperti GET, tetapi dengan data rawat inap yang diperbarui

### Delete Inpatient
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (inpatient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `REGISTRATION_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data rawat inap"
  }
  ```

### Transfer Patient
- Method: `PATCH`
- Endpoint: `/id/transfer`
- Params: `id` (inpatient ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `REGISTRATION_STAFF`
- Body:
  ```json
  {
    "roomId": "string",
    "bedId": "string",
    "reason": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data rawat inap yang telah dipindahkan

## API Beds
Base URL: `http://localhost:3001/api/beds`

### Get All Beds
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tempat tidur",
    "data": [
      {
        "id": "string",
        "name": "string",
        "roomNumber": "string",
        "roomId": "string",
        "room": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "status": "string",
        "description": "string",
        "inpatients": [
          {
            "id": "string",
            "patient": {
              "id": "string",
              "name": "string"
            }
          }
        ],
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Bed by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (bed ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data tempat tidur",
    "data": {
      "id": "string",
      "name": "string",
      "roomNumber": "string",
      "roomId": "string",
      "room": {
          "id": "string",
          "name": "string",
          "type": "string"
        },
        "status": "string",
        "description": "string",
        "inpatients": [
          {
            "id": "string",
            "patient": {
              "id": "string",
              "name": "string"
            }
          }
        ],
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    }
  ```

### Create Bed
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body:
  ```json
  {
    "name": "string",
    "roomNumber": "string",
    "roomId": "string",
    "status": "string",
    "description": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tempat tidur yang baru dibuat

### Update Bed
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (bed ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Body: Sama seperti create bed
- Response: Sama seperti GET, tetapi dengan data tempat tidur yang diperbarui

### Delete Bed
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (bed ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data tempat tidur"
  }
  ```

### Update Bed Status
- Method: `PATCH`
- Endpoint: `/id/status`
- Params: `id` (bed ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `ADMINISTRATIVE_STAFF` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "status": "string" // "available", "occupied", "maintenance"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data tempat tidur yang statusnya telah diperbarui

## API Laboratory Orders
Base URL: `http://localhost:3001/api/laboratory-orders`

### Get All Laboratory Orders
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pesanan laboratorium",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string"
        },
        "doctorId": "string",
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "testId": "string",
        "test": {
          "id": "string",
          "name": "string",
          "code": "string"
        },
        "notes": "string",
        "priority": "string",
        "result": {
          "id": "string",
          "status": "string",
          "resultDate": "datetime"
        },
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Laboratory Order by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (laboratory order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pesanan laboratorium",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "medicalRecordNumber": "string",
        "nik": "string",
        "phone": "string",
        "address": "string"
      },
      "doctorId": "string",
      "doctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string"
      },
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string"
      },
      "testId": "string",
      "test": {
        "id": "string",
        "name": "string",
        "code": "string",
        "description": "string",
        "normalValues": "string",
        "sampleType": "string",
        "preparation": "string"
      },
      "notes": "string",
      "priority": "string",
      "result": {
        "id": "string",
        "result": "string",
        "notes": "string",
        "status": "string",
        "resultDate": "datetime"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Laboratory Order
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "visitId": "string",
    "testId": "string",
    "notes": "string",
    "priority": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data pesanan laboratorium yang baru dibuat

### Update Laboratory Order
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (laboratory order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body: Sama seperti create laboratory order
- Response: Sama seperti GET, tetapi dengan data pesanan laboratorium yang diperbarui

### Delete Laboratory Order
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (laboratory order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data pesanan laboratorium"
  }
  ```

## API Laboratory Results
Base URL: `http://localhost:3001/api/laboratory-results`

### Get All Laboratory Results
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data hasil laboratorium",
    "data": [
      {
        "id": "string",
        "orderId": "string",
        "order": {
          "id": "string",
          "patient": {
            "id": "string",
            "name": "string",
            "medicalRecordNumber": "string"
          },
          "doctor": {
            "id": "string",
            "fullName": "string",
            "specialization": "string"
          },
          "visit": {
            "id": "string",
            "visitNumber": "string"
          },
          "test": {
            "id": "string",
            "name": "string",
            "code": "string"
          }
        },
        "result": "string",
        "notes": "string",
        "status": "string",
        "resultDate": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Laboratory Result by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (laboratory result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data hasil laboratorium",
    "data": {
      "id": "string",
      "orderId": "string",
      "order": {
        "id": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string",
          "nik": "string",
          "phone": "string",
          "address": "string"
        },
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string",
          "phone": "string",
          "email": "string"
        },
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "test": {
          "id": "string",
          "name": "string",
          "code": "string",
          "description": "string",
          "normalValues": "string",
          "sampleType": "string",
          "preparation": "string"
        }
      },
      "result": "string",
      "notes": "string",
      "status": "string",
      "resultDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Laboratory Result
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Body:
  ```json
  {
    "orderId": "string",
    "result": "string",
    "notes": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data hasil laboratorium yang baru dibuat

### Update Laboratory Result
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (laboratory result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Body: Sama seperti create laboratory result
- Response: Sama seperti GET, tetapi dengan data hasil laboratorium yang diperbarui

### Delete Laboratory Result
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (laboratory result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data hasil laboratorium"
  }
  ```

### Verify Laboratory Result
- Method: `PATCH`
- Endpoint: `/id/verify`
- Params: `id` (laboratory result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `LABORATORY_STAFF`
- Response: Sama seperti GET, tetapi dengan status hasil laboratorium yang telah diperbarui menjadi 'verified'

## API Radiology Orders
Base URL: `http://localhost:3001/api/radiology-orders`

### Get All Radiology Orders
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pesanan radiologi",
    "data": [
      {
        "id": "string",
        "patientId": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string"
        },
        "doctorId": "string",
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string"
        },
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "examId": "string",
        "exam": {
          "id": "string",
          "name": "string",
          "code": "string"
        },
        "notes": "string",
        "priority": "string",
        "result": {
          "id": "string",
          "status": "string",
          "resultDate": "datetime"
        },
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Radiology Order by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (radiology order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data pesanan radiologi",
    "data": {
      "id": "string",
      "patientId": "string",
      "patient": {
        "id": "string",
        "name": "string",
        "medicalRecordNumber": "string",
        "nik": "string",
        "phone": "string",
        "address": "string"
      },
      "doctorId": "string",
      "doctor": {
        "id": "string",
        "fullName": "string",
        "specialization": "string",
        "phone": "string",
        "email": "string"
      },
      "visitId": "string",
      "visit": {
        "id": "string",
        "visitNumber": "string"
      },
      "examId": "string",
      "exam": {
        "id": "string",
        "name": "string",
        "code": "string",
        "category": "string",
        "description": "string",
        "preparation": "string",
        "contraindications": "string"
      },
      "notes": "string",
      "priority": "string",
      "result": {
        "id": "string",
        "result": "string",
        "notes": "string",
        "status": "string",
        "resultDate": "datetime"
      },
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Radiology Order
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "patientId": "string",
    "doctorId": "string",
    "visitId": "string",
    "examId": "string",
    "notes": "string",
    "priority": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data pesanan radiologi yang baru dibuat

### Update Radiology Order
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (radiology order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body: Sama seperti create radiology order
- Response: Sama seperti GET, tetapi dengan data pesanan radiologi yang diperbarui

### Delete Radiology Order
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (radiology order ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data pesanan radiologi"
  }
  ```

## API Radiology Results
Base URL: `http://localhost:3001/api/radiology-results`

### Get All Radiology Results
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data hasil radiologi",
    "data": [
      {
        "id": "string",
        "orderId": "string",
        "order": {
          "id": "string",
          "patient": {
            "id": "string",
            "name": "string",
            "medicalRecordNumber": "string"
          },
          "doctor": {
            "id": "string",
            "fullName": "string",
            "specialization": "string"
          },
          "visit": {
            "id": "string",
            "visitNumber": "string"
          },
          "exam": {
            "id": "string",
            "name": "string",
            "code": "string"
          }
        },
        "result": "string",
        "notes": "string",
        "status": "string",
        "resultDate": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Radiology Result by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (radiology result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data hasil radiologi",
    "data": {
      "id": "string",
      "orderId": "string",
      "order": {
        "id": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string",
          "nik": "string",
          "phone": "string",
          "address": "string"
        },
        "doctor": {
          "id": "string",
          "fullName": "string",
          "specialization": "string",
          "phone": "string",
          "email": "string"
        },
        "visit": {
          "id": "string",
          "visitNumber": "string"
        },
        "exam": {
          "id": "string",
          "name": "string",
          "code": "string",
          "category": "string",
          "description": "string",
          "preparation": "string",
          "contraindications": "string"
        }
      },
      "result": "string",
      "notes": "string",
      "status": "string",
      "resultDate": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Radiology Result
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Body:
  ```json
  {
    "orderId": "string",
    "result": "string",
    "notes": "string",
    "status": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data hasil radiologi yang baru dibuat

### Update Radiology Result
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (radiology result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Body: Sama seperti create radiology result
- Response: Sama seperti GET, tetapi dengan data hasil radiologi yang diperbarui

### Delete Radiology Result
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (radiology result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data hasil radiologi"
  }
  ```

### Verify Radiology Result
- Method: `PATCH`
- Endpoint: `/id/verify`
- Params: `id` (radiology result ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `RADIOLOGY_STAFF`
- Response: Sama seperti GET, tetapi dengan status hasil radiologi yang telah diperbarui menjadi 'verified'

## API Prescription Items
Base URL: `http://localhost:3001/api/prescription-items`

### Get All Prescription Items
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data item resep obat",
    "data": [
      {
        "id": "string",
        "prescriptionId": "string",
        "prescription": {
          "id": "string",
          "visitId": "string",
          "visit": {
            "id": "string",
            "visitNumber": "string",
            "patient": {
              "id": "string",
              "name": "string",
              "medicalRecordNumber": "string"
            }
          }
        },
        "medicineId": "string",
        "medicine": {
          "id": "string",
          "name": "string",
          "price": "number"
        },
        "quantity": "number",
        "dosage": "string",
        "frequency": "string",
        "duration": "number",
        "notes": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Prescription Item by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (prescription item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF` or `PHARMACY_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data item resep obat",
    "data": {
      "id": "string",
      "prescriptionId": "string",
      "prescription": {
        "id": "string",
        "visitId": "string",
        "visit": {
          "id": "string",
          "visitNumber": "string",
          "patient": {
            "id": "string",
            "name": "string",
            "medicalRecordNumber": "string",
            "nik": "string",
            "phone": "string",
            "address": "string"
          },
          "doctor": {
            "id": "string",
            "fullName": "string",
            "specialization": "string"
          }
        }
      },
      "medicineId": "string",
      "medicine": {
        "id": "string",
        "name": "string",
        "genericName": "string",
        "dosageForm": "string",
        "strength": "string",
        "manufacturer": "string",
        "price": "number",
        "stock": "number",
        "unit": "string"
      },
      "quantity": "number",
      "dosage": "string",
      "frequency": "string",
      "duration": "number",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Prescription Item
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body:
  ```json
  {
    "prescriptionId": "string",
    "medicineId": "string",
    "quantity": "number",
    "dosage": "string",
    "frequency": "string",
    "duration": "number",
    "notes": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data item resep yang baru dibuat

### Update Prescription Item
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (prescription item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Body: Sama seperti create prescription item
- Response: Sama seperti GET, tetapi dengan data item resep yang diperbarui

### Delete Prescription Item
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (prescription item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `MEDICAL_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data item resep obat"
  }
  ```

## API Bill Items
Base URL: `http://localhost:3001/api/bill-items`

### Get All Bill Items
- Method: `GET`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data item tagihan",
    "data": [
      {
        "id": "string",
        "billId": "string",
        "bill": {
          "id": "string",
          "patient": {
            "id": "string",
            "name": "string",
            "medicalRecordNumber": "string"
          },
          "visit": {
            "id": "string",
            "visitNumber": "string"
          }
        },
        "itemName": "string",
        "quantity": "number",
        "unitPrice": "number",
        "totalPrice": "number",
        "notes": "string",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
  ```

### Get Bill Item by ID
- Method: `GET`
- Endpoint: `/id`
- Params: `id` (bill item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil mengambil data item tagihan",
    "data": {
      "id": "string",
      "billId": "string",
      "bill": {
        "id": "string",
        "patient": {
          "id": "string",
          "name": "string",
          "medicalRecordNumber": "string",
          "nik": "string",
          "phone": "string",
          "address": "string"
        },
        "visit": {
          "id": "string",
          "visitNumber": "string"
        }
      },
      "itemName": "string",
      "quantity": "number",
      "unitPrice": "number",
      "totalPrice": "number",
      "notes": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
  ```

### Create Bill Item
- Method: `POST`
- Endpoint: [/](file:///Users/jejenjaenudin/Documents/SIMRSZEN/ARCHITECTURE_OVERVIEW.md)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body:
  ```json
  {
    "billId": "string",
    "itemName": "string",
    "quantity": "number",
    "unitPrice": "number",
    "notes": "string"
  }
  ```
- Response: Sama seperti GET, tetapi dengan data item tagihan yang baru dibuat

### Update Bill Item
- Method: `PUT`
- Endpoint: `/id`
- Params: `id` (bill item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Body: Sama seperti create bill item
- Response: Sama seperti GET, tetapi dengan data item tagihan yang diperbarui

### Delete Bill Item
- Method: `DELETE`
- Endpoint: `/id`
- Params: `id` (bill item ID)
- Headers: 
  - Authorization: `Bearer {token}`
  - Content-Type: `application/json`
- Required Role: `ADMIN` or `FINANCE_STAFF`
- Response:
  ```json
  {
    "success": true,
    "message": "Berhasil menghapus data item tagihan"
  }
  ```