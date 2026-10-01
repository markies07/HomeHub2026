# 🏡 HomeHub 2026 — Modern Property & Apartment Management System

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.4-ff69b4?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

> **HomeHub 2026** is an end-to-end, high-performance apartment rental and property management platform built for modern landlords, property managers, and residents in **Cavite, Philippines**. 
> 
> Engineered as a ground-up modernization of traditional PHP/MySQL property systems into a reactive, animated cloud application powered by **Next.js 16 (App Router & Turbopack)**, **Google Cloud Firestore**, and **Framer Motion**.

---

## 🌟 Key Highlights

- **🏢 Multi-Role Ecosystem**: Tailored portals for **Super Admin (Property Owner)**, **Admin (Property Staff / Manager)**, and **Tenants (Residents)**.
- **⚡ Reactive Cloud Architecture**: Live synchronization with Google Cloud Firestore paired with offline-capable LocalStorage fallback for zero-latency UI responses.
- **✨ Fluid Micro-Interactions**: Custom tab-loading glow progress bars, spring-damped sliding pill indicators (`layoutId`), staggered metric card reveals, and smooth cross-fade view transitions.
- **📱 Fully Responsive**: Flawless experience across desktop monitors, tablets, and mobile devices with dedicated bottom navigation and responsive drawer sheets.
- **🎨 Heritage Design Assets**: Integrates authentic, iconic HomeHub assets (`owner.png`, `tenant.png`, `homehub-icon.png`) for an intuitive, personalized feel.

---

## 🚀 Portals & Core Modules

### 1. 🌐 Public Landing & Unit Directory (`/`)
* **Hero Showcase**: Ambient background orbs, live Cavite availability pill, and staggered call-to-actions.
* **Interactive Spotlight Residence**: Cross-fades unit specs, pricing, and high-resolution photo galleries via `AnimatePresence`.
* **Dynamic Property Filtering**: Instant filtering by availability status (*All*, *Available*, *Occupied*), price ceiling popover, and room configuration.
* **Property Detail Modals**: Lightbox inspection of unit amenities, inclusions, square footage, and direct rental inquiry triggers.

### 2. 👑 Owner Dashboard — Super Admin (`/dashboard`)
* **Portfolio Valuation**: Real-time gross annual earnings, monthly cash collections, and total asset tracking.
* **12-Month Interactive Cash Flow**: Animated bar chart comparing gross rental income, operating expenses, and net profit retention with monthly inspection tooltips.
* **Unit Directory & Inventory (`/dashboard/units`)**:
  * Visual status badges (*Available*, *Occupied*, *Under Maintenance*).
  * Unit detail view (*houseInfo*) featuring specifications, photo gallery management (add photos, remove photos, set cover photo), and tenant assignment.
  * Direct tenant contract termination and full lease records.
* **Tenant Registry (`/dashboard/tenants`)**:
  * Complete directory with occupancy counters, security deposit records, lease validity periods, and emergency contacts.
  * One-click tenant onboarding with instant unit association.
* **Financial Ledger & Receipts (`/dashboard/payments`)**:
  * Filterable payment transaction history across modes of payment (**GCash**, **Maya**, **Bank Transfer**, **Cash**, **Deposit Deduction**).
  * Automated official digital receipt generation with printable/exportable layout.
* **Role & Access Control (`/dashboard/accounts`)**:
  * Manage owner, staff manager, and resident credentials with active role filtering tabs.
* **Centralized Communications (`/dashboard/chat`)**:
  * Unified resident messaging channels categorized by unit numbers with unread notification badges.

### 3. 🛡️ Staff / Property Manager Portal (`/dashboard`)
* Filtered operational view tailored for daily property management.
* Collects rents, logs transactions, schedules unit maintenance, and addresses tenant requests.

### 4. 🔑 Resident Portal (`/tenant-portal`)
* **Stay Duration Calculator**: Dynamic counter tracking exact months and days of continuous stay.
* **Billing & Rent Due Tracking**: Clear breakdown of monthly rental liabilities, paid status, and credit balance.
* **Frictionless Rent Payment**: Digital submission modal supporting GCash, Maya, and Bank Transfers with celebratory confetti confirmation.
* **Payment Ledger & Receipt Vault**: Historical repository of all posted payments with instant digital receipt view.
* **Digital Lease Contract**: Embedded digital agreement outlining lessor/lessee terms, unit boundaries, deposit rules, and house guidelines.
* **Direct Line to Management**: Two-way real-time messaging channel with property owners.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 16.3 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS design system tokens |
| **Animations & Effects** | [Framer Motion 13](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) & [Google Fonts (Outfit, Inter)](https://fonts.google.com/) |
| **Cloud Database** | [Google Cloud Firebase Firestore v12](https://firebase.google.com/products/firestore) |
| **Date & Time Utilities** | [date-fns](https://date-fns.org/) |

---

## 📂 Project Directory Structure

```plaintext
HomeHub2026/
├── public/
│   ├── icons/                 # Authentic HomeHub heritage icons (owner.png, tenant.png, etc.)
│   ├── img/                   # Brand logos and property upload gallery
│   └── favicon.ico
├── scripts/
│   ├── seedFirestoreData.mjs  # Firebase Firestore automated database seeder
│   └── testFirestore.mjs      # Connectivity and collection verification script
├── src/
│   ├── app/
│   │   ├── dashboard/         # Owner & Staff administrative dashboards
│   │   │   ├── accounts/      # System user access & roles
│   │   │   ├── chat/          # Real-time resident support chat
│   │   │   ├── payments/      # Payment transactions & billing ledger
│   │   │   ├── tenants/       # Tenant registry & lease directory
│   │   │   ├── units/         # Apartment inventory & detailed unit view
│   │   │   ├── layout.tsx     # Animated sidebar, breadcrumbs & top load bar
│   │   │   └── page.tsx       # Portfolio overview & cash flow charts
│   │   ├── tenant-portal/     # Resident self-service portal
│   │   ├── layout.tsx         # Root app layout & font configurations
│   │   └── page.tsx           # Public showcase & apartment directory
│   ├── components/
│   │   ├── auth/              # Role switcher & authentication modals
│   │   ├── layout/            # Sticky navigation bar & footers
│   │   ├── properties/        # Cards, filters, and property modal inspects
│   │   └── ui/                # Core component system (Button, Badge, Modal)
│   ├── context/
│   │   ├── AuthContext.tsx    # Role-based authentication provider
│   │   └── DataContext.tsx    # Real-time Firestore sync & LocalStorage manager
│   ├── lib/
│   │   ├── firebase.ts        # Firebase client initialization
│   │   └── mockData.ts        # Default seed records & metrics calculator
│   └── types/
│       └── index.ts           # Strict TypeScript contracts & models
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: `v20.x` or higher installed
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### 2. Clone Repository
```bash
git clone https://github.com/your-username/HomeHub.git
cd HomeHub/HomeHub2026
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root of `HomeHub2026/`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```
*(Note: If Firebase variables are not set, HomeHub automatically falls back to internal mock data and local storage, ensuring full offline development capability!)*

### 5. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔑 Demo Access & Role Switching

You can test all roles immediately without setting up accounts:

| Role | Profile | Features Available |
|---|---|---|
| **Super Admin (Owner)** | Mark Christian | Full portfolio analytics, unit editor, lease terminations, payment ledger, accounts management |
| **Admin (Staff)** | Maria Clara | Daily operations, onboarding, logging payments, unit status updates |
| **Resident (Tenant)** | Alexander Cruz (Unit 101) | Rent payment, receipt history, duration of stay, digital lease, direct chat |

> 💡 **Quick Switcher**: Inside the Owner Dashboard or Tenant Portal, use the bottom-left profile switcher to jump between roles instantly.

---

## 📍 Location & Property Details

- **Property**: HomeHub Residences
- **Address**: Acacia Ave., Cavite, Philippines
- **Capacity**: 12 Residential Apartment Units

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author & Acknowledgements

- **Developer**: HomeHub Engineering Team
- **Special Thanks**: Original HomeHub PHP platform for heritage iconography and architectural workflows.
