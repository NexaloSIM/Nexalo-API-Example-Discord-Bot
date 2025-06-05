const { Client, GatewayIntentBits, Collection } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('./config/botConfig');
const Logger = require('./logger/logger');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
const userPrefs = {};
const supportedLanguages = {
  en: 'English',
  bn: 'Bangla',
  hi: 'Hindi',
  ar: 'Arabic',
  id: 'Indonesian',
  vi: 'Vietnamese'
};
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.config.name, command);
  if (command.config.aliases) {
    command.config.aliases.forEach(alias => client.commands.set(alias, command));
  }
  Logger.info({
    username: 'System',
    userId: 'N/A',
    message: `Loaded command: ${command.config.name}`,
    type: 'system',
    channelType: 'N/A',
    content: 'Command loaded'
  });
}
client.once('ready', () => {
  Logger.info({
    username: 'System',
    userId: 'N/A',
    message: `Bot logged in as ${client.user.tag} with prefix: ${config.prefix}`,
    type: 'system',
    channelType: 'N/A',
    content: 'Startup'
  });
});
async function handleChatApi(message) {
  const channelId = message.channel.id;
  const question = message.content;
  const channelType = message.channel.type === 'DM' ? 'Private' : 'Guild';

  if (!userPrefs[channelId] || !userPrefs[channelId].language) {
    return message.reply('Please set up your language preference by sending a language code (e.g., `en` for English, `bn` for Bangla). Supported: ' + Object.keys(supportedLanguages).join(', '));
  }

  const logData = {
    username: message.author.username,
    userId: message.author.id,
    message: question,
    type: 'text',
    channelType: channelType
  };

  Logger.info({ ...logData, content: 'Processing...' });

  const payload = {
    api: config.nexalo.apiKey,
    question: question,
    language: userPrefs[channelId].language
  };

  try {
    const response = await axios.post(config.nexalo.simApiUrl, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    const result = response.data;

    if (result.status_code === 200 && result.status === 'OK' && result.data) {
      const { answer, response_type, image_url } = result.data;

      if (response_type === 'image' && image_url) {
        Logger.info({ ...logData, content: `Image URL: ${image_url}` });
        await message.reply({ files: [{ attachment: image_url, name: 'image.png' }] });
      } else {
        Logger.info({ ...logData, content: answer });
        await message.reply(answer);
      }
    } else {
      Logger.error({ ...logData, error: `API error: ${result.message || 'Unknown error'}` });
      await message.reply(`Sorry, I couldn’t get a response: ${result.message || 'Unknown error'}`);
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    Logger.error({ ...logData, error: errorMessage });
    await message.reply(`Oops! Something went wrong: ${errorMessage}`);
  }
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content) return;

  const text = message.content.trim();
  const isCommand = text.startsWith(config.prefix);

  if (isCommand) {
    const args = text.slice(config.prefix.length).trim().split(/\s+/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
      await command.run({ message, args, config, userPrefs });
      Logger.info({
        username: message.author.username,
        userId: message.author.id,
        message: text,
        type: 'command',
        channelType: message.channel.type === 'DM' ? 'Private' : 'Guild',
        content: `Executed command: ${commandName}`
      });
    } catch (error) {
      Logger.error({
        username: message.author.username,
        userId: message.author.id,
        message: text,
        type: 'command',
        channelType: message.channel.type === 'DM' ? 'Private' : 'Guild',
        error: error.message
      });
      await message.reply(`Error executing command: ${error.message}`);
    }
  } else if (Object.keys(supportedLanguages).includes(text.toLowerCase())) {
    userPrefs[message.channel.id] = { language: text.toLowerCase() };
    await message.reply(`Language set to ${supportedLanguages[text.toLowerCase()]}. You can now chat or use commands like \`${config.prefix}help\`.`);
  } else {
    await handleChatApi(message);
  }
});
client.on('error', (error) => {
  Logger.error({
    username: 'System',
    userId: 'N/A',
    message: 'Bot error',
    type: 'system',
    channelType: 'N/A',
    error: error.message,
    stack: error.stack
  });
});
client.login(config.discord.token)
  .catch(err => Logger.error({
    username: 'System',
    userId: 'N/A',
    message: 'Bot failed to start',
    type: 'system',
    channelType: 'N/A',
    error: err.message,
    stack: err.stack
  }));