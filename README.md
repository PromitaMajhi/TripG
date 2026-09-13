# TripG 🗺️ — Vadodara Tour & Route Navigator

A modern, mobile-first web application designed for navigating the **Vadodara Ganesh Darshan Tour** route, starting from **Parul University** across 11 sacred destinations with one-click live Google Maps GPS navigation.

---

## 🗺️ Tour Route Overview

```
Parul University (Start)
  ↓ (~22–23 km)
1. Manjalpur Na Raja (Manjalpur)
  ↓ (~2–3 km)
2. Icchapurti Ganesh (Manjalpur)
  ↓ (~1–2 km)
3. Manmohan Yuvak Mandal / Vadodara Na Maharaja (Dandia Bazar)
  ↓ (~5–6 km)
4. Pratap Maddha Ni Pol (Mangal Bazar, Old City)
  ↓ (~1–2 km)
5. Kalupura Cha Raja (Nava Bazar, Old City)
  ↓ (~1 km)
6. Shree Kantareshwar Mahadev Yuvak Mandal (Bajwada)
  ↓ (~1–2 km)
7. Koylifaliya Cha Gan Raja (Bajwada)
  ↓ (~1–2 km)
8. Bajwada Hanuman Pole Yuvak Mandal (Bajwada)
  ↓ (~2–3 km)
9. Shree Rajsthambh Parivar (Navapura)
  ↓ (~1 km)
10. Shree Rajsthambh Society (Navapura)
  ↓ (~4–5 km)
11. Azad Group Cha Raja (Kishanwadi)
```

---

## ✨ Features

- 🚗 **One-Tap Google Maps Navigation** — Instantly calculates the driving route from your current live GPS position to any destination.
- 📱 **Mobile-First UX** — Native bottom navigation bar, touch-friendly tap targets, and smooth bottom-sheet modals.
- 📋 **Full CRUD Operations** — Add custom stops, edit coordinates, distance, and notes, or delete stops.
- 🔍 **Real-Time Search & Area Filters** — Filter by zone (Manjalpur, Old City, Bajwada, Navapura, Kishanwadi) or search by name.
- ✅ **Visited Status Tracking** — Toggle visited status to keep track of your tour progress.
- 🌙 **Dark Glassmorphic Theme** — Premium UI styled with Plus Jakarta Sans and modern CSS glassmorphism.
- ⚡ **Full-Stack Serverless** — Powered by React 18, Vite 5, Node.js API, and MongoDB Atlas.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite 5, Lucide Icons, React Hot Toast
- **Backend**: Node.js, Express (local dev) / Vercel Serverless Functions (production)
- **Database**: MongoDB Atlas with Mongoose
- **Styling**: Vanilla CSS (Mobile-first responsive design)

---

## 🚀 Deployment to Vercel

1. Push this repository to GitHub using GitHub Desktop or Git.
2. In Vercel, import your GitHub repository (`trip-g`).
3. Under **Settings → Environment Variables**, add:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/tripg?retryWrites=true&w=majority
   ```
4. Deploy the project!

---

## 💻 Local Development

Double-click `run.bat` on Windows to start both frontend and API servers simultaneously, or run manually:

```bash
# Terminal 1 — Frontend
npm run dev

# Terminal 2 — Backend API
npm run dev:api
```

- **Frontend**: `http://localhost:5173` (or `http://<your-local-ip>:5173` on mobile)
- **Backend API**: `http://localhost:3001/api/destinations`
