# Inventory Management System — Frontend Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwindcss&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?style=flat&logo=reactquery&logoColor=white)
![UI](https://img.shields.io/badge/UI-Base_UI_%7C_Shadcn-black?style=flat)
![State](https://img.shields.io/badge/State-Zustand_v5-brown?style=flat)
![Validation](https://img.shields.io/badge/Validation-Zod_v4-3E67B1?style=flat&logo=zod&logoColor=white)

Single Page / Server-Client hybrid responsive dashboard powering the client interface of the Inventory Management System. Built with **Next.js 16 (App Router)** and **React 19**, this frontend delivers reactive inventory tracking, atomic stock mutation interfaces, request & approval workflows, PDF report previews, and real-time polling notifications.

---

## Key Features

- **Role-Based Access Control (RBAC):** Guarded at the edge via Next.js 16 `proxy.ts`, isolating `Admin` operations (master data CRUD, request approval/rejection, user management, reports) from `Staff` operations (stock transactions, item request submissions).
- **Feature-Driven Architecture & Strict Thin Pages:** Clean separation where App Router pages (`app/`) only mount isolated domain views (`features/[domain]/`), keeping routing decoupled from business logic.
- **Reactive Server State & Polling:** TanStack Query v5 managing server cache, background revalidation, auto-invalidation on mutations, and 30-second interval polling for in-app notifications.
- **URL-Driven State Synchronization:** `nuqs` syncing pagination, 300ms debounced search, and category filters directly with URL query parameters for shareable states.
- **Zero-Interruption Form Validation:** React Hook Form (`mode: 'onSubmit'`) paired with Zod schemas, with seamless backend HTTP 422 error mapping to individual inputs.
- **BFF Catch-All Proxy & Secure Token Lifecycle:** Browser requests target relative `/api/v1/[...path]` routes; the Next.js Route Handler injects the Sanctum Bearer token stored in an HTTP-only cookie, mitigating XSS risks.
- **Modern Precision Design System:** Industrial enterprise theme using Cobalt Sapphire (`#2563EB`) accent, Slate neutrals, Geist Sans & Geist Mono fonts, and dark/light mode toggle via `next-themes`.

---

## System Requirements

- **Node.js:** `^20.x` or `24.x` (Developed & tested on **Node.js 24.22.1**)
- **Package Manager:** **npm 11.19.1** (or compatible `npm 10.x+` / `pnpm` / `yarn`)
- **Backend REST API:** Running Laravel 13 backend at `http://localhost:8000/api/v1`

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <frontend-repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the template configuration file to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment variables in `.env.local`:
```env
INTERNAL_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME="Inventory Management System"
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `INTERNAL_API_URL` | Upstream Laravel REST API v1 endpoint accessed by the BFF Proxy | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_NAME` | Application name displayed across the UI header and metadata | `"Inventory Management System"` |

### 4. Start Development Server
```bash
npm run dev
```
The application will be running at `http://localhost:3000`.

---

## Default Seeded Credentials

When connecting to the seeded backend database (`php artisan migrate --seed`), use the following accounts to test the RBAC interfaces:

| Role | Email | Password | Scope of Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@inventory.local` | `password` | Full CRUD on Master Data, Item Catalog, Approval Workflow, and PDF Reports |
| **Staff** | `lukaku@inventory.local` | `password` | View Catalog, Log Stock Mutations, Submit Item Requests, View Notifications |
| **Staff** | `haaland@inventory.local` | `password` | View Catalog, Log Stock Mutations, Submit Item Requests, View Notifications |

---

## Architecture & Data Flow

The frontend operates as a Decoupled Client-Server application leveraging a **Backend-For-Frontend (BFF)** proxy pattern for authenticated communication:

```text
[ Browser Client ]
  │
  ├── UI Components (Base UI / Shadcn / Lucide)
  ├── URL State Synchronization (nuqs)
  ├── Client UI State (Zustand: Modals & Confirmation dialogs)
  └── Server State & Cache (TanStack Query v5)
        │
        ▼ (Same-Origin Fetch: /api/v1/...)
[ Next.js Server-Side BFF Proxy ]
  │
  ├── proxy.ts (Next.js 16 Edge Route Guard: RBAC & Cookie Session Check)
  └── /app/api/v1/[...path]/route.ts (Injects Sanctum Bearer token from HTTP-only cookie)
        │
        ▼ (Upstream REST API Request: Authorization: Bearer <token>)
[ Laravel 13 REST API Backend ] (http://localhost:8000/api/v1)
```

---

## Directory Structure

```text
frontend/
├── app/                              # Next.js App Router (Routing & Thin Pages)
│   ├── (auth)/login/page.tsx         # Login authentication route
│   ├── (dashboard)/                  # Protected application shell & routes
│   │   ├── layout.tsx                # App shell layout (AppSidebar, AppHeader)
│   │   ├── error.tsx                 # Centralized dashboard error boundary
│   │   ├── dashboard/                # Metrics overview & stock analytics
│   │   ├── barang/                   # Inventory catalog (list, create, detail, edit)
│   │   ├── kategori/ & satuan/       # Master categories & units (Admin only)
│   │   ├── pengguna/                 # User management (Admin only)
│   │   ├── transaksi/                # Inbound & outbound stock mutation records
│   │   ├── permintaan/               # Item requests & approval workflow
│   │   └── laporan-*/                # Stock, transaction, & request reports
│   ├── api/
│   │   ├── auth/[login|logout|me]/   # Session bridge & HTTP-only cookie handlers
│   │   └── v1/[...path]/route.ts     # BFF Catch-All Proxy to Laravel API
│   ├── globals.css                   # Tailwind CSS v4 variables & theme config
│   └── layout.tsx                    # Root layout (Providers, Theme, Geist font)
├── features/                         # Feature-driven domain modules
│   ├── auth/                         # Login forms, mutation hooks, and schemas
│   ├── barang/                       # Catalog views, data tables, CRUD hooks
│   ├── dashboard/                    # KPI cards, activity feed, low-stock alerts
│   ├── laporan/                      # Date range filters, PDF previews, data export
│   ├── master/                       # CRUD categories, units, and users
│   ├── notifications/                # NotificationBell, popover list, polling hooks
│   ├── permintaan/                   # Request forms, approval dialog, rejection modal
│   └── transaksi/                    # Mutation ledger tables, forms, hooks
├── components/                       # Shared reusable components
│   ├── layout/                       # AppSidebar, AppHeader, UserNav
│   ├── shared/                       # DataTablePagination, ConfirmDialog, TableSkeleton
│   ├── ui/                           # Base UI & Shadcn primitives (Button, Dialog, Table, etc.)
│   └── providers.tsx                 # TanStack QueryClientProvider, NuqsAdapter, Toaster
├── hooks/                            # Global utilities (useCurrentUser, useDebounce, use-mobile)
├── stores/                           # Ephemeral UI state via Zustand (useModalStore.ts)
├── lib/                              # api-client.ts (fetch wrapper), formatters, utils
├── types/                            # TypeScript interfaces & API response envelopes
├── docs/                             # Engineering and architectural specifications
└── proxy.ts                          # Next.js 16 route guard & RBAC validation
```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles and optimizes the production build |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint to check for code style and syntax issues |
| `npm run typecheck` | Validates TypeScript types across the codebase (`tsc --noEmit`) |
| `npm run format` | Automatically formats TypeScript and TSX files with Prettier |

---

## Technical Specifications & Documentation

Comprehensive architectural and engineering specifications are maintained in the repository:

### Engineering Specifications (`docs/`)
- [PRD.md](docs/PRD.md) — Product requirements document, user personas, problem statement, and acceptance criteria.
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — Decoupled system architecture, layer boundaries, and technology rationale.
- [DATABASE.md](docs/DATABASE.md) — 7-table schema, indexing strategy, foreign keys, and integrity constraints.
- [API.md](docs/API.md) — Complete endpoint reference, payload contracts, status codes, and query parameters.
- [CODE_STYLE.md](docs/CODE_STYLE.md) — Coding conventions, thin controller patterns, and feature module boundaries.
- [SECURITY.md](docs/SECURITY.md) — Sanctum authentication flow, RBAC matrix, and token lifecycle security.
- [TESTING.md](docs/TESTING.md) — Test strategy, critical path coverage, and static typecheck validation.
- [DESIGN.md](docs/DESIGN.md) — Design system specifications, color tokens, and layout guidelines.
- [UX_FLOWS.md](docs/UX_FLOWS.md) — User interaction flows, loading states, and error handling behaviors.

### AI Agent Guidelines
- [AGENTS.md](AGENTS.md) — Coding conventions and environment rules for AI coding assistants.
- [CLAUDE.md](CLAUDE.md) — Setup guidelines and prerequisites for Claude code agent.

---

## License

This project is open-sourced software licensed under the [MIT License](LICENSE).
