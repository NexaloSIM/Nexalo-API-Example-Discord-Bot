module.exports = {
    config: {
      name: "teach",
      aliases: ["train", "learn"],
      version: "1.0",
      author: "testing",
      countDown: 5,
      role: 0, 
      description: "Teaches the bot a new question-answer pair",
      category: "Training",
      guide: "{pn} <question> | <answer>",
      usePrefix: true
    },
  
    run: async ({ message, args, config, userPrefs }) => {
      const Logger = require('../logger/logger');
      const axios = require('axios');
      const channelType = message.channel.type === 'DM' ? 'Private' : 'Guild';
  
      try {
        const logData = {
          username: message.author.username,
          userId: message.author.id,
          message: message.content,
          type: 'command',
          channelType: channelType
        };
  
        if (!config.admins.includes(message.author.id)) {
          await message.reply("Only admins can use this command!");
          return;
        }
  
        if (!userPrefs[message.channel.id] || !userPrefs[message.channel.id].language) {
          await message.reply('Please set up your language preference by sending a language code (e.g., `en` for English, `bn` for Bangla).');
          return;
        }
  
        const text = args.join(' ');
        const [question, answer] = text.split('|').map(part => part.trim());
  
        if (!question || !answer) {
          await message.reply("Please provide both question and answer separated by '|'\nExample: !teach How are you? | I’m great!");
          return;
        }
  
        Logger.info({ ...logData, content: 'Training...' });
  
        const payload = {
          api: config.nexalo.apiKey,
          question: question,
          answer: answer,
          language: userPrefs[message.channel.id].language,
          sentiment: 'neutral',
          category: 'general',
          response_type: 'text',
          image_url: null,
          type: 'good'
        };
  
        try {
          const response = await axios.post(config.nexalo.trainApiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
          });
          const result = response.data;
  
          if (result.status_code === 201 && result.status === 'Created' && result.data) {
            Logger.info({ ...logData, content: `Trained: ${result.data.message} (ID: ${result.data.id})` });
            await message.reply(`Successfully taught!\nQuestion: ${question}\nAnswer: ${answer}\nID: ${result.data.id}\nAPI Calls: ${result.data.api_calls}`);
          } else {
            Logger.error({ ...logData, error: `API error: ${result.message || 'Unknown error'}` });
            await message.reply(`Failed to teach: ${result.message || 'Unknown error'}`);
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.message;
          Logger.error({ ...logData, error: errorMessage });
          await message.reply(`Error while teaching: ${errorMessage}`);
        }
      } catch (error) {
        Logger.error({
          username: message.author.username,
          userId: message.author.id,
          message: message.content,
          type: 'command',
          channelType: channelType,
          error: error.message
        });
        await message.reply(`Error executing teach command: ${error.message}`);
      }
    }
  };