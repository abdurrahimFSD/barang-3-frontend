# UX Flows

## 1. Global UI/UX Conventions

- **Loading State:** Skeleton loader pada data tables dan KPI cards; button spinner dengan status disabled saat asynchronous mutation.
- **Error State:** Inline error message di bawah form input; toast notification (merah) untuk kegagalan API/network atau validasi backend.
- **Empty State:** Visual container dengan icon informatif dan pesan teks ringkas (e.g. "Data belum tersedia") tanpa tombol aksi di dalam table (tombol aksi utama tetap terpusat di atas table).
- **Success State:** Toast notification (hijau) muncul di top-right (auto-dismiss 3 detik); state table/page ter-update secara reaktif.

---

## Flow 1 — Authentication & Role Redirection

### Steps
1. User membuka URL aplikasi. Jika unauthenticated, redirect ke `/login`.
2. User menginput email/username dan password.
3. User menekan tombol **Sign in**.
4. Sistem memvalidasi kredensial via API.
5. Token disimpan di HTTP-only cookie (secure, SameSite=Lax) via Next.js Route Handler.
6. Sistem mendeteksi role (`Admin` atau `Staff`) dan me-redirect user ke `/dashboard`.

- **Success:** Redirect ke Dashboard dengan navigasi menu sesuai permission role.
- **Failure:** Inline error "Kredensial tidak valid" di bawah input; nilai input tidak di-reset.
- **Loading State:** Button Sign in menampilkan spinner dan label "Signing in...".

---

## Flow 2 — Master Data Management (Admin Only)

*Berlaku untuk Menu Kategori, Satuan, dan Pengguna via Modal Dialog.*

### Steps
1. Admin mengakses menu (Kategori / Satuan / Pengguna).
2. Sistem me-render table list data master.
3. Admin menekan tombol **Tambah Data**.
4. **Modal Dialog** form input terbuka.
5. Admin mengisi field dan menekan tombol **Simpan**.
6. Sistem memvalidasi input dan mengirim payload ke API.
7. Modal tertutup otomatis dan table data me-refresh data terbaru.

- **Edit / Delete Action:**
  - Klik **Edit** -> Modal Dialog terbuka dengan prefilled data -> Simpan -> Table update.
  - Klik **Hapus** -> Modal konfirmasi terbuka -> Konfirmasi -> Data terhapus jika tidak ada relasi aktif.
- **Success:** Toast notification "Data berhasil disimpan/dihapus".
- **Failure:** Validasi field error (e.g. "Nama kategori sudah ada") ditampilkan inline di modal.
- **Empty State:** Table menampilkan pesan "Belum ada data [Kategori/Satuan/Pengguna]".

---

## Flow 3 — Katalog & Detail Barang (Admin & Staff)

### Steps
1. User (Admin/Staff) membuka menu **Barang**.
2. Table menampilkan katalog barang dengan pagination, search bar, dan dropdown filter kategori.
3. User dapat mengetik nama/kode barang atau memilih kategori; table langsung memfilter data (debounced search).
4. User mengklik tombol aksi **Lihat** pada baris barang yang dipilih.
5. Sistem membuka **halaman baru** (`/barang/[id]`):
   - **Section Atas:** Card Informasi Barang.
   - **Section Bawah:** Table Riwayat Transaksi khusus barang tersebut.
6. User dapat kembali ke katalog via tombol back / breadcrumb.

- **Success:** Halaman detail ter-render lengkap beserta seluruh log pergerakan stok barang.
- **Failure:** Jika ID barang tidak valid/dihapus, tampilkan error page 404 dengan tombol "Kembali ke Katalog".
- **Empty State Riwayat:** Pada section riwayat transaksi, tampilkan pesan "Belum ada riwayat transaksi untuk barang ini".

---

## Flow 4 — Pencatatan Transaksi Append-Only (Admin & Staff)

### Steps
1. User membuka menu **Transaksi** (`/transaksi`).
2. Table menampilkan daftar mutasi transaksi (read-only, **tanpa tombol Edit atau Hapus**).
3. User mengklik tombol **Tambah Transaksi**.
4. Sistem mengarahkan user ke **Dedicated Page** (`/transaksi/tambah`):
   - Dropdown Jenis Transaksi: `Barang Masuk` atau `Barang Keluar`.
   - Combobox Barang (shadcn) dengan helper text sisa stok di bawahnya.
   - Input Qty, Tanggal Transaksi, dan Keterangan/Catatan.
5. User menekan tombol **Simpan Transaksi**.
6. Sistem memvalidasi:
   - Jika `Barang Keluar`, sistem memvalidasi bahwa Qty tidak boleh melebihi current stock.
7. Transaksi tersimpan, current stock barang terupdate, dan user di-redirect kembali ke `/transaksi`.

- **Success:** Toast "Transaksi berhasil dicatat", row transaksi baru muncul di urutan teratas.
- **Failure:** Jika Qty Barang Keluar > current stock, tampilkan inline error "Jumlah pengeluaran melebihi sisa stok saat ini".
- **Loading State:** Submit button disabled dengan spinner.

---

## Flow 5 — Pengajuan Permintaan Barang (Staff)

### Steps
1. Staff membuka menu **Permintaan Barang** (`/permintaan`).
2. Table menampilkan riwayat pengajuan milik Staff dengan badge status (`Pending`, `Approved`, `Rejected`).
3. Staff mengklik tombol **Tambah Permintaan**.
4. Sistem mengarahkan ke **Dedicated Page** (`/permintaan/tambah`):
   - Combobox Barang (shadcn) dengan helper text sisa stok di bawahnya.
   - Input Jumlah Permintaan (validasi: Qty <= Current Stock).
   - Input Catatan/Keperluan.
5. Staff menekan tombol **Kirim Permintaan**.
6. Sistem memverifikasi data dan menyimpan record dengan status `Pending`.
7. User di-redirect kembali ke `/permintaan`.
8. In-app notification otomatis terkirim ke Admin.

- **Success:** Toast "Permintaan barang berhasil dikirim", status record di table `Pending`.
- **Failure:** Inline error jika kuantitas melebihi current stock atau field wajib kosong.
- **Empty State:** Table menampilkan pesan "Belum ada permintaan barang yang diajukan".

---

## Flow 6 — Approval & Rejection Permintaan Barang (Admin)

### Scenario A: Setujui (Approve) dari Table atau Halaman Detail
1. Admin melihat permintaan berstatus `Pending` pada table `/permintaan` atau halaman detail `/permintaan/[id]`.
2. Admin mengklik tombol **Setujui**.
3. Dialog konfirmasi muncul: "Apakah Anda yakin menyetujui permintaan [Nama Barang] sebanyak [Qty]?".
4. Admin mengklik **Konfirmasi Setujui**.
5. Sistem memproses secara atomic:
   - Status permintaan diupdate menjadi `Approved`.
   - Stock barang terkait otomatis dipotong.
   - Record `Barang Keluar` baru otomatis dibuat pada riwayat Transaksi.
   - In-app notification terkirim ke Staff pemohon.
6. **Hasil Aksi:**
   - Jika dari table: Table me-refresh, badge berubah menjadi hijau (`Approved`), tombol Setujui/Tolak hilang.
   - Jika dari halaman detail: Tetap di halaman detail, badge berubah menjadi hijau (`Approved`), tombol aksi dinonaktifkan, toast feedback sukses muncul.

### Scenario B: Tolak (Reject) dari Table atau Halaman Detail
1. Admin mengklik tombol **Tolak** pada baris table atau di halaman detail `/permintaan/[id]`.
2. Sistem menampilkan **Modal Dialog Alasan Penolakan**:
   - Field Textarea: "Alasan Penolakan" (wajib diisi).
   - Tombol Batal dan Tombol Konfirmasi Tolak.
3. Admin menginput alasan penolakan dan mengklik **Konfirmasi Tolak**.
4. Sistem memvalidasi input alasan tidak boleh kosong.
5. Status permintaan diupdate menjadi `Rejected`, alasan penolakan tersimpan, dan in-app notification dikirim ke Staff.
6. **Hasil Aksi:**
   - Jika dari table: Table me-refresh, badge berubah menjadi merah (`Rejected`).
   - Jika dari halaman detail: Tetap di halaman detail, badge berubah menjadi merah (`Rejected`), box alasan penolakan langsung muncul di card detail, toast feedback muncul.

### Scenario C: Detail Permintaan Barang (Admin & Staff)
1. User mengklik aksi **Detail** pada baris permintaan.
2. Halaman detail terbuka (`/permintaan/[id]`) menampilkan:
   - Informasi Pemohon, Tanggal Pengajuan, Barang, Jumlah, Keperluan/Catatan.
   - Status badge.
   - Jika `Rejected`: Box khusus menampilkan alasan penolakan dari Admin.
   - Jika user adalah `Admin` dan status masih `Pending`: Tersedia tombol aksi **Setujui** dan **Tolak**.

---

## Flow 7 — Pelaporan & Export PDF (Admin Only)

### Steps
1. Admin mengakses menu laporan di sidebar:
   - **Laporan Stok** (`/laporan-stok`): Default menampilkan seluruh stok aktif.
   - **Laporan Transaksi** (`/laporan-transaksi`): Default periode bulan berjalan.
   - **Laporan Permintaan** (`/laporan-permintaan`): Default periode bulan berjalan.
2. Halaman otomatis me-render **Web View** data table laporan sesuai parameter default.
3. Admin dapat menyesuaikan filter (Rentang Tanggal, Kategori, Status, dll.) dan menekan **Terapkan Filter**.
4. Admin menekan tombol **Cetak / Lihat PDF**.
5. Sistem membuka file PDF pada **browser tab baru** (viewer bawaan browser dengan opsi print dan download).

- **Success:** Web view terisi data dan PDF terbuka di tab baru berformat A4 siap cetak.
- **Empty State:** "Tidak ada data pada periode dan filter yang dipilih".
- **Loading State:** Skeleton table saat memuat data; button disabled dengan spinner saat generate URL PDF.

---

## Flow 8 — Dashboard & In-App Notification (Admin & Staff)

### Steps
1. User login dan berada di `/dashboard`.
2. Sistem me-render:
   - KPI Summary Cards sesuai scope role.
   - Visual Charts (Tren Barang Masuk vs Barang Keluar bulanan).
   - Quick Table (5 transaksi terbaru / permintaan terbaru).
3. Saat ada permintaan baru (untuk Admin) atau perubahan status permintaan (untuk Staff), indikator badge merah pada icon lonceng (Header) bertambah.
4. User mengklik icon lonceng:
   - Dropdown notification list terbuka menampilkan daftar notifikasi belum dibaca.
   - User mengklik item notifikasi -> sistem menandai notifikasi sebagai `read` dan langsung me-redirect user ke halaman Detail Permintaan terkait (`/permintaan/[id]`).

- **Success:** User mendapatkan update real-time dan dapat menindaklanjuti permintaan secara instan.
