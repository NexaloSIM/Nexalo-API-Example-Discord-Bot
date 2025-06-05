module.exports = {
    config: {
      name: "ping",
      aliases: ["latency"],
      version: "1.0",
      author: "testing",
      countDown: 5,
      role: 0, 
      description: "Checks the bot's latency",
      category: "Utility",
      guide: "{pn}",
      usePrefix: true
    },
  
    run: async ({ message }) => {
      const Logger = require('../logger/logger');
      const channelType = message.channel.type === 'DM' ? 'Private' : 'Guild';
  
      try {
        const logData = {
          username: message.author.username,
          userId: message.author.id,
          message: message.content,
          type: 'command',
          channelType: channelType
        };
  
        Logger.info({ ...logData, content: 'Checking ping...' });
  
        const sent = await message.reply('Pong!');
        const latency = sent.createdTimestamp - message.createdTimestamp;
  
        await sent.edit(`Pong! Latency: ${latency}ms`);
        Logger.info({ ...logData, content: `Ping responded: ${latency}ms` });
      } catch (error) {
        Logger.error({
          username: message.author.username,
          userId: message.author.id,
          message: message.content,
          type: 'command',
          channelType: channelType,
          error: error.message
        });
        await message.reply(`Error checking ping: ${error.message}`);
      }
    }
  };