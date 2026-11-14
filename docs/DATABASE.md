# Database Specification

## 1. Database Engine
- **Engine:** MySQL 8.0+ (InnoDB)
- **Database Name (Development):** `crud_barang_3`
- **Database Name (Testing):** `crud_barang_3_test`
- **Charset / Collation:** `utf8mb4` / `utf8mb4_unicode_ci`
- **Environment:** Local (Laragon MySQL), Staging, & Production

---

## 2. Naming Conventions
- **Tables:** Plural `snake_case` (contoh: `users`, `categories`, `units`, `items`, `transactions`, `item_requests`, `notifications`).
- **Columns:** Singular `snake_case` (contoh: `item_id`, `created_at`).
- **Primary Keys:** `id` (`BIGINT UNSIGNED AUTO_INCREMENT`).
- **Foreign Keys:** `{singular_table}_id` (contoh: `category_id` references `categories(id)`).
- **Timestamps:** `created_at` dan `updated_at` (`TIMESTAMP NULL`).

---

## 3. Tables Schema

### 1. `users`
Tabel pengguna dan penetapan role RBAC.
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `name`: VARCHAR(255) NOT NULL
- `email`: VARCHAR(255) NOT NULL UNIQUE
- `password`: VARCHAR(255) NOT NULL
- `role`: ENUM('admin', 'staff') NOT NULL DEFAULT 'staff'
- `remember_token`: VARCHAR(100) NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 2. `categories`
Master kategori pengelompokan barang.
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `name`: VARCHAR(100) NOT NULL UNIQUE
- `description`: TEXT NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 3. `units`
Master satuan pengukuran barang (misal: Pcs, Box, Rim).
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `name`: VARCHAR(50) NOT NULL UNIQUE
- `abbreviation`: VARCHAR(20) NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 4. `items`
Katalog barang inventaris dan tracking saldo stok saat ini.
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `code`: VARCHAR(50) NOT NULL UNIQUE (SKU / Kode Barang, misal: `BRG-0001`)
- `name`: VARCHAR(255) NOT NULL
- `category_id`: BIGINT UNSIGNED NOT NULL FK -> `categories(id)` ON DELETE RESTRICT
- `unit_id`: BIGINT UNSIGNED NOT NULL FK -> `units(id)` ON DELETE RESTRICT
- `price`: DECIMAL(15, 2) NOT NULL DEFAULT 0.00 (Harga satuan barang)
- `stock`: INT UNSIGNED NOT NULL DEFAULT 0
- `minimum_stock`: INT UNSIGNED NOT NULL DEFAULT 5 (Threshold peringatan low stock)
- `description`: TEXT NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 5. `transactions`
Log mutasi barang masuk & keluar (**Append-only: Tidak boleh diedit atau dihapus**).
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `transaction_code`: VARCHAR(50) NOT NULL UNIQUE (misal: `TRX-IN-202610-0001`, `TRX-OUT-202610-0001`)
- `type`: ENUM('masuk', 'keluar') NOT NULL
- `item_id`: BIGINT UNSIGNED NOT NULL FK -> `items(id)` ON DELETE RESTRICT
- `user_id`: BIGINT UNSIGNED NOT NULL FK -> `users(id)` ON DELETE RESTRICT (Pencatat mutasi)
- `item_request_id`: BIGINT UNSIGNED NULL FK -> `item_requests(id)` ON DELETE SET NULL (Terisi jika mutasi keluar dipicu persetujuan permintaan)
- `quantity`: INT UNSIGNED NOT NULL
- `date`: DATE NOT NULL
- `notes`: TEXT NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 6. `item_requests`
Pengajuan permintaan barang oleh Staff dan persetujuan oleh Admin.
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `request_code`: VARCHAR(50) NOT NULL UNIQUE (misal: `REQ-202610-0001`)
- `user_id`: BIGINT UNSIGNED NOT NULL FK -> `users(id)` ON DELETE RESTRICT (Staff pemohon)
- `item_id`: BIGINT UNSIGNED NOT NULL FK -> `items(id)` ON DELETE RESTRICT
- `quantity`: INT UNSIGNED NOT NULL
- `status`: ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'
- `purpose`: TEXT NOT NULL (Keperluan/alasan permintaan)
- `approved_by`: BIGINT UNSIGNED NULL FK -> `users(id)` ON DELETE SET NULL (Admin peninjau)
- `approved_at`: DATETIME NULL
- `rejection_reason`: TEXT NULL (Wajib terisi jika status 'rejected')
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

### 7. `notifications`
In-app notification untuk alert header dan status permintaan.
- `id`: BIGINT UNSIGNED AUTO_INCREMENT PK
- `user_id`: BIGINT UNSIGNED NOT NULL FK -> `users(id)` ON DELETE CASCADE
- `title`: VARCHAR(255) NOT NULL
- `message`: TEXT NOT NULL
- `type`: VARCHAR(50) NOT NULL (misal: `request_submitted`, `request_approved`, `request_rejected`, `low_stock`)
- `data`: JSON NULL (Payload referensi, e.g. `{"item_request_id": 1}`)
- `is_read`: BOOLEAN NOT NULL DEFAULT FALSE
- `read_at`: TIMESTAMP NULL
- `created_at`: TIMESTAMP NULL
- `updated_at`: TIMESTAMP NULL

---

## 4. Relationships
- `categories` (1) ── (N) `items`
- `units` (1) ── (N) `items`
- `users` (1) ── (N) `transactions`
- `items` (1) ── (N) `transactions`
- `users` (1) ── (N) `item_requests` (sebagai pemohon)
- `users` (1) ── (N) `item_requests` (sebagai reviewer/admin)
- `items` (1) ── (N) `item_requests`
- `item_requests` (1) ── (0..1) `transactions`
- `users` (1) ── (N) `notifications`

---

## 5. Constraints & Data Integrity
1. **Append-only Guarantee:** Tabel `transactions` dilindungi larangan `UPDATE` dan `DELETE` di level service & policy.
2. **Restrict on Delete:** `categories`, `units`, dan `items` tidak dapat dihapus jika telah memiliki referensi data transaksi (`ON DELETE RESTRICT`).
3. **Non-negative Stock:** Perubahan stok pada `items.stock` selalu dijalankan dalam `DB::transaction()` dengan verifikasi sisa stok $\ge$ mutasi keluar.

---

## 6. Indexes & Query Optimization
- `items`: `INDEX (category_id)`, `INDEX (unit_id)`, `INDEX (name)` (optimasi pencarian filter katalog).
- `transactions`: `INDEX (item_id, date)`, `INDEX (type)`, `INDEX (date)` (optimasi filter laporan dan audit mutasi).
- `item_requests`: `INDEX (status)`, `INDEX (user_id)`, `INDEX (created_at)` (optimasi query pending approval dan antrean notifikasi).
- `notifications`: `INDEX (user_id, is_read)` (optimasi fetch unread count interval 30 detik).

---

## 7. Audit & Sensitive Data
- Password pengguna di-hash menggunakan `bcrypt`.
- Sanctum personal access tokens dikelola melalui table `personal_access_tokens` bawaan Laravel.

---

## 8. Seed Data Plan
1. **Users:** 1 Admin (`admin@inventory.local`), 1 Staff (`staff@inventory.local`).
2. **Categories:** 4 kategori awal (Elektronik, Alat Tulis Kantor, Perlengkapan Gudang, Kebersihan).
3. **Units:** Pcs, Box, Rim, Pack, Unit.
4. **Items:** 5 item awal dengan stok awal dan kode unik.
