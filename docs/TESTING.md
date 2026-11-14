# Testing Strategy & Guidelines

## 1. Testing Goals
Fokus pengujian diarahkan pada fungsi kritis bisnis untuk menjamin integritas data stok dan keamanan hak akses:
1. **Atomic Approval Workflow:** Persetujuan permintaan barang wajib memotong stok dan membuat record `Barang Keluar` secara atomic dalam satu transaksi database.
2. **Immutability of Transactions:** Verifikasi bahwa record transaksi tidak dapat diubah (`PUT`/`PATCH`) atau dihapus (`DELETE`) via API.
3. **Non-Negative Stock Constraints:** Validasi bahwa pengeluaran barang dan pengajuan permintaan ditolak jika kuantitas melebihi sisa stok aktif.
4. **Role-Based Access Control (RBAC):** Memastikan role `Staff` menerima HTTP `403 Forbidden` saat mencoba mengakses route Admin (Master Data, Approval, Laporan).
5. **Report & PDF Generation:** Memastikan query agregasi laporan akurat dan endpoint stream PDF mengembalikan binary `application/pdf` dengan status HTTP `200 OK`.

---

## 2. Test Architecture & Tools

| Layer | Tools | Scope |
| :--- | :--- | :--- |
| **Backend Unit & Feature** | **Pest PHP 5** (`pestphp/pest`) | API Endpoints, Form Requests, Services, Eloquent Models, Policies |
| **Backend Test DB** | Dedicated MySQL Test DB (`crud_barang_3_test`) | Konsistensi penuh dialect MySQL, row locking (`FOR UPDATE`), dan foreign key constraints via `RefreshDatabase` |
| **Frontend Static Quality** | **TypeScript 5** + **ESLint 9** | Type safety (`tsc --noEmit`) dan code quality (`eslint`) |
| **Frontend Unit / Component**| **Vitest** + **React Testing Library** | Validasi skema Zod, format utility, dan interaksi form component |
| **End-to-End (E2E)** | **Playwright** | Critical user journeys (Login $\rightarrow$ Mutasi Transaksi $\rightarrow$ Approval Permintaan) |

---

## 3. Test File Structure

### 3.1 Backend (`backend/tests/`)
```text
backend/tests/
├── Feature/
│   ├── Auth/
│   │   └── LoginTest.php             # Login rate limiting, invalid credentials, token issuing
│   ├── Master/
│   │   ├── CategoryTest.php          # CRUD & Restrict on delete
│   │   ├── UnitTest.php
│   │   └── UserTest.php
│   ├── Item/
│   │   └── ItemCatalogTest.php       # Search, filter, stock history
│   ├── Transaction/
│   │   └── TransactionMutationTest.php # In/out mutation, stock validation, immutable check
│   ├── ItemRequest/
│   │   ├── SubmitRequestTest.php     # Staff submission & quantity validation
│   │   └── ApprovalWorkflowTest.php  # Atomic approve (auto-deduct) & reject with reason
│   ├── Report/
│   │   └── ReportTest.php            # Date filter aggregation & binary PDF stream
│   └── Notification/
│       └── NotificationPollingTest.php # Unread count & mark as read
├── Unit/
│   └── Services/
│       ├── StockCalculationTest.php  # Pure stock math logic
│       └── CodeGeneratorTest.php     # SKU and transaction code formats
├── TestCase.php
└── Pest.php
```

### 3.2 Frontend (`frontend/__tests__/` atau collocated)
```text
frontend/
├── features/
│   ├── barang/schemas/__tests__/barangSchema.test.ts
│   └── permintaan/schemas/__tests__/permintaanSchema.test.ts
└── lib/__tests__/
    └── formatters.test.ts            # Currency format, date format
```

---

## 4. Critical Test Scenarios

### Scenario A: Immutability of Transactions
- **Target File:** `backend/tests/Feature/Transaction/TransactionMutationTest.php`
- **Action:** Request `PUT`, `PATCH`, atau `DELETE` ke endpoint `/api/v1/transactions/{id}`.
- **Expectation:** Return HTTP `405 Method Not Allowed`. Record transaksi mutasi bersifat *immutable* dan tidak dapat diubah atau dihapus via API.

### Scenario B: Atomic Approval & Stock Deduction
- **Target File:** `backend/tests/Feature/ItemRequest/ApprovalWorkflowTest.php`
- **Action:** Admin memanggil endpoint `POST /api/v1/item-requests/{id}/approve`.
- **Expectation:**
  - Status `item_request` berubah menjadi `approved`.
  - Stok barang berkurang secara atomic sesuai kuantitas yang diajukan.
  - Record baru pada tabel `transactions` (type: `keluar`) otomatis terbentuk dengan referensi `item_request_id`.

### Scenario C: RBAC Protection on Admin Routes
- **Target File:** `backend/tests/Feature/Master/CategoryTest.php`
- **Action:** User dengan role `staff` mengakses endpoint master data (e.g., `GET` / `POST` `/api/v1/categories`).
- **Expectation:** Return HTTP `403 Forbidden`.

---

## 5. Execution Commands

### Backend
```bash
# Menjalankan seluruh test suite Pest
php artisan test

# Menjalankan test tertentu dengan filter nama
./vendor/bin/pest --filter=ApprovalWorkflowTest

# Menjalankan code style fixer
./vendor/bin/pint
```

### Frontend
```bash
# Type-check TypeScript tanpa emit file
npm run typecheck

# Linting kode Next.js
npm run lint

# Formatting kode dengan Prettier
npm run format
```

---

## 6. Definition of Done (DoD) for Testing
- [ ] 100% critical test scenarios (Approval atomicity, transaction immutability, RBAC) lulus pengujian.
- [ ] Tidak ada warning linting pada `npm run lint` dan `./vendor/bin/pint`.
- [ ] TypeScript typecheck (`npm run typecheck`) bersih tanpa type error (`0 errors`).
- [ ] Tidak ada query N+1 pada endpoint list data yang telah diuji.
