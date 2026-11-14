# API Documentation (v1)

## 1. Overview & Conventions
- **Base URL:** `/api/v1`
- **Format:** JSON (`application/json`)
- **Authentication:** Bearer Token via Laravel Sanctum (`Authorization: Bearer <token>`)
- **Rate Limiting:** 60 requests / minute per user/IP

### Standard Request Headers
```http
Accept: application/json
Content-Type: application/json
Authorization: Bearer <sanctum_token>
```

---

## 2. Standard Response Envelope

### A. Success Response (Single Object)
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "id": 1
  }
}
```

### B. Paginated Collection Response
```json
{
  "success": true,
  "message": "Data list retrieved successfully",
  "data": [],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

### C. Validation Error Response (HTTP 422)
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "code": ["The code field is required."],
    "stock": ["The stock must be at least 0."]
  }
}
```

### D. Generic Error Response (HTTP 401 / 403 / 404 / 500)
```json
{
  "success": false,
  "message": "Unauthorized / Forbidden / Resource not found."
}
```

---

## 3. Endpoints Specification

### 3.1 Authentication (`/auth`)

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Public | Login pengguna, mereturn token Sanctum & data profil |
| `POST` | `/auth/logout` | Authenticated | Revoke token aktif pengguna |
| `GET` | `/auth/me` | Authenticated | Ambil profil data pengguna saat ini |

#### POST `/auth/login`
- **Payload:**
```json
{
  "email": "admin@inventory.local",
  "password": "password"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "1|sanctum_plain_text_token...",
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "admin@inventory.local",
      "role": "admin"
    }
  }
}
```

---

### 3.2 Master Categories (`/categories`) — *Admin Only*

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/categories` | List kategori (paged / all) |
| `POST` | `/categories` | Tambah kategori baru (`name`, `description`) |
| `GET` | `/categories/{id}` | Detail kategori |
| `PUT` | `/categories/{id}` | Update nama / deskripsi kategori |
| `DELETE`| `/categories/{id}` | Hapus kategori (Ditolak jika ada relasi barang) |

---

### 3.3 Master Units (`/units`) — *Admin Only*

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/units` | List satuan barang |
| `POST` | `/units` | Tambah satuan baru (`name`, `abbreviation`) |
| `GET` | `/units/{id}` | Detail satuan |
| `PUT` | `/units/{id}` | Update satuan |
| `DELETE`| `/units/{id}` | Hapus satuan (Ditolak jika ada relasi barang) |

---

### 3.4 Master Users (`/users`) — *Admin Only*

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/users` | List pengguna sistem |
| `POST` | `/users` | Buat akun user (`name`, `email`, `password`, `role`) |
| `GET` | `/users/{id}` | Detail akun user |
| `PUT` | `/users/{id}` | Update user (nama, email, role, password opsional) |
| `DELETE`| `/users/{id}` | Hapus user |

---

### 3.5 Items Catalog (`/items`)

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/items` | Admin, Staff | Katalog barang (Query params: `search`, `category_id`, `page`) |
| `GET` | `/items/{id}` | Admin, Staff | Detail barang lengkap dengan riwayat mutasi transaksi |
| `POST` | `/items` | Admin Only | Tambah data barang (`code`, `name`, `category_id`, `unit_id`, `price`, `stock`, `minimum_stock`, `description`) |
| `PUT` | `/items/{id}` | Admin Only | Update info master barang (Perubahan stok fisik dilakukan via menu Transaksi) |
| `DELETE`| `/items/{id}` | Admin Only | Hapus barang (Ditolak jika sudah ada log transaksi) |

#### GET `/items/{id}` (Detail Barang + Riwayat Transaksi)
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Item details retrieved",
  "data": {
    "id": 1,
    "code": "BRG-0001",
    "name": "Kertas HVS A4 80gr",
    "category": { "id": 1, "name": "Alat Tulis Kantor" },
    "unit": { "id": 1, "name": "Rim" },
    "price": "45000.00",
    "stock": 25,
    "minimum_stock": 5,
    "description": "Kertas HVS 80gr putih",
    "transactions_history": [
      {
        "id": 1,
        "transaction_code": "TRX-IN-202610-0001",
        "type": "masuk",
        "quantity": 30,
        "date": "2026-10-30",
        "user_name": "Super Admin",
        "notes": "Pengadaan awal"
      }
    ]
  }
}
```

---

### 3.6 Transactions (`/transactions`) — *Strictly Append-Only*

> [!IMPORTANT]
> Route transaksi dilarang keras menyediakan method `PUT`, `PATCH`, atau `DELETE`.

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/transactions` | Admin, Staff | List mutasi transaksi (Filter: `type`, `start_date`, `end_date`, `item_id`, `page`) |
| `POST` | `/transactions` | Admin, Staff | Catat mutasi manual (`Barang Masuk` atau `Barang Keluar`) |

#### POST `/transactions`
- **Payload:**
```json
{
  "type": "keluar",
  "item_id": 1,
  "quantity": 5,
  "date": "2026-10-31",
  "notes": "Keperluan operasional kantor"
}
```
- **Business Rule:** Jika `type == 'keluar'`, sistem memvalidasi `quantity <= items.stock`.

---

### 3.7 Item Requests (`/item-requests`)

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/item-requests` | Admin, Staff | List pengajuan (Staff: milik sendiri, Admin: semua pengajuan. Filter: `status`, `page`) |
| `POST` | `/item-requests` | Staff Only | Ajukan permintaan barang (`item_id`, `quantity`, `purpose`). Qty $\le$ stok saat ini |
| `GET` | `/item-requests/{id}`| Admin, Staff | Detail pengajuan (beserta catatan/alasan tolak jika ada) |
| `POST` | `/item-requests/{id}/approve` | Admin Only | Setujui permintaan: Potong stok otomatis & buat transaksi Keluar |
| `POST` | `/item-requests/{id}/reject` | Admin Only | Tolak permintaan (Wajib sertakan `{ "rejection_reason": "..." }`) |

#### POST `/item-requests/{id}/reject`
- **Payload:**
```json
{
  "rejection_reason": "Alokasi anggaran divisi telah mencapai batas maksimal bulan ini."
}
```

---

### 3.8 Reports & PDF Export (`/reports`) — *Admin Only*

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/reports/stock` | Laporan stok barang (Filter: `category_id`) |
| `GET` | `/reports/transactions` | Laporan transaksi (Filter: `start_date`, `end_date`, `type`, `item_id`) |
| `GET` | `/reports/item-requests`| Laporan permintaan (Filter: `start_date`, `end_date`, `status`) |
| `GET` | `/reports/pdf` | Generate & stream dokumen PDF A4 siap cetak |

#### Query Parameters GET `/reports/pdf`:
- `type`: `stock` | `transactions` | `item-requests` (wajib)
- `start_date`, `end_date`: `YYYY-MM-DD` (opsional)
- `category_id`: ID kategori (opsional)
- `status`: `pending` | `approved` | `rejected` (opsional)

---

### 3.9 Notifications (`/notifications`)

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/notifications` | Authenticated | Ambil daftar notifikasi in-app user |
| `GET` | `/notifications/unread-count` | Authenticated | Endpoint ringan polling 30 detik untuk header counter badge |
| `PATCH`| `/notifications/{id}/read` | Authenticated | Tandai 1 notifikasi telah dibaca |
| `PATCH`| `/notifications/read-all` | Authenticated | Tandai seluruh notifikasi user telah dibaca |

---

### 3.10 Dashboard Metrics (`/dashboard`)

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/dashboard/metrics` | Admin, Staff | KPI Cards (Total Item, Mutasi, Pending, Low Stock), Chart tren mutasi 6 bulan, dan 5 aktivitas terbaru |
