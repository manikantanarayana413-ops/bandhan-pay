# 🚀 Bandhan Pay — Complete Setup Guide

## What You Get
- All customer data saved to **YOUR Google Drive** (Google Sheets)
- Every visitor sees the **same live data** automatically
- Works on phone, tablet, desktop — any browser
- 100% FREE — no paid services needed

---

## PART 1 — Google Apps Script Setup (Backend)
### ⏱ Takes about 5 minutes

### Step 1 — Open Google Apps Script
1. Go to 👉 **https://script.google.com**
2. Sign in with your Google account
3. Click **"New Project"**

### Step 2 — Paste the backend code
1. Delete all existing code in the editor
2. Open the file `Code.gs` from this package
3. Copy ALL the code and paste it into the editor
4. Click 💾 **Save** (Ctrl+S)
5. Name the project: **BandhanPay**

### Step 3 — Run setup() to create your Google Sheet
1. In the toolbar, select function **"setup"** from the dropdown
2. Click ▶ **Run**
3. A popup will ask for permissions — click **"Review permissions"**
4. Choose your Google account
5. Click **"Advanced"** → **"Go to BandhanPay (unsafe)"**
6. Click **"Allow"**
7. Wait 10 seconds — check the **Execution Log** at the bottom
8. You will see: `✅ Sheet created! ID: xxxxx` and a Sheet URL
9. **Copy that Sheet URL** and open it — your Google Sheet is ready!

### Step 4 — Deploy as Web App
1. Click **"Deploy"** → **"New Deployment"**
2. Click ⚙️ gear icon next to "Type" → Select **"Web app"**
3. Fill in:
   - Description: `BandhanPay API`
   - Execute as: **"Me"**
   - Who has access: **"Anyone"** ← IMPORTANT
4. Click **"Deploy"**
5. Copy the **Web App URL** — it looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`
6. **Save this URL** — you will paste it into the app

---

## PART 2 — React App Setup (Frontend)

### Step 1 — Create a new React project
```bash
npm create vite@latest bandhanpay -- --template react
cd bandhanpay
npm install
```

### Step 2 — Install dependencies
```bash
npm install framer-motion
npm install -D tailwindcss postcss autoprefixer
```

### Step 3 — Copy the app file
1. Copy `BandhanPay.jsx` from this package
2. Paste it into `src/App.jsx` (replace everything)

### Step 4 — Update index.css
Replace `src/index.css` with:
```css
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #020817; color: #fff; }
#root { min-height: 100vh; }
```

### Step 5 — Run locally to test
```bash
npm run dev
```
Open http://localhost:5173

---

## PART 3 — Connect Google Sheets to the App

1. Open the app in your browser
2. Go to ⚙️ **Settings** tab
3. Paste your **Google Apps Script URL** in the field
4. Fill in your **Shop Name** and **UPI ID**
5. Click **Save Settings**
6. The app will immediately sync with your Google Sheet ✅

---

## PART 4 — Deploy the App FREE (Choose One)

### 🟢 Option 1: Render.com (RECOMMENDED)
Best free alternative to Vercel/Netlify for full-stack apps.

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "BandhanPay initial"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/bandhanpay.git
   git push -u origin main
   ```
2. Go to 👉 **https://render.com** → Sign up free
3. Click **"New"** → **"Static Site"**
4. Connect your GitHub repo
5. Set build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
6. Click **"Deploy"**
7. Your app is live at: `https://bandhanpay.onrender.com` ✅

### 🚂 Option 2: Railway.app
Best if you later add a Node.js backend with SQLite.

1. Go to 👉 **https://railway.app** → Sign up free
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repo
4. Railway auto-detects Vite — click **Deploy**
5. Free $5 monthly credit — enough for small apps

### 🪁 Option 3: Fly.io
Best for Node.js + persistent database later.

1. Install flyctl: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly auth login`
3. Run: `fly launch`
4. Run: `fly deploy`

### ▲ Option 4: Vercel (Frontend only)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Free, instant, global CDN.

### 🌐 Option 5: Netlify (Frontend only)
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```

---

## PART 5 — How Data Flows

```
Your Phone / Anyone's Browser
         ↓ opens app URL
   React App (Render/Railway)
         ↓ fetch() on load
   Google Apps Script (Web App URL)
         ↓ reads/writes
   Google Sheets (in YOUR Drive)
         ↑ same data for everyone
```

- When someone **adds a customer** → saved to Google Sheets instantly
- When someone else **opens the app** → they see the same customer
- You can also **edit the Sheet directly** in Google Drive
- All data belongs to YOU — stored in your Google account

---

## PART 6 — Re-deploy After Changes

Every time you update the Google Apps Script code:
1. Go to Apps Script editor
2. Click **Deploy** → **Manage Deployments**
3. Click ✏️ Edit on your deployment
4. Change version to **"New version"**
5. Click **Deploy**

---

## PART 7 — Troubleshooting

| Problem | Solution |
|---------|----------|
| QR code not loading | Check internet connection — uses api.qrserver.com |
| Voice not working | Use Chrome or Edge browser |
| "Sync failed" error | Check Script URL in Settings, redeploy Apps Script |
| Data not updating | Re-deploy Apps Script as new version |
| CORS error | Make sure "Who has access" is set to "Anyone" |
| Sheet not found | Run setup() again in Apps Script |

---

## PART 8 — Google Sheet Structure

Your Google Sheet will have 3 tabs:

### Customers tab
| id | name | phone | amountDue | dueDate | desc | notes | paid | paidAt | reminderCount | createdAt |
|----|------|-------|-----------|---------|------|-------|------|--------|---------------|-----------|

### Settings tab
| key | value |
|-----|-------|
| shopName | మా షాప్ |
| upiId | shop@upi |

### Reminders tab
| name | amount | type | at |
|------|--------|------|----|

You can view and edit this sheet directly in Google Drive anytime!

---

## FREE Tier Limits (Google Apps Script)
- ✅ 6 minutes execution time per call
- ✅ 20,000 URL fetch calls per day
- ✅ 100 MB Google Sheets storage
- ✅ Unlimited read/write operations
- ✅ No credit card required

This is MORE than enough for a small retail business with hundreds of customers.

---

## Summary Checklist

- [ ] Opened script.google.com
- [ ] Pasted Code.gs content
- [ ] Ran setup() — Sheet created
- [ ] Deployed as Web App (Anyone access)
- [ ] Copied Web App URL
- [ ] Created Vite React project
- [ ] Copied BandhanPay.jsx to src/App.jsx
- [ ] Ran npm run dev — tested locally
- [ ] Opened Settings tab — pasted Script URL
- [ ] Added Shop Name + UPI ID
- [ ] Verified data syncs to Google Sheet
- [ ] Deployed to Render/Railway/Vercel
- [ ] Shared URL with team/family

---

**Built with ❤️ for small retail businesses in India**
**100% Free | Telugu + English | UPI + QR | WhatsApp Reminders**
