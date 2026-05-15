# 🧪 Panduan Testing API dengan Postman

Base URL: `http://localhost:5000`

---

## 1. Health Check

**GET** `/api/health`

**Response:**
```json
{
  "success": true,
  "message": "IoT Water Monitoring API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 2. Login Admin

**POST** `/api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "username": "admin"
  }
}
```

> ⚠️ Simpan `token` untuk request yang membutuhkan autentikasi.

---

## 3. Tambah Data Sensor (ESP32)

**POST** `/api/water/add`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "turbidity": 25.5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Data saved successfully.",
  "data": {
    "id": 11,
    "turbidity": 25.5,
    "status": "Jernih",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Test berbagai nilai:**
```json
{ "turbidity": 15.0 }   → Status: "Jernih"
{ "turbidity": 45.0 }   → Status: "Keruh"
{ "turbidity": 85.0 }   → Status: "Sangat Keruh"
```

---

## 4. Ambil Semua Data

**GET** `/api/water`

**Query Parameters (opsional):**
```
?limit=10&page=1
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 11,
      "turbidity": 25.5,
      "status": "Jernih",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 11,
    "page": 1,
    "limit": 50,
    "totalPages": 1
  }
}
```

---

## 5. Data Terbaru

**GET** `/api/water/latest`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "turbidity": 25.5,
    "status": "Jernih",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 6. Statistik

**GET** `/api/water/stats`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_readings": "11",
    "avg_turbidity": "49.22",
    "min_turbidity": "8.90",
    "max_turbidity": "92.40",
    "jernih_count": "4",
    "keruh_count": "4",
    "sangat_keruh_count": "3"
  }
}
```

---

## 7. Hapus Data (Protected)

**DELETE** `/api/water/11`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Record deleted successfully."
}
```

**Response (401 — tanpa token):**
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

---

## 8. Info Admin (Protected)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
}
```

---

## 💡 Tips Postman

1. Buat **Environment** baru dengan variable:
   - `base_url` = `http://localhost:5000`
   - `token` = (isi setelah login)

2. Di request Login, tambahkan **Tests** script:
```javascript
const res = pm.response.json();
if (res.token) {
  pm.environment.set("token", res.token);
}
```

3. Untuk request protected, gunakan:
   - Auth Type: **Bearer Token**
   - Token: `{{token}}`
