module.exports = {
    config: {
      name: "help",
      aliases: ["info", "commands"],
      version: "1.0",
      author: "testing",
      countDown: 5,
      role: 0, // Accessible to everyone
      description: "Displays a list of all available commands and their usage",
      category: "Utility",
      guide: "{pn}",
      usePrefix: true
    },
  
    run: async ({ message, config, client }) => {
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
  
        Logger.info({ ...logData, content: 'Displaying help information...' });
  
        // Build help message
        let helpMessage = `**Bot Commands** (Prefix: \`${config.prefix}\`)\n\n`;
        client.commands.forEach(command => {
          const { name, description, guide, aliases } = command.config;
          helpMessage += `**${config.prefix}${name}**\n`;
          helpMessage += `Description: ${description}\n`;
          helpMessage += `Usage: \`${guide.replace('{pn}', config.prefix + name)}\`\n`;
          if (aliases && aliases.length) {
            helpMessage += `Aliases: ${aliases.map(a => `\`${config.prefix}${a}\``).join(', ')}\n`;
          }
          helpMessage += `Role: ${command.config.role === 1 ? 'Admin only' : 'Everyone'}\n\n`;
        });
  
        helpMessage += `**Additional Info**:\n- Set language by sending a code (e.g., \`en\` for English).\n- Chat by sending messages after setting a language.`;
  
        await message.reply(helpMessage);
  
        Logger.info({ ...logData, content: 'Help information sent successfully' });
      } catch (error) {
        Logger.error({
          username: message.author.username,
          userId: message.author.id,
          message: message.content,
          type: 'command',
          channelType: channelType,
          error: error.message
        });
        await message.reply(`Error displaying help: ${error.message}`);
      }
    }
  };