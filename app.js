const logger = require('./config/logger-config');
const telegramConfig = require('./config/telegram-config');
const request = require('request');
const Telegraf = require('telegraf')

logger.info('Starting Telegram bot controller...');
const token = process.env.BOT_TOKEN || 'TEST_TOKEN';

logger.info('Using token ' + token);
const bot = new Telegraf(token);

bot.on('text', (ctx) => {
  logger.info('Message received: \'' + ctx.message.text + '\' from ' + ctx.from.first_name);
  ctx.reply('Message received');
  ctx.replyWithSticker(telegramConfig.stickers.ups);
});

bot.on('sticker', (ctx) => {
  logger.info('Sticker received: \'' + ctx.message.file_id + '\' from ' + ctx.from.first_name);
  ctx.replyWithSticker(telegramConfig.stickers.wat);
});

bot.startPolling();
