const fs = require('fs');
const path = require('path');
class Logger {
  static info(data) {
    const logMessage = `[INFO] ${new Date().toISOString()} - User: ${data.username} UID: ${data.userId} Type: ${data.type} Channel: ${data.channelType} Message: ${data.message} Content: ${data.content}\n`;
    console.log(logMessage);
    fs.appendFileSync(path.join(__dirname, '../logs.txt'), logMessage);
  }
  static error(data) {
    const logMessage = `[ERROR] ${new Date().toISOString()} - User: ${data.username} UID: ${data.userId} Type: ${data.type} Channel: ${data.channelType} Message: ${data.message} Error: ${data.error}${data.stack ? `\nStack: ${data.stack}` : ''}\n`;
    console.error(logMessage);
    fs.appendFileSync(path.join(__dirname, '../logs.txt'), logMessage);
  }
}
module.exports = Logger;