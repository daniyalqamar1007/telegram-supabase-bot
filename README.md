# Telegram Bot Server with Ngrok and Supabase

## Overview
This project sets up a Node.js server using Express to handle Telegram bot webhooks, with data stored in Supabase. Ngrok is used to expose the local server to the internet.

## Prerequisites
Ensure you have the following installed:
- Node.js and npm ([Download](https://nodejs.org/))
- Ngrok ([Download](https://ngrok.com/))
- A Supabase account ([Sign up](https://supabase.com/))
- A Telegram Bot ([Create one](https://t.me/BotFather))

## Installation
Clone the repository and install dependencies:

```sh
git clone https://github.com/your-repo.git
cd telegram-bot-server
npm install
```

## Configuration
Create a `.env` file in the root directory and add your credentials:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=4000
```

## Running the Server
Start the server with:

```sh
node index.js
```

## Exposing with Ngrok
Run the following command in a new terminal:

```sh
ngrok http 4000
```

Copy the HTTPS forwarding URL and set it as your webhook URL in Telegram:

```sh
curl -X GET "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=<YOUR_NGROK_URL>/webhook"
```

## Usage
Send `/count some_referral_code` to your Telegram bot to check the referral count.

## License
This project is licensed under the MIT License.

