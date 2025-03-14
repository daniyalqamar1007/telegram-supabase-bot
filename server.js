const express = require('express');
const axios = require('axios')
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());


// Load environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

const requiredEnvVars = ['TELEGRAM_BOT_TOKEN', 'SUPABASE_URL', 'SUPABASE_KEY', 'WEBHOOK_URL'];

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

// Initialize Supabase Client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Telegram API URLs
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Set webhook URL when the server starts
async function setWebhook() {
    try {
        const {data} = await axios.get(`${TELEGRAM_API_URL}/setWebhook?url=${WEBHOOK_URL}`);
        // const data = await response.json();
        console.log("Webhook response:", data);
    } catch (error) {
        console.error("Error setting webhook:", error);
    }
}

app.get('/', async (req, res) => {
res.send("server started at port 4000")
})
// Handle incoming Telegram updates
app.post('/webhook', async (req, res) => {
    console.log('hit')
    const update = req.body;
    console.log("Received update:", update);

    if (!update.message || !update.message.text) {
        return res.sendStatus(400);
    }

    const message = update.message.text;
    const chatId = update.message.chat.id;

    // Check if the message matches the /count command
    const match = message.match(/^\/count\s+(\S+)$/);

    if (!match) {
        await sendTelegramMessage(chatId, "Invalid command format. Use: /count <referral_code>");
        return res.sendStatus(200);
    }

    const referralCode = match[1];

    // Query the referral count
    const { count, error } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", referralCode);
    

    if (error) {
        console.error("Supabase query error:", error);
        await sendTelegramMessage(chatId, "Error retrieving referral count.");
        return res.sendStatus(200);
    }

    await sendTelegramMessage(chatId, `Referral count for ${referralCode}: ${count}`);
    res.sendStatus(200);
});

// Function to send Telegram messages
async function sendTelegramMessage(chatId, text) {
    console.log('sedning',chatId,text)
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
    });
}

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await setWebhook();
});
