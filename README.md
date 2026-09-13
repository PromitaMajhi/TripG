# 🪷 TripG — Vadodara Tour & Route Navigator
> **Next-Generation 3D Cyber-Pink Tour Guide & Real-Time GPS Circuit for Vadodara, Gujarat**

<div align="center">

![Next.js 15](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Prisma ORM](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vercel Ready](https://img.shields.io/badge/Vercel-Deploy%20Ready-black?style=for-the-badge&logo=vercel&logoColor=white)

**An ultra-modern, mobile-first progressive tour guide celebrating Vadodara's rich cultural heritage and iconic Ganesh Utsav circuit with live GPS navigation, real location photography, and instant WhatsApp coordination.**

[Explore Circuit](#-the-11-sacred-destinations-circuit) • [Tech Stack](#-technology-stack) • [Mobile Features](#-mobile-first-ux-features) • [Quick Start](#-quick-start) • [API Specs](#-rest-api-documentation)

---

</div>

## 🌟 Core Highlights

- 🎨 **3D Cyber-Pink Glassmorphism** — Designed with custom velvet soliloquy tokens, glowing gradients, backdrop blurs, and Framer Motion micro-physics.
- 📸 **Authentic Real Location Photography** — Bundled with authentic high-resolution imagery of Parul University, Khanderao Market, and Vadodara's most revered pandals.
- 📱 **Mobile-First Cockpit** — Sticky "Next Target Stop" navigator, live progress bar (`Visited X of 11`), and 1-tap WhatsApp sharing for friends and family.
- 🛣️ **Dual Navigation Modes** — Switch effortlessly between rich **3D Card Feed** and the connected **Step-by-Step Route Roadmap**.
- 📍 **1-Tap Google Maps GPS** — Instant turn-by-turn driving or biking navigation calculated from your device's live GPS coordinates.
- 🗄️ **Supabase PostgreSQL & Prisma ORM** — Real-time relational database backed by connection poolers, Row-Level Security (RLS), and zero-downtime resilient local fallbacks.
- 🚨 **Vadodara Emergency Direct-Dial** — Instant one-tap access to Police (112), Traffic Helpline (1095), and Ambulance (108).

---

## 🗺️ The 11 Sacred Destinations Circuit

All 11 destinations are pre-mapped with exact GPS coordinates, distance markers, and authentic photography:

| # | Destination Name | Area / Corridor | Distance from Prev Stop | Category |
|:---:|---|---|---|:---:|
| **01** | **Parul University** *(Start Point)* | Waghodia Road | *Origin (~17–19 km to Manjalpur)* | University |
| **02** | **Manjalpur Na Raja** | Manjalpur | ~17–19 km from Parul Univ | Manjalpur |
| **03** | **Mangal Bazar Yuvak Mandal** | Mangal Bazar (Old City) | ~5–6 km from Manjalpur | Old City |
| **04** | **Nava Bazar Yuvak Mandal** | Nava Bazar (Old City) | ~500 m – 1 km from Mangal Bazar | Old City |
| **05** | **Khanderao Market / Amba Mata** | Rajmahal Road | ~1–1.5 km from Nava Bazar | Heritage |
| **06** | **Bajwada na Raja** | Bajwada | ~1–1.5 km from Khanderao Mkt | Bajwada |
| **07** | **Dandia Bazar na Raja** | Dandia Bazar / Babajipura | ~1.5–2 km from Bajwada | Old City |
| **08** | **Navapura Yuvak Mandal** | Navapura | ~1–1.5 km from Dandia Bazar | Navapura |
| **09** | **Raopura na Raja** | Raopura Main Road | ~1.5–2 km from Navapura | Old City |
| **10** | **Kishanwadi Yuvak Mandal** *(Darshan 1)* | Kishanwadi Main Road | ~3.5–4.5 km from Raopura | Kishanwadi |
| **11** | **Kishanwadi na Raja** *(Darshan 2 - Finale)* | Kishanwadi | Nearby Stop #10 (~500 m – 1 km) | Kishanwadi |

---

## 📱 Mobile-First UX Features

```
┌─────────────────────────────────────────────────────────┐
│  🎯 NEXT TARGET STOP                     [ Stop #02 ]   │
│  Manjalpur Na Raja                                      │
│  📍 Manjalpur, Vadodara • 🚗 ~17-19 km from Parul Univ  │
│  Tour Progress: 2 of 11 Stops (18%)                     │
│  [===================>                             ]    │
│  [  📍 Navigate Now (GPS)  ]  [  ✓ Mark as Done  ]      │
└─────────────────────────────────────────────────────────┘
```

1. **Sticky Quick Navigator Card**: Sits at the top of the mobile screen so travelers on bikes or cars can immediately jump to the next stop without scrolling.
2. **Step-by-Step Route Roadmap**: An interactive vertical timeline linking each stop with dynamic pulsating indicators, connecting route tracks, and distance tags.
3. **1-Tap WhatsApp Sharing**: Share any stop's details and Google Maps directions link directly to WhatsApp groups with pre-formatted Markdown messages.
4. **Offline Resilience**: If connectivity drops in crowded pandals, the app's local dataset and cached images guarantee seamless operation without blank screens.
5. **Ergonomic Bottom Bar**: 48px minimum touch targets, floating 3D `+` action button, and safe-area padding for notch and bezel-less displays.

---

## 🛠️ Technology Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | Edge-ready serverless rendering, Turbopack, full SSR & Route Handlers |
| **Runtime & Language** | **React 19 & TypeScript 5** | Strict type safety across components, props, and database entities |
| **Styling** | **Tailwind CSS v4** | Velvet Soliloquy 3D tokens, custom glassmorphism, responsive grid |
| **Animation** | **Framer Motion** | Physics-based card hovers, spring bottom sheets, glowing particles |
| **Database** | **Supabase PostgreSQL** | Cloud-native relational database hosted in Mumbai (ap-south-1) |
| **ORM & Pooling** | **Prisma ORM (`v6.19`)** | Transaction pooler (port 6543) & direct session migrations (port 5432) |
| **MCP Integration** | **Supabase Remote MCP** | Native Model Context Protocol support (`.mcp.json` & `.agents/`) |
| **Icons & Fonts** | **Lucide React & Google Fonts** | 100% SVG vectors (no emojis), Plus Jakarta Sans, Playfair Display |

---

## 🚀 Quick Start

### 1. 1-Click Launch (Windows)
Double-click **`run.bat`** in the project root. It will verify packages and start the Next.js server automatically.

### 2. Manual Commands
```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. Start development server (Turbopack)
npm run dev
```

Visit **`http://localhost:3000`** in your desktop browser, or **`http://<your-lan-ip>:3000`** on your mobile phone connected to the same Wi-Fi.

---

## 🔐 Environment Configuration

Create or inspect your [`.env.local`](./.env.local) file in the root directory:

```env
# -------------------------------------------------------------
# Supabase Client & Authentication
# -------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=https://qcyqhqwwnjggssalmtwq.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_h10uuhG9_OIZSx9psNuHBw_Xxyx1kUj
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_h10uuhG9_OIZSx9psNuHBw_Xxyx1kUj

# -------------------------------------------------------------
# Supabase Server Verification
# -------------------------------------------------------------
SUPABASE_URL=https://qcyqhqwwnjggssalmtwq.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_h10uuhG9_OIZSx9psNuHBw_Xxyx1kUj
SUPABASE_SECRET_KEY=sb_secret_2xAkzthg3Io1Vg7uOnmp0Q_C1A050g9
SUPABASE_JWKS_URL=https://qcyqhqwwnjggssalmtwq.supabase.co/auth/v1/.well-known/jwks.json

# -------------------------------------------------------------
# PostgreSQL Database & Prisma Connection Pooling
# -------------------------------------------------------------
DATABASE_URL="postgresql://postgres.qcyqhqwwnjggssalmtwq:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qcyqhqwwnjggssalmtwq:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
```

---

## 🔌 Model Context Protocol (MCP) Configuration

TripG comes pre-configured with project-scoped MCP definitions for AI agents in [`.mcp.json`](./.mcp.json) and [`.agents/mcp_config.json`](./.agents/mcp_config.json):

```json
{
  "mcpServers": {
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp?project_ref=qcyqhqwwnjggssalmtwq&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
    }
  }
}
```

---

## 📡 REST API Documentation

### `GET /api/destinations`
Returns all 11 tour stops sorted by `stop_number`. Automatically queries live Supabase PostgreSQL, gracefully falling back to embedded data if connection is interrupted.
```json
{
  "success": true,
  "source": "supabase",
  "data": [
    {
      "id": "995df100-b3eb-43ed-b957-1380e6e18c1d",
      "stop_number": 1,
      "name": "Parul University (Start Point)",
      "location": "Waghodia Road, Vadodara",
      "distance": "Tour Origin (~17–19 km to Manjalpur)",
      "latitude": 22.2887,
      "longitude": 73.3634,
      "image_url": "/images/destinations/stop-1.jpg",
      "category": "other",
      "visited": false
    }
  ]
}
```

### `POST /api/destinations`
Creates a new tour stop. Accepts JSON body with `name`, `location`, `latitude`, `longitude`, `distance`, `category`, and `image_url`.

### `PUT /api/destinations/[id]`
Updates an existing destination or toggles the `visited` status.

### `DELETE /api/destinations/[id]`
Removes a destination from the circuit.

### `POST /api/seed`
Re-seeds the database with the pristine 11-stop Vadodara circuit.

---

## 🏗️ Production Build & Deployment

The codebase is optimized for zero-configuration deployment on **Vercel**:

```bash
# Test local production build
npm run build

# Start production server
npm run start
```

### Deploying to Vercel
1. Push this repository to GitHub.
2. Import the repo into [Vercel](https://vercel.com).
3. Under **Environment Variables**, paste the keys from `.env.local`.
4. Deploy! Next.js native serverless deployment eliminates all Vite SPA routing and MIME type issues.

---

## 📜 License

Created with devotion for Vadodara's cultural heritage. Released under the **MIT License**.
