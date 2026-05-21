# 💰 బంధన్ పే | Bandhan Pay

> Smart Credit Dues & UPI Payment Manager for Indian Retail Shops

![Version](https://img.shields.io/badge/version-1.0.0-amber)
![Free](https://img.shields.io/badge/cost-100%25%20free-green)
![Language](https://img.shields.io/badge/language-Telugu%20%2B%20English-blue)

---

## ✨ Features

- 📋 **Customer Management** — Add, edit, delete customers with full validation
- 💬 **WhatsApp Reminders** — One-tap Telugu/English reminder with UPI link
- 🎙️ **Telugu Voice Reminder** — Browser-based TTS voice playback
- 📱 **QR Code Payments** — Dynamic UPI QR with GPay/PhonePe/Paytm/BHIM deep links
- 📞 **Click to Call** — Opens dialer with pre-filled call script
- ☁️ **Google Sheets Backend** — All data synced to your Google Drive
- 🌐 **Telugu + English** — Full bilingual UI
- 🌙 **Dark Mode** — Premium fintech-style dark UI

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## ☁️ Google Sheets Setup

See **SETUP_GUIDE.md** for full step-by-step instructions.

Quick summary:
1. Open https://script.google.com
2. Paste `Code.gs` content → Run `setup()` → Deploy as Web App
3. Copy the Web App URL → Paste in app Settings tab

---

## 📦 Deploy Free

| Platform | Type | Best For |
|----------|------|----------|
| [Render.com](https://render.com) | Static | ⭐ Recommended |
| [Railway.app](https://railway.app) | Full-stack | Node.js backend |
| [Vercel](https://vercel.com) | Static | Frontend only |
| [Netlify](https://netlify.com) | Static | Frontend only |

---

## 🗂️ Project Structure

```
bandhan-pay/
├── BandhanPay.jsx      # Main React app (all components)
├── Code.gs             # Google Apps Script backend
├── src/
│   ├── App.jsx         # App entry
│   └── main.jsx        # React root
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── render.yaml         # Render.com deploy config
├── netlify.toml        # Netlify deploy config
├── vercel.json         # Vercel deploy config
└── SETUP_GUIDE.md      # Full setup instructions
```

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + Framer Motion
- **Styling:** Inline styles + CSS-in-JS (no Tailwind needed)
- **Backend:** Google Apps Script (free)
- **Database:** Google Sheets (in your Drive)
- **Payments:** UPI deep links + QR codes
- **Voice:** Web Speech API (browser-native, free)

---

**Built with ❤️ for small retail businesses in India**
