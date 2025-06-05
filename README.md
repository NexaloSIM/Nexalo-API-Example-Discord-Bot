Nexalo Discord Bot

A simple Discord bot with chat, help, ping, and teach commands, powered by the Nexalo API. This bot allows users to chat in multiple languages, check latency, view command details, and train the bot with question-answer pairs (admin only).

Features





Chat: Send messages to interact with the Nexalo API (requires language setup).



Help: View all commands with usage and descriptions (!help).



Ping: Check bot latency (!ping).



Teach: Train the bot with question-answer pairs (admin only, !teach <question> | <answer>).

Prerequisites





Node.js (v20.17.0 or later): Download



Discord Account: For bot setup and testing.



Nexalo Account: To get a free API key.



Git (optional): To clone the repository.

Setup Instructions

1. Get a Discord Bot Token





Go to the Discord Developer Portal.



Create a new application, then add a bot under the Bot tab.



Enable Privileged Gateway Intents:





Turn on Message Content Intent in the Bot tab.



Copy the bot Token (click Reset Token if needed).



Invite the bot to your server:





Go to OAuth2 > URL Generator.



Select bot scope and permissions: Read Messages/View Channels, Send Messages.



Copy and open the generated URL to invite the bot.

2. Get a Free Nexalo API Key





Visit nexalo.xyz and sign up for a free account.



After signing up, log in and go to nexalo.xyz/dashboard/api.



Navigate to your Profile by clicking your avatar (top right).



Copy your unique API Key. This is free and available instantly after signup.

3. Clone or Download the Project





Option 1: Clone with Git

git clone <repository-url>
cd Nexalo-Discord-Bot



Option 2: DownloadDownload the project ZIP, extract it, and open the folder (Nexalo-Discord-Bot).

4. Install Dependencies





Open a terminal in the project folder.



Run:

npm install

5. Configure the Bot





Open config/botConfig.js.



Replace placeholders:





YOUR_DISCORD_BOT_TOKEN: Paste your Discord bot token.



YOUR_NEXALO_API_KEY: Paste your Nexalo API key.



YOUR_ADMIN_ID: Your Discord user ID (enable Developer Mode in Discord, select "Copy ID"). Example:

module.exports = {
  discord: { token: 'your-discord-bot-token' },
  nexalo-api-key: {
    apiKey: 'your-nexalo-api-key',
    simApiUrl: 'https://sim.api.nexalo.xyz/v2/chat',
    trainApiUrl: 'https://sim.api.nexalo.xyz/v1/train'
  },
  prefix: ['your-prefix'],
  admins: ['9249848665572960'], // Your Discord user ID
  language: 'en'
};

6. Run the Bot





In the project folder, run:

node index.js



Look for a log message:

[INFO] ... Bot logged in as <BotName> with prefix: !

7. Test the Bot





Set Language:





In a DM or server channel, send a language code:





en (English), bn (Bangla), hi (Hindi), ar (Arabic), id (Indonesian), vi (Vietnamese)



Example: Send en to set English.



Bot responds: Language set to English. You can now chat or use commands like !help.



Use Commands:





!help: Lists all commands with usage.



!ping: Checks bot latency.



!teach question | answer: Trains the bot (admin only, e.g., !teach How are you? | I'm great!).



Chat:





Send a message (e.g., Hello) after setting a language to interact with the Nexalo API.

File Structure

Nexalo-Discord-Bot/
├── commands/
│   ├── help.js
│   ├── ping.js
│   └── teach.js
├── logger/
│   └── logger.js
├── config/
│   └── botConfig.js
├── node_modules/
├── index.js
├── package.json
├── README.md
├── logs.txt

Troubleshooting





Bot Not Starting:





Ensure Message Content Intent is enabled in the Discord Developer Portal.



Check logs.txt for errors (e.g., invalid token).



Verify config/botConfig.js has correct token and API key.



Commands Not Working:





Confirm the bot has read/send message permissions in the channel.



Use the correct prefix (e.g., !).



For teach, ensure your user ID is in config.admins.



Chat Not Responding:





Set a language first (e.g., en).



Test Nexalo API:

curl -X POST -H "Content-Type: application/json" -d '{"api":"YOUR_NEXALO_API_KEY
