# Code Style & Conventions

## 1. General Principles
- **Clarity over Cleverness:** Utamakan kode yang eksplisit, mudah dibaca, dan mudah dipelihara.
- **Single Responsibility:** Setiap fungsi, class, dan komponen hanya menangani satu tanggung jawab logis.
- **Thin Controllers & Thin Routers:** Logika bisnis berada di Service layer (backend) atau Domain features/hooks (frontend).
- **Zero Dead Code:** Hapus import yang tidak digunakan, variabel tak terpakai, dan kode yang di-comment out.

---

## 2. Naming Conventions

### 2.1 Frontend (TypeScript & Next.js 16)
- **Components:** PascalCase (contoh: `BarangTable.tsx`, `LoginForm.tsx`, `KpiCards.tsx`).
- **Hooks:** camelCase dengan prefix `use` (contoh: `useBarangList.ts`, `useModalStore.ts`, `useDebounce.ts`).
- **Utilities & Helpers:** kebab-case atau camelCase (contoh: `api-client.ts`, `query-client.ts`, `utils.ts`).
- **Schemas:** camelCase dengan akhiran `Schema` (contoh: `barangSchema.ts`, `authSchema.ts`).
- **Interfaces & Types:** PascalCase (contoh: `Item`, `Transaction`, `ApiResponse<T>`).
- **Variables & Functions:** camelCase (contoh: `isLoading`, `handleSubmit`, `formatRupiah`).
- **Constants:** UPPER_SNAKE_CASE (contoh: `DEFAULT_PAGE_SIZE = 10`, `NOTIFICATION_POLL_INTERVAL = 30000`).

### 2.2 Backend (PHP 8.5 & Laravel 13)
- **Controllers:** PascalCase dengan suffix `Controller` (contoh: `ItemController.php`).
- **Services:** PascalCase dengan suffix `Service` (contoh: `ItemService.php`, `ItemRequestService.php`).
- **Models:** Singular PascalCase (contoh: `Item.php`, `Category.php`, `Transaction.php`).
- **Form Requests:** PascalCase dengan prefix aksi dan suffix `Request` (contoh: `StoreItemRequest.php`, `RejectItemRequestRequest.php`).
- **API Resources:** PascalCase dengan suffix `Resource` (contoh: `ItemResource.php`, `TransactionResource.php`).
- **Methods & Functions:** camelCase (contoh: `approveRequest()`, `calculateStock()`).
- **Database Fields & FK:** snake_case (contoh: `category_id`, `minimum_stock`, `created_at`).
- API Routes: English kebab-case plural (contoh: /api/v1/item-requests, /api/v1/reports/stock). URL berbahasa Indonesia hanya digunakan untuk client routing frontend.

---

## 3. Project & Folder Architecture

### 3.1 Frontend (`frontend/`) — Feature-Driven
- Direktori `app/` dijaga tetap tipis (*thin pages*), hanya mengorkestrasi routing dan layout.
- Seluruh komponen presentasi, custom hooks, dan validasi form Zod dikelompokkan per modul domain di `features/` (misal: `features/barang/components/`, `features/barang/hooks/`).
- Komponen bersama (*shared*) diletakkan di `components/ui/` (primitif Base UI & Shadcn) dan `components/shared/` (DataTable, StatusBadge, EmptyState).

### 3.2 Backend (`backend/`) — Service Layer Pattern
- **Controller:** Hanya memvalidasi request via Form Request dan mengembalikan ApiResponse. Tidak ada query database mentah atau kalkulasi bisnis di Controller.
- **Service Layer:** Menangani transaksi atomic (`DB::transaction`), kalkulasi stok, dan orkestrasi model.
- **Form Request:** Seluruh aturan validasi backend dipusatkan pada dedicated request classes.

---

## 4. Component & State Guidelines (React 19 & Next.js 16)
- **Server vs Client Boundary:** Gunakan Server Components secara default; gunakan direktif `'use client'` hanya jika komponen membutuhkan hooks, event listeners (`onClick`, `onChange`), atau state antarmuka.
- **State Separation:**
  - **Server Cache:** Dikelola secara eksklusif oleh `TanStack Query v5` (optimistic updates, query keys `['items']`).
  - **UI Ephemeral State:** Dikelola oleh `Zustand` (modal open/close, reject modal reason, mobile drawer).
  - **URL Query State:** Dikelola oleh `nuqs` (pagination, category filter, debounced search).
- **Form Validation:** React Hook Form dievaluasi **hanya saat submit** (`mode: 'onSubmit'`). Error backend HTTP 422 dipetakan otomatis ke form fields via `setError`.

---

## 5. Imports Ordering & Aliases
Impor kode dikelompokkan dengan urutan berikut (dipisahkan satu baris kosong):
1. React & Next.js core (`react`, `next/navigation`, `next/link`)
2. Third-party packages (`@tanstack/react-query`, `lucide-react`, `zod`, `zustand`)
3. Internal feature & shared components (`@/features/...`, `@/components/...`)
4. Internal hooks & stores (`@/hooks/...`, `@/stores/...`)
5. Utilities & types (`@/lib/...`, `@/types/...`)

---

## 6. Error Handling
- **Backend:**
  - Seluruh API response menggunakan envelope terstandar (`ApiResponse` trait).
  - Validasi gagal mengembalikan HTTP `422 Unprocessable Content`.
  - Kesalahan bisnis (misal stok tidak cukup) melempar exception yang ditangkap handler dan dikonversi ke JSON ramah pengguna (bukan stack trace mentah).
- **Frontend:**
  - `api-client.ts` secara otomatis menormalisasi pesan kesalahan HTTP.
  - Tangani error API menggunakan Toast notification merah dan pesan error inline di bawah input form.

---

## 7. Tooling, Formatting, & Linting

### Frontend
- **Linter:** ESLint 9 (`npm run lint`)
- **Formatter:** Prettier dengan Tailwind CSS class sorting plugin (`npm run format`)
- **Type Checker:** TypeScript 5 (`npm run typecheck` / `tsc --noEmit`)

### Backend
- **Code Formatter & Style Fixer:** Laravel Pint (`./vendor/bin/pint` menggunakan preset default `laravel`)
- **Testing:** Pest PHP 5 (`php artisan test` atau `./vendor/bin/pest`)
- **Static Analysis:** PHPStan / Pint checks

---

## 8. Anti-Patterns & Banned Practices
- ❌ **Dilarang `PUT`/`PATCH`/`DELETE` pada transaksi:** Mutasi transaksi bersifat append-only.
- ❌ **Dilarang menggunakan font `Inter` atau emoji:** Wajib menggunakan `Geist Sans` & `Geist Mono` serta icon `lucide-react`.
- ❌ **Dilarang mencampur server data ke Zustand:** Cache data API hanya boleh disimpan di TanStack Query.
- ❌ **Dilarang query DB di dalam Blade/Controller:** Seluruh data access dilakukan via Eloquent/Repository di Service layer.
