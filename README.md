# TripG — Vadodara Tour & Route Navigator

A state-of-the-art **3D Cyber-Pink** tour navigation platform designed for seamless mobile and desktop exploration of Vadodara's 11 sacred destinations, featuring turn-by-turn Google Maps GPS routing.

---

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15+ (App Router)** — Edge-ready serverless architecture
- **React 19** — Server & Client Components
- **TypeScript** — 100% type-safe codebase

### Frontend & Styling
- **Tailwind CSS v4** — Custom Velvet Soliloquy design tokens & 3D Cyber-Pink palette
- **Framer Motion** — Dynamic card hover physics, ambient glowing particles, smooth modal sheet animations
- **Lucide React** — Vector icon suite (no emojis)
- **Google Fonts** — Plus Jakarta Sans, Playfair Display, Hind Siliguri

### Database & Backend
- **Supabase PostgreSQL** — Real-time relational database
- **@supabase/supabase-js & @supabase/ssr** — Official Supabase client
- **Next.js Route Handlers** — `/api/destinations`, `/api/destinations/[id]`, `/api/seed`
- **Graceful Zero-Downtime Fallback** — Instant local dataset fallback so the app never shows a blank screen

---

## 🚀 Quick Start Locally

### 1. Start with the 1-Click Batch Runner
Double-click `run.bat` in the root folder.

### 2. Manual Terminal Commands
```bash
# Install dependencies
npm install

# Start Next.js Turbopack development server
npm run dev

# Or build for production
npm run build
npm run start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser or phone on the same Wi-Fi.

---

## ⚡ Supabase Setup (Optional)

1. Create a project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the contents of [`supabase-schema.sql`](./supabase-schema.sql).
4. Add the following to your `.env.local` or Vercel Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Note: If Supabase keys are not set, the app will seamlessly run from its pre-loaded Vadodara dataset).*
