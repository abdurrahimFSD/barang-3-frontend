# Security Guidelines

## 1. Authentication
- **Provider:** Laravel Sanctum (Decoupled BFF Architecture)
- **Method:** Email & Password (internal enterprise tool, no public registration)
- **Password Hashing:** `bcrypt` (work factor rounds = 12)
- **Token Storage:** Disimpan di `httpOnly`, `secure`, `SameSite=Lax` cookie pada domain frontend Next.js (Token dilarang keras disimpan di `localStorage` atau `sessionStorage` untuk mencegah pencurian via XSS).
- **Token Expiration:** 24 jam (default), otomatis revoke saat logout.

---

## 2. Authorization & RBAC
Otorisasi wajib divalidasi di sisi server (Server-Side) menggunakan native Laravel `RoleMiddleware`, Gate, dan Eloquent Policies.

### Roles & Permission Matrix

| Modul / Fitur | Admin | Staff | Catatan Otorisasi |
| :--- | :---: | :---: | :--- |
| **Login & Dashboard** | Full | Scoped | Staff hanya melihat metrik & aktivitas operasional |
| **Master Data (Kategori, Satuan, User)**| Full | ❌ Forbidden | Route dilindungi middleware `role:admin` |
| **Katalog Barang (Read & Detail)** | Full | Read Only | Admin dapat CRUD; Staff hanya read & view detail |
| **Transaksi (Barang Masuk & Keluar)** | Create, Read | Create, Read | **Strictly Append-Only**: Dilarang Edit & Hapus |
| **Permintaan Barang (Pengajuan)** | ❌ Read Only | Create, Read | Staff membuat pengajuan; divalidasi Qty $\le$ Stok |
| **Approval Permintaan Barang** | Full | ❌ Forbidden | Admin berhak Approve atau Reject (wajib alasan) |
| **Laporan & PDF Export** | Full | ❌ Forbidden | Menu dan endpoint laporan khusus role Admin |
| **Notifikasi In-App** | Own | Own | User hanya dapat membaca notifikasi miliknya |

---

## 3. Secrets & Environment Variables

### A. Environment Separation
- File `.env` dan credential produksi dilarang keras di-commit ke Git repository.
- Seluruh environment variable rahasia wajib dienkripsi atau disimpan pada secret manager di environment staging/production.

### B. Variables Classification
- **Public (Frontend Exposed):**
  - `NEXT_PUBLIC_APP_NAME`
  - `NEXT_PUBLIC_API_URL` (contoh: `http://localhost:8000/api/v1`)
- **Private (Server-Side Only):**
  - **Laravel:** `APP_KEY`, `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `SANCTUM_STATEFUL_DOMAINS`, `CORS_ALLOWED_ORIGINS`, `FRONTEND_URL`
  - **Next.js:** `INTERNAL_API_URL` (URL internal backend server-to-server), `AUTH_COOKIE_SECRET`

---

## 4. API Security & Threat Mitigation

### 4.1 Input Validation & Sanitization
- Seluruh input mutasi wajib divalidasi melalui **Laravel Form Request Classes** (`mode: 'onSubmit'` di client via Zod).
- Data yang tidak terdaftar pada Form Request otomatis dibuang untuk mencegah *Mass Assignment Vulnerabilities*.
- Model Eloquent wajib mendefinisikan `$fillable` secara eksplisit.

### 4.2 SQL Injection Prevention
- Seluruh interaksi database wajib menggunakan **Eloquent ORM** atau PDO Parameter Binding (`DB::select('... WHERE id = ?', [$id])`).
- Dilarang keras melakukan konkatenasi string SQL mentah.

### 4.3 Brute-Force Protection & Rate Limiting
- **Login Endpoint:** Dibatasi maksimal **5 percobaan gagal per menit** per kombinasi IP + Email via `RateLimiter`. Jika terlampaui, kembalikan HTTP `429 Too Many Requests`.
- **Global API Rate Limit:** Dibatasi maksimal **60 request / menit** per user terotentikasi via `throttle:api`.
- **Polling Notification Rate Limit:** Endpoint `/notifications/unread-count` dioptimasi ringan (hanya menjalankan query `COUNT(*)` terindeks) dan dipanggil maksimal setiap 30 detik.

### 4.4 Cross-Origin Resource Sharing (CORS) & BFF Proxy
- CORS dikonfigurasi ketat di Laravel (`config/cors.php`) dengan `supports_credentials = true`.
- Hanya domain frontend terdaftar yang diizinkan (`allowed_origins = ['http://localhost:3000', 'http://127.0.0.1:3000']` di local).
- Wildcard origin (`*`) dilarang keras saat melibatkan credentials/cookies.
- Panggilan API browser diarahkan ke Next.js BFF Catch-All Proxy (`/api/v1/[...path]`) yang berjalan di origin yang sama (same-origin), mengeliminasi risiko CORS browser secara total, sembari menginjeksi token Sanctum dari HTTP-only cookie secara server-side.

### 4.5 Immutability & Audit Trail
- Tabel `transactions` berstatus **append-only**.
- Route `PUT`, `PATCH`, dan `DELETE` ditiadakan pada modul transaksi.
- Setiap mutasi pengurangan stok yang dipicu approval otomatis merekam ID Admin penyetuju dan ID Staff pemohon.

---

## 5. Data Protection & Logging

### 5.1 Sensitive Data Masking
- Password pengguna di-hash satu arah menggunakan `bcrypt`.
- Field `password` dan `remember_token` wajib dimasukkan ke dalam properti `$hidden` pada model `User`.

### 5.2 Logging Rules
- **Dilarang Log:** Plaintext password, auth token, dan header Authorization.
- **Wajib Log:** Percobaan login gagal, mutasi approval/rejection stok bernilai besar, kegagalan koneksi database, dan unhandled exception (HTTP 500).

---

## 6. File Uploads & Document Security
- **Aplikasi MVP ini tidak menyediakan fitur upload file publik** dari sisi pengguna (mencegah risiko eksekusi file berbahaya / RCE).
- Dokumen laporan PDF di-generate secara internal di server menggunakan `DomPDF` dan langsung di-stream dalam format binary `application/pdf` dengan header `Content-Disposition: inline`.

---

## 7. Security Implementation Checklist

- [ ] Proteksi CSRF & XSS aktif via HTTP-only Cookies
- [ ] RoleMiddleware terpasang pada route Admin di `routes/api.php`
- [ ] Rate limiting login (5x/menit) dan API global (60x/menit) aktif
- [ ] Model `$fillable` dan `$hidden` terkonfigurasi
- [ ] Restrict on Delete aktif pada Foreign Key master data
- [ ] Route transaksi bebas dari method UPDATE/DELETE
- [ ] CORS hanya mengizinkan origin frontend resmi
- [ ] Debug mode (`APP_DEBUG=false`) wajib dimatikan di production
