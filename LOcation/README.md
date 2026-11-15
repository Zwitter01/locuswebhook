# 🌍 Location Dispatcher (Telegram & Email)

Real-time location tracker with instant dispatch to **Telegram** ([@Zwitter_14](https://t.me/Zwitter_14)) and **Email** (`victusgefroce14@gmail.com`).

---

## 🛠️ Issues Found & Fixed

1. **Missing `package.json` & Node Dependencies**:
   - The directory had `server.js` requiring `express`, `cors`, and `dotenv`, but no `package.json` was present. We created `package.json` and installed all required packages including `nodemailer`.
2. **Static File 404 Route Error**:
   - `server.js` was configured with `app.use(express.static('public'))`, but `index.html` was located in the root folder. Visiting `http://localhost:3000/` returned `Cannot GET /`. We updated `server.js` to serve `index.html` directly.
3. **Outdated `node-fetch` Dependency**:
   - Replaced `node-fetch` with Node.js 24's native global `fetch` to eliminate ESM incompatibility.
4. **Added Complete Email Pipeline (`nodemailer`)**:
   - Added full HTML and plain-text email delivery with direct Google Maps buttons configured for `victusgefroce14@gmail.com`.
5. **Modernized UI (`index.html`)**:
   - Upgraded to a sleek dark glassmorphism dashboard with Google Fonts (`Inter` & `Outfit`), real-time accuracy indicators, live coordinate display, dynamic URL detection, and Google Maps / OpenStreetMap direct links.

---

## 🚀 Quick Setup Guide

### 1. Telegram Setup (for [@Zwitter_14](https://t.me/Zwitter_14))

Telegram bots require a bot token and your numeric chat ID to send you private messages:

1. Open Telegram and search for **[@BotFather](https://t.me/BotFather)**.
2. Send `/newbot` and follow the prompts to name your bot (e.g., `My Tracker Bot`).
3. BotFather will provide an **HTTP API Token** (looks like `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`).
4. Paste the token into your [.env](file:///c:/Users/kvish/OneDrive/Desktop/LOcation/.env) file:
   ```env
   TELEGRAM_BOT_TOKEN=your_token_here
   ```
5. Open your newly created bot in Telegram and click **Start** (or send any message like `hello`).
6. In your terminal, run:
   ```bash
   npm run get-chat-id
   ```
   *This helper script will automatically detect your Chat ID, update [.env](file:///c:/Users/kvish/OneDrive/Desktop/LOcation/.env), and send a confirmation test message directly to your Telegram!*

---

### 2. Email Setup (for `victusgefroce14@gmail.com`)

To allow Node.js to send emails securely via Gmail SMTP:

1. Go to your **[Google Account Security](https://myaccount.google.com/security)** page.
2. Ensure **2-Step Verification** is turned ON.
3. Navigate to **[App Passwords](https://myaccount.google.com/apppasswords)**.
4. Generate a new App Password (select App: *Other (Custom name)*, enter `Location Tracker`).
5. Copy the 16-character code (e.g., `abcd efgh ijkl mnop`).
6. Paste it into your [.env](file:///c:/Users/kvish/OneDrive/Desktop/LOcation/.env) file:
   ```env
   EMAIL_PASS=abcdefghijklmnop
   ```

---

### 3. Start the Server

```bash
npm start
```

---

## ⚡ Deploy to Vercel (Recommended for Mobile)

Since Vercel provides automatic HTTPS and high performance, deploying takes 1 minute:

1. Push your folder to a GitHub repository or use the Vercel CLI (`npx vercel`).
2. In your Vercel Project Settings ➔ **Environment Variables**, add:
   - `TELEGRAM_BOT_TOKEN`: `your_bot_token_here`
   - `TELEGRAM_CHAT_ID`: `your_chat_id_here`
3. Click **Deploy**!
4. Open your live `https://your-project.vercel.app` on your smartphone and tap **Start BOom !** to get pinpoint Gorakhpur GPS coordinates sent straight to Telegram!
