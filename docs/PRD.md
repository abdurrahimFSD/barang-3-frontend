# Product Requirements Document (PRD)

## 1. Product Overview

- **Product Name:** Inventory Management System
- **One-Line Description:** Web-based inventory application with responsive UI to manage stock, item requests, and transaction logs across Admin and Staff roles.
- **Product Type:** Internal Tool / Web Application
- **Primary Platform:** Responsive Web (Next.js FE + Laravel BE)

---

## 2. Problem Statement

- **What problem are we solving?**
  Pencatatan inventaris manual menyebabkan selisih stock, pengeluaran barang tanpa approval yang jelas, serta riwayat transaksi barang yang terfragmentasi.
- **Why does this problem matter?**
  Mempengaruhi akurasi stock opname, memperlambat proses pengadaan, dan menyulitkan audit pengeluaran barang.
- **How are users solving this today?**
  Spreadsheet manual atau formulir kertas tanpa validasi real-time dan tanpa audit trail.

---

## 3. Goals

### Primary Goal
Menyediakan sistem inventaris terpusat dengan role-based access control (Admin & Staff) untuk pencatatan stock, immutable transaction logging, dan approval workflow permintaan barang.

### Secondary Goals
- Real-time stock visibility dengan riwayat transaksi per barang.
- Filterable reports dengan web preview dan PDF export.
- UI yang responsive di mobile, tablet, dan desktop.
- In-app notification untuk update status permintaan barang secara transparan.

---

## 4. User Roles & Personas

### 1. Admin
- **Description:** Administrator pengelola master data dan pengambil keputusan approval.
- **Needs:**
  - Full CRUD untuk Master Kategori, Satuan, Pengguna, dan Barang.
  - Review, approve, atau reject Permintaan Barang (disertai modal input alasan penolakan).
  - Monitoring KPI dan chart pergerakan barang di Dashboard.
  - Akses Laporan komprehensif (Stok, Transaksi, Permintaan) via Web view dan PDF.
- **Pain Points:** Kesulitan memverifikasi keabsahan permintaan barang dan rekap laporan manual yang memakan waktu.

### 2. Staff
- **Description:** Staf operasional yang menangani mutasi barang harian dan pengajuan kebutuhan barang.
- **Needs:**
  - Melihat ketersediaan stock barang dan riwayat transaksi.
  - Input transaksi (Barang Masuk & Barang Keluar) tanpa aksi edit/hapus.
  - Mengajukan Permintaan Barang (kuantitas divalidasi tidak melebihi current stock) dan memantau status persetujuan.
  - Menerima in-app notification saat permintaan disetujui atau ditolak.
  - Melihat ringkasan aktivitas di Dashboard.
- **Pain Points:** Tidak mengetahui sisa stock aktual dan tidak memiliki transparansi status permintaan barang.

---

## 5. User Stories

- **Admin:**
  - As an Admin, I want to manage Kategori, Satuan, and Pengguna so that master data remains organized and controlled.
  - As an Admin, I want to manage Barang with search and category filters so that inventory catalog is up-to-date.
  - As an Admin, I want to view item detail with complete transaction history so that I can audit every movement.
  - As an Admin, I want to review, approve, or reject Permintaan Barang with a mandatory reason modal on rejection.
  - As an Admin, I want system to automatically deduct stock and generate a Barang Keluar transaction upon approving a request.
  - As an Admin, I want to generate filtered reports for Stok, Transaksi, and Permintaan in Web preview and PDF.
  - As an Admin, I want to view Dashboard statistics (KPI cards, charts, summary tables).

- **Staff:**
  - As a Staff, I want to search and filter Barang and inspect item details with transaction history so that I know current stock availability.
  - As a Staff, I want to record Barang Masuk and Barang Keluar without edit/delete privileges to ensure data integrity.
  - As a Staff, I want to submit Permintaan Barang with quantity validation against current stock.
  - As a Staff, I want to receive in-app notifications and view status updates when my request is approved or rejected.
  - As a Staff, I want to view Dashboard metrics relevant to operational activities.

---

## 6. Core Features

### Feature 1 — Authentication & Role-Based Access Control (RBAC)
- **Purpose:** Mengamankan akses sistem berdasarkan 2 role: Admin dan Staff.
- **User Flow:** Login -> token/session generation -> redirect ke Dashboard sesuai permission role.
- **Acceptance Criteria:**
  - *Scenario: Staff attempts to access Admin menu*
    - GIVEN User terautentikasi dengan role Staff
    - WHEN User mencoba mengakses route Master Data (Kategori, Satuan, Pengguna) atau Approval Permintaan
    - THEN Sistem mengembalikan status 403 Forbidden / redirect unauthorized.

### Feature 2 — Master Data Management (Admin Only)
- **Menu Kategori:** CRUD data kategori barang.
- **Menu Satuan:** CRUD satuan ukuran barang (misal: Pcs, Box, Rim).
- **Menu Pengguna:** CRUD user account dan penetapan role (Admin / Staff).

### Feature 3 — Barang & Detail Riwayat
- **Akses:** Admin (CRUD, search, category filter, View Detail); Staff (Read-only Table, search, category filter, View Detail).
- **Halaman Detail Barang:**
  - Informasi spesifikasi barang.
  - Riwayat Transaksi khusus barang tersebut.
- **Acceptance Criteria:**
  - *Scenario: View item detail*
    - GIVEN User (Admin atau Staff) berada di table Barang
    - WHEN User mengklik aksi Lihat
    - THEN Sistem membuka halaman baru yang menampilkan informasi barang dan riwayat transaksi barang tersebut.

### Feature 4 — Transaksi (Append-Only)
- **Akses:** Admin dan Staff.
- **Supported Transaction Types:** `Barang Masuk` dan `Barang Keluar`.
- **Behavior:**
  - Table list transaksi (filterable).
  - Tombol Tambah Transaksi (Admin & Staff dapat input Barang Masuk & Barang Keluar).
  - **Strictly No Edit & No Delete** untuk menjaga audit trail dan integritas stock.
- **Acceptance Criteria:**
  - *Scenario: Transaction immutability*
    - GIVEN Record transaksi telah tersimpan
    - WHEN Admin atau Staff melihat data transaksi
    - THEN Tidak tersedia tombol Edit maupun Hapus, baik di UI maupun via API endpoint.

### Feature 5 — Permintaan Barang & Approval Workflow
- **Akses & Flow:**
  - Staff:
    - Table list permintaan miliknya.
    - Tombol Tambah Permintaan (Kuantitas input dibatasi validasi: tidak boleh melebihi current stock).
    - Aksi Detail (informasi permintaan, status, alasan penolakan jika ditolak).
  - Admin:
    - Table list semua permintaan dengan Filter Status (`Pending`, `Approved`, `Rejected`).
    - Aksi Setujui: Mengubah status menjadi `Approved`, **otomatis memotong stock barang** dan **men-generate record Transaksi Keluar** terhubung.
    - Aksi Tolak: Menampilkan modal input alasan tolak (wajib diisi), mengubah status menjadi `Rejected`.
    - Aksi Detail: Informasi permintaan lengkap + tombol aksi Setujui dan Tolak.
  - Notifications: In-app notification badge di header dan real-time status update di table untuk Staff pemohon.
- **Acceptance Criteria:**
  - *Scenario: Admin approves request*
    - GIVEN Permintaan berstatus Pending dengan kuantitas valid
    - WHEN Admin menekan tombol Setujui
    - THEN Status permintaan berubah menjadi Approved, stock barang otomatis berkurang, record Transaksi Keluar tercatat otomatis, dan Staff pemohon menerima in-app notification.
  - *Scenario: Admin rejects item request*
    - GIVEN Admin memilih aksi Tolak pada data permintaan berstatus Pending
    - WHEN Admin submit modal alasan penolakan dengan input teks alasan
    - THEN Status permintaan berubah menjadi Rejected, alasan penolakan tersimpan, stock tidak berubah, dan Staff pemohon menerima in-app notification.

### Feature 6 — Laporan (Web View & PDF)
- **Jenis Laporan (Admin Only):**
  1. Laporan Stok Barang
  2. Laporan Transaksi
  3. Laporan Permintaan Barang
- **Format Output:** Web view responsif dan export/preview file PDF.
- **Filter:** Rentang tanggal, kategori, dan status.

### Feature 7 — Dashboard & In-App Notification
- **Akses:** Admin dan Staff (data disesuaikan dengan scope role).
- **Komponen:**
  - KPI summary cards (Total Barang, Total Transaksi, Permintaan Pending, Low Stock Warning).
  - Chart tren pergerakan barang (Barang Masuk vs Barang Keluar).
  - Table ringkasan aktivitas terbaru.
  - In-app notification bell icon pada header dengan unread count badge.

---

## 7. Non-Goals

- Public e-commerce / customer checkout.
- Multi-warehouse / multi-branch stock transfer (fokus single warehouse).
- Modifikasi atau penghapusan record transaksi historis (immutable).
- Export ke spreadsheet format (Excel/CSV) di versi ini.
- Email notification gateway (menggunakan in-app notification).
- Offline-first PWA sync (sistem beroperasi secara online web application).

---

## 8. MVP Scope

### Must Have
- Autentikasi dan RBAC (Admin, Staff).
- Master Data CRUD: Kategori, Satuan, Pengguna.
- Barang catalog: CRUD (Admin), Search, Category filter, Detail page + Riwayat Transaksi.
- Transaksi: Table view + Create (Barang Masuk & Barang Keluar, Append-only).
- Permintaan Barang: Create with stock validation (Staff), Approval with auto-stock deduction & auto-transaction (Admin), Rejection modal with mandatory reason, Detail view.
- In-App Notification: Header bell icon + badge status updates.
- Laporan: Stok, Transaksi, Permintaan (Multi-filter, Web view, PDF view).
- Dashboard: KPI cards, charts, recent activities.
- Responsive layout across mobile (360px+), tablet (768px+), dan desktop (1024px+).

### Nice to Have
- Low-stock badge indicator di list barang dan dashboard.
- Shortcut filter cepat pada dashboard KPI card.

### Future
- Barcode / QR Code scanner integration.
- Multi-warehouse management.
- Email / WhatsApp gateway notification.

---

## 9. Success Metrics

- 100% mutasi stock tercatat tanpa adanya record transaksi yang terhapus atau ter-edit (zero untracked changes).
- Seluruh approval permintaan barang tercatat otomatis ke Transaksi Keluar tanpa gap data.
- 0% permintaan barang dibuat melebihi kuantitas stock aktif.
- Laporan stok dan transaksi dapat di-render dan di-download ke PDF secara instan.
- Responsive layout berfungsi optimal pada resolusi mobile, tablet, dan desktop.

---

## 10. Constraints

- **Technical:**
  - Polyrepo: Next.js (Frontend) dan Laravel (Backend API).
  - RESTful API communication with JSON payload.
  - State management dan data fetching terisolasi via API.
- **Business:**
  - Transaksi bersifat append-only (no edit, no delete).
  - Penolakan permintaan barang wajib menyertakan alasan.
  - Format laporan hanya Web view dan PDF.
- **Design:**
  - Responsive design across mobile, tablet, desktop.
  - Clean, intuitive dashboard, forms, and data tables.

---

## 11. Assumptions

- Setiap approval Permintaan Barang otomatis menghasilkan record Transaksi Keluar dan mengurangi current stock.
- Permintaan Barang memiliki default status `Pending` saat pertama kali dibuat.
- Pengguna sistem login menggunakan kredensial email/username dan password yang dikelola oleh Admin.

---

## 12. Open Questions & Resolution Log

- [Resolved] *Apakah approval Permintaan Barang otomatis memotong stock dan mencatat Transaksi Keluar?*
  **Keputusan:** Ya, otomatis memotong stock dan membuat record Transaksi Keluar terhubung.
- [Resolved] *Apa jenis transaksi yang tersedia pada Tambah Transaksi?*
  **Keputusan:** Barang Masuk dan Barang Keluar.
- [Resolved] *Apakah Staff boleh input Barang Masuk dan Keluar?*
  **Keputusan:** Ya, Staff dan Admin dapat menginput Barang Masuk dan Barang Keluar.
- [Resolved] *Apakah jumlah Permintaan Barang dibatasi oleh current stock?*
  **Keputusan:** Ya, dibatasi oleh validasi sistem (tidak boleh melebihi current stock).
- [Resolved] *Apakah laporan butuh export Excel/CSV?*
  **Keputusan:** Tidak, cukup Web view dan file PDF.
- [Resolved] *Bagaimana mekanisme notifikasi status permintaan?*
  **Keputusan:** In-app notification badge di header dan update status pada table.

---

## 13. Definition of Done (DoD)

- [x] Semua user stories dan core features terdefinisi tanpa ambiguitas.
- [x] Role Admin dan Staff terpetakan secara konsisten di seluruh modul.
- [x] Keputusan bisnis utama (approval linkage, transaction types, role permissions, notification, export format) telah disepakati.
- [ ] PRD disetujui oleh user sebelum melanjutkan ke `UX_FLOWS.md`, `DESIGN.md`, dan dokumen teknis berikutnya.
