# Design System: Inventory Management System

## 1. Visual Theme & Atmosphere

- **Mood & Atmosphere:** Modern Precision Dashboard. Antarmuka bertema industrial enterprise yang taktil, presisi, bersih, dan fungsional. Menghindari tampilan default template yang kaku dengan menghadirkan kedalaman visual melalui *diffused whisper borders*, subtle layered surfaces, dan singular Cobalt Sapphire accent.
- **Density:** `Cockpit Balanced` (6.5/10) — Terstruktur rapi untuk pemindaian data tabel dan KPI logistik secara cepat tanpa terasa sesak.
- **Variance:** `Offset Asymmetric` (6/10) — Grid kartu analitik variatif, layout hierarkis terarah, dan pemisahan zona aksi yang tegas.
- **Motion:** `Fluid CSS & Spring Tactility` (6/10) — Transisi responsif berbasis spring physics, mikro-interaksi tombol taktil, dan reveal cascading halus pada data grid.

---

## 2. Color Palette & Roles

Sistem warna menggunakan palet presisi berbasis Slate dengan aksen tunggal **Cobalt Sapphire** (Saturasi < 80%, bebas efek neon/ungu). Mendukung penuh Light Mode dan Dark Mode via `next-themes`.

### A. Primary Accent & Interaction
- **Cobalt Sapphire** (`#2563EB` / `oklch(0.55 0.22 255)`) — Primary action, CTA buttons, active sidebar link, dan focus rings.
- **Deep Cobalt Hover** (`#1D4ED8` / `oklch(0.48 0.24 255)`) — Hover state tombol primary.
- **Cobalt Whisper Glow** (`rgba(37, 99, 235, 0.12)`) — Active pill background, focus indicator outline.

### B. Neutrals (Light Mode)
- **Slate Canvas** (`#F8FAFC` / `oklch(0.985 0.005 240)`) — Background halaman utama.
- **Pure Surface** (`#FFFFFF` / `oklch(1 0 0)`) — Background card, popover, modal dialog, dan dropdown container.
- **Charcoal Ink** (`#0F172A` / `oklch(0.18 0.02 260)`) — Primary text & headline. *(BANNED: Pure Black #000000)*.
- **Muted Slate** (`#64748B` / `oklch(0.55 0.02 250)`) — Secondary text, labels, metadata, placeholder.
- **Whisper Slate Border** (`#E2E8F0` / `oklch(0.92 0.008 240)`) — Garis batas card, table divider 1px, separator.

### C. Neutrals (Dark Mode)
- **Obsidian Canvas** (`#090D16` / `oklch(0.12 0.02 260)`) — Background utama dark mode.
- **Deep Slate Void** (`#111827` / `oklch(0.18 0.02 260)`) — Surface card, modal, sidebar container.
- **Bright Slate** (`#F8FAFC` / `oklch(0.98 0.005 240)`) — Primary text & headline.
- **Subtle Slate** (`#94A3B8` / `oklch(0.70 0.02 250)`) — Secondary text & metadata.
- **Subtle Dark Border** (`rgba(255, 255, 255, 0.08)`) — 1px structural borders pada dark mode.

### D. Semantic Functional Colors
- **Emerald Mint (Approved / Masuk / Success):** `#059669` (Dark: `#10B981`) — Badge status Disetujui, mutasi Barang Masuk.
- **Warm Amber (Pending / Warning):** `#D97706` (Dark: `#F59E0B`) — Badge status Menunggu Approval, indikator low stock.
- **Crimson Rose (Rejected / Destructive):** `#E11D48` (Dark: `#F43F5E`) — Badge status Ditolak, aksi destructive, pesan error validasi.

---

## 3. Typography Architecture

Mengikuti standar `stitch-design-taste`: **Font `Inter` dan generic serif dilarang (BANNED)** untuk menciptakan karakter modern enterprise.

- **Primary Display & Body Font:** `Geist Sans` (`var(--font-sans)`)
  - **Headings (H1–H3):** `tracking-tight font-semibold`. Hierarki dibentuk melalui weight dan kontras warna (bukan sekadar ukuran besar).
  - **Body Text:** `text-sm` (14px) dan `text-base` (16px), relaxed leading (`leading-relaxed`), optimal panjang baris maksimal 65 karakter (`max-w-[65ch]`).
- **Data & Numeric Monospace Font:** `Geist Mono` (`var(--font-mono)`)
  - **Aturan Wajib:** Seluruh angka kuantitas stok, ID barang/SKU, kode transaksi, timestamp tanggal, dan kalkulasi dashboard **wajib** menggunakan `font-mono tabular-nums` untuk perataan angka vertikal yang presisi.

---

## 4. Component Stylings (Base UI & Shadcn)

Komponen dibangun menggunakan `@base-ui/react` primitives dan `shadcn` base-nova dengan styling custom non-kaku.

### A. Buttons (`@base-ui/react/button`)
- **Primary:** Background Cobalt Sapphire (`#2563EB`), text putih, font-medium, padding presisi (`h-9 px-4`).
- **Tactile Feedback:** Efek tekan fisik `-1px` translate saat aktif (`active:translate-y-px`).
- **Banned:** Tidak menggunakan outer glow neon atau bayangan ungu.
- **Secondary / Outline:** Background transparan / surface, border `Whisper Slate`, hover background `bg-slate-100 dark:bg-slate-800/60`.
- **Destructive:** Soft crimson tint (`bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20`).

### B. Cards & Metric Containers
- **Border & Corner:** Sudut membulat `rounded-xl` (`0.75rem` / `12px`), border halus `1px solid var(--border)`.
- **Elevation:** Diffused soft shadow (`shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]`), tidak ada drop-shadow tebal.
- **KPI Card:** Menampilkan icon Lucide dalam rounded box soft-tinted, headline metric dalam `font-mono text-2xl font-bold`, dan trend micro-badge.

### C. Data Tables & Data Grids
- **Header:** Sticky top header dengan subtle backdrop blur, teks uppercase ringan (`text-xs font-semibold text-muted-foreground tracking-wider`).
- **Rows:** Tinggi baris konsisten (`h-12`), divider bawah 1px, hover highlight (`hover:bg-slate-50/70 dark:hover:bg-slate-800/40`).
- **Status Pills:** Compact rounded-full pill dengan dot indikator (contoh: status Pending dengan latar amber soft dan teks amber pekat).
- **Empty State:** Container bersih dengan icon Lucide netral dan pesan teks informatif, **tanpa tombol duplikat** di dalam table body.

### D. Forms & Inputs
- **Layout:** Label berada tepat di atas input (`text-xs font-medium text-slate-700 dark:text-slate-300`).
- **Input Field:** `h-9` rounded-lg, border `Whisper Slate`, placeholder warna muted.
- **Focus State:** `ring-2 ring-blue-500/20 border-blue-600 outline-none transition-all`.
- **Validation Error:** Inline error message merah di bawah input (`text-xs text-rose-500 mt-1`).

### E. Modals & Dialogs (`@base-ui/react/dialog`)
- **Backdrop:** Smooth backdrop blur (`backdrop-blur-sm bg-slate-950/40`).
- **Surface:** Card elevasi tinggi dengan whisper border, exit on Escape, dan accessible focus trap.

---

## 5. Layout & Responsive Architecture

- **Viewport Standard:** Menggunakan `min-h-[100dvh]` (menghindari bug kalkulasi `h-screen` pada browser mobile).
- **Desktop Layout (> 1024px):**
  - Left Sidebar: Lebar tetap `260px`, fixed border-r, berisi logo aplikasi, navigasi menu hierarkis, dan user profile pill.
  - Header: Sticky top bar `h-16`, search bar global cepat, theme toggle shortcut (`d`), dan icon lonceng notifikasi dengan counter badge.
  - Main Area: Container responsive dengan batas maksimal `max-w-7xl mx-auto p-6 md:p-8`.
- **Tablet Layout (768px – 1024px):**
  - Grid card analitik otomatis beradaptasi menjadi 2 kolom (`grid-cols-2`).
  - Table menggunakan horizontal scroll halus yang terisolasi di dalam container table.
- **Mobile Layout (< 768px):**
  - Single-column collapse (`grid-cols-1`).
  - Sidebar desktop tersembunyi, digantikan oleh slide-over Sheet drawer via tombol burger menu pada Header.
  - Touch target seluruh tombol dan elemen interaktif minimal `44px x 44px`.

---

## 6. Motion Philosophy & Micro-Interactions

- **Spring Physics:** Transisi transisi modal dan popover menggunakan parameter spring alami (`stiffness: 100, damping: 20`).
- **Cascade Delays:** Render list data table dan KPI cards menggunakan staggered transition halus saat initial load.
- **Perpetual Micro-Interactions:**
  - Notification badge berdenyut halus (subtle pulse) saat terdapat permintaan pending baru.
  - Button state menampilkan spinner terintegrasi dan disabled state saat submit transaksi/approval.
- **Performance:** Seluruh animasi dieksekusi melalui GPU-accelerated properties (`transform` dan `opacity`). Dilarang meng-animasi `height` atau `width` secara langsung.

---

## 7. Anti-Patterns (Banned AI Tells)

1. **NO Emojis:** Dilarang keras menggunakan emoji di seluruh UI. Gunakan icon `lucide-react` secara konsisten.
2. **NO Inter Font:** Dilarang menggunakan font `Inter` bawaan. Wajib menggunakan `Geist Sans` dan `Geist Mono`.
3. **NO Pure Black (`#000000`):** Gunakan Charcoal Ink (`#0F172A`) atau Obsidian Canvas (`#090D16`).
4. **NO Neon / Purple Glows:** Dilarang menggunakan shadow ungu atau neon border glow khas template AI.
5. **NO Equal 3-Column Card Cliché:** Gunakan variasi grid bermakna (misal: 4-column metric atau split asymmetric view).
6. **NO Filler / Cliché Copywriting:** Hindari kata-kata kosong seperti "Seamless experience", "Elevate inventory", atau "Next-gen". Gunakan label aksi yang lugas ("Simpan Transaksi", "Setujui Permintaan").
7. **NO Duplicate Empty State Buttons:** Sesuai UX_FLOWS, empty state tabel tidak menduplikasi tombol aksi yang sudah tersedia di atas table.

---

## 8. Frontend Implementation Blueprint

Penyesuaian konfigurasi teknis pada codebase:

1. **`app/layout.tsx`:** Mengganti import `Inter` menjadi `Geist` dari `next/font/google`:
   ```tsx
   import { Geist, Geist_Mono } from "next/font/google"
   const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
   const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
   ```
2. **`app/globals.css`:** Memetakan CSS variables `--primary` ke palet Cobalt Sapphire (`oklch(0.55 0.22 255)`) dan border ke Slate tint, sehingga seluruh komponen Base UI & Shadcn secara otomatis menggunakan tema baru.
3. **`components.json`:** Tetap mempertahankan base style `base-nova` dengan icon library `lucide` dan utility `cn`.
4. **`components/theme-provider.tsx`:** Mendukung transisi tema instan tanpa flicker (`disableTransitionOnChange`) serta hotkey keyboard shortcut `d` untuk beralih mode Light/Dark.
