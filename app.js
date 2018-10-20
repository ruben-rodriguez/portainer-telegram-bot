const logger = require('./config/logger-config');
const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

logger.info('Portainer Telegram Bot is up and running!');

const telegramHandler = require('./handlers/telegram-handler');
const portainerHandler = require('./handlers/portainer-handler');

const token = telegramHandler.getToken();

logger.info('Using Bot token ' + token);

const bot = new Telegraf(token);

//Retrieve basic information of the Bot
bot.telegram.getMe().then((botInfo) => {
  bot.options.username = botInfo.username;
  logger.info(botInfo.first_name + ':' + botInfo.username + ' correctly started');
});

//Actions on /hello command
bot.command('hello', (ctx) => {
  logger.info('Command /hello from ' + ctx.from.first_name + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {



    ctx.reply('Hello there!\nFor a complete list of available commands, type /help');
    return ctx.replyWithSticker(telegramHandler.getSticker('blush'));

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));
  }

});

//Actions on /help command
bot.command('help', (ctx) => {
  logger.info('Command /help from ' + ctx.from.first_name + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {

    return ctx.reply('Available commands:\n' +
      '/help - Prints this list\n' +
      '/status - Prints Portainer instance status\n' +
      '/get_containers - Prints list of containers and status\n' +
      '/start_container - Displays inline keyboard with containers to start if any\n' +
      '/stop_container - Displays inline keyboard with containers to stop if any'
    );

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));

  }

});

//Actions on /status command
bot.command('status', (ctx) => {
  logger.info('Command /status from ' + ctx.from.first_name + ':' + ctx.from.username + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {

    portainerHandler.isUp().then(function () {

      return ctx.reply('Portainer instance is running');

    }).catch(function (err) {

      return ctx.reply('Portainer instance is not running ' + err);

    });

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));

  }

});

//Actions on /get_containers command
bot.command('get_containers', (ctx) => {
  logger.info('Command /list-containers from ' + ctx.from.first_name + ':' + ctx.from.username + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {

    ctx.reply('Retrieving container list... ');

    portainerHandler.getContainers('all').then(function (containers) {

      return ctx.reply(containers);

    }).catch(function (err) {

      return ctx.reply('Could not retrieve container list ' + err);

    });

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));

  }

});

//Actions on /start_container command
bot.command('start_container', (ctx) => {

  logger.info('Command /start_container from ' + ctx.from.first_name + ':' + ctx.from.username + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {


    ctx.reply('Retrieving stopped containers... ');

    portainerHandler.getContainers('stopped').then(function (containers) {

      if (containers.length === 0) {

        ctx.reply('There are no stopped containers to start...');

      } else {

        var keyboard = [];
        containers.forEach(element => {

          keyboard.push(Markup.callbackButton(element.name, 'start-' + element.name));

          bot.action('start-' + element.name, (ctx) => {
            ctx.reply('Starting ' + element.name + ' container...');

            portainerHandler.startContainer(element.name).then(function (status) {

              ctx.answerCbQuery();
              return ctx.reply('Container ' + element.name + ' is now running!');

            }).catch(function (err) {

              ctx.answerCbQuery();
              return ctx.reply('Unable to start container: ' + err + ' :(');

            });

          })
        });

        return ctx.reply('Choose a container to start: ',
          Markup.inlineKeyboard(keyboard)
            .extra()
        );

      }

    }).catch(function (err) {

      return ctx.reply('Could not retrieve container list ' + err);

    });

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));

  }

});

//Actions on /stop_container command
bot.command('stop_container', (ctx) => {

  logger.info('Command /stop_container from ' + ctx.from.first_name + ':' + ctx.from.username + ' received');

  if (telegramHandler.isAuthorized(ctx.from.username)) {

    ctx.reply('Retrieving running containers... ');

    portainerHandler.getContainers('running').then(function (containers) {

      if (containers.length === 0) {

        ctx.reply('There are no running containers to stop...');

      } else {

        var keyboard = [];

        containers.forEach(element => {

          keyboard.push(Markup.callbackButton(element.name, 'stop-' + element.name));

          bot.action('stop-' + element.name, (ctx) => {

            ctx.reply('Stopping ' + element.name + ' container...');

            portainerHandler.stopContainer(element.name).then(function (status) {

              ctx.answerCbQuery();
              return ctx.reply(element.name + ' is now stopped');

            }).catch(function (err) {

              ctx.answerCbQuery();
              return ctx.reply('Unable to stop container: ' + err + ' :(');

            });

          })
        });

        return ctx.reply('Choose a container to stop: ',
          Markup.inlineKeyboard(keyboard)
            .extra()
        );

      }
    });

  } else {

    ctx.reply('You are not authorized to use this bot, this incident will be logged and notified');
    return ctx.replyWithSticker(telegramHandler.getSticker('angry'));

  }

});

//Actions on any other unregistered event
bot.on('message', (ctx) => {
  var message = ctx.message.text ||  ctx.message.sticker.file_id;
  logger.info('Message received: \'' + message + '\' from ' + ctx.from.first_name);
  return ctx.replyWithSticker(telegramHandler.getSticker('confused'));
});

//Catch Telegraf bot errors
bot.catch((err) => {
  logger.error('Unexpected error: ' + err);
});

//Start polling Telegram API updates
bot.startPolling();