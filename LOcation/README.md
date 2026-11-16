# 🛡️ Geolocation Telemetry & Webhook Relay (PoC)

An authorized security awareness and emergency telemetry relay pipeline with instant dispatch to **Telegram Bot Webhook** and **Email SMTP**.

---

## 🛠️ System Overview & Architecture

1. **Defensive Telemetry Capture**: Demonstrates browser W3C Geolocation API permission model and telemetry ingestion.
2. **Reverse Geocoding Pipeline**: Queries OpenStreetMap Nominatim and BigDataCloud for doorstep address resolution.
3. **Multi-Channel Dispatcher**: Relays telemetry securely via Telegram Bot API and Nodemailer SMTP.
4. **Cosmic Glassmorphic Interface**: Modern React 19 + TypeScript + Tailwind CSS interface.

---

## 🚀 Quick Setup

### 1. Telegram Webhook Setup
1. Create a bot via **[@BotFather](https://t.me/BotFather)** on Telegram.
2. Add your HTTP API Token to `.env`:
   ```env
   TELEGRAM_BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
   ```
3. Start the bot in Telegram (`/start`) and run:
   ```bash
   npm run get-chat-id
   ```

### 2. Email Setup (Gmail SMTP)
1. Turn on 2-Step Verification in Google Account Security.
2. Generate an **App Password** for `Location Relay`.
3. Add to `.env`:
   ```env
   EMAIL_PASS=your_16_char_app_password
   ```

### 3. Start the Server
```bash
npm start
```

---

## ⚖️ Disclaimer
This proof of concept is intended for authorized security awareness, personal emergency response, and educational research purposes.
