// get-chat-id.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function main() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token || token.trim() === '' || token === 'your_telegram_bot_token_here') {
        console.log('\n❌ ERROR: TELEGRAM_BOT_TOKEN is not set in your .env file!');
        console.log('\n👉 HOW TO GET YOUR BOT TOKEN:');
        console.log('1. Open Telegram and search for @BotFather (https://t.me/BotFather)');
        console.log('2. Send: /newbot');
        console.log('3. Choose a name and username for your bot.');
        console.log('4. Copy the HTTP API token provided by BotFather.');
        console.log('5. Paste it in your .env file: TELEGRAM_BOT_TOKEN=your_token_here\n');
        return;
    }

    try {
        // First, verify the bot and fetch its details
        const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`);
        const meData = await meRes.json();

        if (!meData.ok) {
            console.log(`\n❌ Telegram API Error: ${meData.description}`);
            console.log('Please verify the TELEGRAM_BOT_TOKEN in your .env file.\n');
            return;
        }

        const botUser = meData.result;
        console.log(`\n🤖 Verified Bot: @${botUser.username} (${botUser.first_name})`);
        console.log(`🔗 Bot Link: https://t.me/${botUser.username}`);
        console.log('\n⏳ Waiting for you to send a message to the bot...');
        console.log(`👉 Step 1: Open https://t.me/${botUser.username} in Telegram`);
        console.log('👉 Step 2: Click "START" or send "Hello"\n');

        // Poll for updates for up to 60 seconds
        const startTime = Date.now();
        const timeoutMs = 60000;
        let lastUpdate = null;

        while (Date.now() - startTime < timeoutMs) {
            const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
            const data = await res.json();

            if (data.ok && data.result && data.result.length > 0) {
                lastUpdate = data.result[data.result.length - 1];
                break;
            }

            process.stdout.write('.');
            await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (!lastUpdate) {
            console.log('\n\n⚠️ No messages received yet.');
            console.log(`👉 Please open https://t.me/${botUser.username} on Telegram, press START, and run this command again!`);
            return;
        }

        const msg = lastUpdate.message || lastUpdate.channel_post || lastUpdate.edited_message;
        if (!msg || !msg.chat) {
            console.log('\n⚠️ Message format unexpected. Please send another message and retry.');
            return;
        }

        const chatId = msg.chat.id;
        const sender = msg.from ? (msg.from.username ? `@${msg.from.username}` : msg.from.first_name) : 'User';

        console.log(`\n\n🎉 SUCCESS! Message received from ${sender}`);
        console.log(`📌 Your numeric Chat ID is: ${chatId}`);

        // Update .env file automatically
        const envPath = path.join(__dirname, '.env');
        if (fs.existsSync(envPath)) {
            let envContent = fs.readFileSync(envPath, 'utf8');
            if (/TELEGRAM_CHAT_ID=.*/.test(envContent)) {
                envContent = envContent.replace(/TELEGRAM_CHAT_ID=.*/, `TELEGRAM_CHAT_ID=${chatId}`);
            } else {
                envContent += `\nTELEGRAM_CHAT_ID=${chatId}`;
            }
            fs.writeFileSync(envPath, envContent, 'utf8');
            console.log('✅ TELEGRAM_CHAT_ID has been saved directly to your .env file!');
        }

        // Send a test message to confirm
        console.log('📤 Sending confirmation test message to your Telegram...');
        const testRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: `🚀 *Location Tracker Connected!*\n\nHello ${sender}! Your Telegram is now linked to the Location Dispatcher.\nWhen someone visits the tracker link and shares location, you will receive real-time alerts here.`,
                parse_mode: 'Markdown'
            })
        });
        const testData = await testRes.json();
        if (testData.ok) {
            console.log('✅ Test message sent successfully! Check your Telegram.');
        } else {
            console.log(`⚠️ Telegram response note: ${testData.description}`);
        }

        console.log('\n✨ You are ready! Start the server with: npm start\n');

    } catch (err) {
        console.error('\n❌ Connection error:', err.message);
    }
}

main();
