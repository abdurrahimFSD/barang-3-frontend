<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Coding Agent Instructions

## 1. Project Context

- **Project:** Inventory Management System (`barang-3` Frontend)
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5 + Tailwind CSS v4
- **UI Stack:** Base UI (`@base-ui/react`), Shadcn (`base-nova`), Lucide Icons, `next-themes`
- **State & Data Fetching:** TanStack Query v5 (server cache), Zustand (ephemeral UI), nuqs (URL search params)
- **Purpose:** Single Page / Server-Client hybrid responsive dashboard untuk inventaris barang, input transaksi mutasi, pengajuan & persetujuan barang, serta web viewer laporan & PDF export.
- **Primary Users:** `Admin` dan `Staff`.

---

## 2. Source of Truth

Sebelum melakukan perubahan kode frontend, baca dan ikuti dokumentasi di `docs/`:

- [PRD.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/PRD.md): Spesifikasi produk dan alur approval.
- [UX_FLOWS.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/UX_FLOWS.md): 8 alur interaksi UI, dialog konfirmasi, dan modal alasan tolak.
- [DESIGN.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/DESIGN.md): Palet Cobalt Sapphire + Slate, font Geist Sans & Geist Mono, anti-patterns.
- [ARCHITECTURE.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/ARCHITECTURE.md): Feature-driven folder structure, BFF Route Handlers, thin pages.
- [API.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/API.md): Kontrak endpoint REST API v1 (`/api/v1`).
- [DATABASE.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/DATABASE.md): Spesifikasi skema tabel, relasi, constraints, dan data seed.
- [SECURITY.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/SECURITY.md): RBAC matrix, token cookie HTTP-only, XSS protection.
- [CODE_STYLE.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/CODE_STYLE.md): PascalCase komponen, camelCase hooks, imports ordering.
- [TESTING.md](file:///d:/webdev/be/laravel13-nextjs/barang-3/frontend/docs/TESTING.md): Validasi skema Zod dan static check.

Dilarang membuat kode atau antarmuka yang bertentangan dengan dokumen-dokumen di atas.

---

## 3. Mandatory Terminal Command Execution Rule

> [!CRITICAL]
> **WAJIB KONFIRMASI MANUAL SEBELUM MENJALANKAN PERINTAH TERMINAL:**
> Setiap kali AI / Agent berencana menjalankan perintah terminal apa pun (misalnya `npm install`, `npm run build`, `npm run dev`, `npm run lint`, dll.), **Agent WAJIB meminta konfirmasi terlebih dahulu kepada user**.
> **DILARANG AUTO-RUN** perintah terminal tanpa persetujuan eksplisit dari user.

---

## 4. General Frontend Rules

- **Strict Thin Pages:** File `page.tsx` di `app/` hanya berfungsi sebagai router & layout mount; seluruh UI, hooks, dan skema validasi wajib berada di `features/[domain]/`.
- **Strict State Separation:**
  - Server data cache **hanya** dikelola oleh `TanStack Query v5`. Dilarang menduplikasi data server ke dalam store Zustand.
  - `Zustand` **hanya** digunakan untuk ephemeral UI state (misal: modal buka/tutup, modal alasan penolakan, toggle sidebar mobile).
  - Search keyword, filter kategori, dan pagination **wajib** disinkronkan ke URL menggunakan `nuqs`.
- **Validation on Submit:** React Hook Form dievaluasi **hanya saat tombol submit ditekan** (`mode: 'onSubmit'`). Error backend HTTP 422 dipetakan otomatis ke masing-masing input field.
- **Design System Fidelity:**
  - Font wajib: `Geist Sans` dan `Geist Mono` (`tabular-nums` untuk angka/SKU/nominal). **Font Inter dilarang keras**.
  - Dilarang menggunakan emoji di UI; gunakan icon `lucide-react`.
  - Warna aksen: Cobalt Sapphire (`#2563EB`) dengan Slate neutrals.
- **Server vs Client Boundary:** Komponen default adalah Server Components; tambahkan direktif `'use client'` hanya saat menggunakan React hooks, form, atau browser event listener.
- **BFF Proxy & API Client:** Pemanggilan endpoint backend dari browser wajib menggunakan relative path `/api/v1/...` melalui BFF Catch-All Proxy (`app/api/v1/[...path]/route.ts`) yang otomatis menyematkan Sanctum Bearer token dari HTTP-only cookie.
- **Next.js 16 Route Guard:** Proteksi route RBAC wajib menggunakan `proxy.ts`. Konvensi `middleware.ts` telah di-deprecated pada Next.js 16 dan dilarang dibuat berdampingan dengan `proxy.ts`.

---

## 5. Planning & Implementation Workflow

1. Periksa file referensi di `docs/`.
2. Identifikasi file yang terdampak dan dependensinya.
3. Ajukan rencana perubahan yang ringkas dan tepat sasaran.
4. Jika membutuhkan eksekusi perintah terminal, **minta persetujuan user terlebih dahulu**.
5. Terapkan kode dengan fokus dan konsisten terhadap konvensi arsitektur.

---

## 6. Validation & Definition of Done

Tugas dianggap selesai hanya jika:
- UI dan alur interaksi sesuai dengan `UX_FLOWS.md` dan `DESIGN.md`.
- TypeScript typecheck (`npm run typecheck`) dan ESLint (`npm run lint`) bersih dari error setelah dikonfirmasi dan dijalankan.
- Tidak ada file yang diubah di luar kebutuhan tugas.
- Pengujian build Next.js (`npm run build`) berhasil tanpa error kompilasi.
