# TripG 🗺️

**আপনার ব্যক্তিগত ট্যুর ডেস্টিনেশন গাইড** — বাংলাদেশের সুন্দর স্থানগুলো সংরক্ষণ করুন এবং এক ক্লিকে Google Maps নেভিগেশন শুরু করুন।

## Features

- 🗺️ **Map Navigation** — বাটন ক্লিক করলে Google Maps খুলবে (মোবাইলে auto)
- 📍 **Live Location** — আপনার বর্তমান অবস্থান থেকে নেভিগেশন
- ✨ **CRUD** — Add, Edit, Delete destinations
- 🔍 **Search & Filter** — নাম বা জেলা দিয়ে খুঁজুন
- ✅ **Visited Tracking** — কোথায় গিয়েছেন চিহ্নিত করুন
- 🌙 **Dark UI** — প্রিমিয়াম ডার্ক থিম

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: MongoDB Atlas
- **Styling**: Vanilla CSS (Dark Glassmorphism)

---

## 🚀 Vercel-এ Deploy করার নিয়ম

### ধাপ ১: MongoDB Atlas সেটআপ
1. [mongodb.com/atlas](https://www.mongodb.com/atlas) এ ফ্রি অ্যাকাউন্ট খুলুন
2. একটি **Free Cluster** তৈরি করুন
3. **Database Access** → User তৈরি করুন (username + password)
4. **Network Access** → `0.0.0.0/0` (সব IP allow করুন)
5. **Connect** → "Connect your application" → connection string কপি করুন

### ধাপ ২: GitHub-এ Push করুন
```bash
git add .
git commit -m "TripG app initial commit"
git push origin main
```

### ধাপ ৩: Vercel Deploy
1. [vercel.com](https://vercel.com) এ GitHub দিয়ে login করুন
2. **New Project** → এই repo import করুন
3. **Environment Variables** এ যোগ করুন:
   ```
   MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/tripg?retryWrites=true&w=majority
   ```
4. **Deploy** ক্লিক করুন ✅

### ধাপ ৪: Seed Data যোগ করুন (একবার মাত্র)
Deploy হওয়ার পর এই URL এ POST request পাঠান:
```
POST https://your-app.vercel.app/api/seed
```
(Browser console থেকে: `fetch('/api/seed', {method:'POST'}).then(r=>r.json()).then(console.log)`)

---

## 💻 Local Development

```bash
# ১. Clone করুন
git clone https://github.com/PromitaMajhi/TripG.git
cd TripG

# ২. Dependencies install করুন
npm install

# ৩. .env ফাইল তৈরি করুন
cp .env.example .env
# .env ফাইলে MONGODB_URI বসান

# ৪. দুটো terminal এ চালান:
npm run dev        # Frontend (port 5173)
npm run dev:api    # Backend API (port 3001)

# ৫. Browser এ যান: http://localhost:5173
```

---

## 📱 মোবাইলে Map Navigation কীভাবে কাজ করে

1. যেকোনো destination card এ **"মানচিত্রে দেখো"** বাটন ক্লিক করুন
2. Browser আপনার **current location** permission চাইবে → Allow করুন
3. Google Maps অ্যাপ **automatically** খুলবে
4. আপনার location থেকে destination পর্যন্ত **navigation** শুরু হবে 🎯
