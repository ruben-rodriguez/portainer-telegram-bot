const logger = require('../config/logger-config');

//Configuration helper
var telegramConfig = require('../config/telegram-config');

logger.info('Starting Telegram handler...');

const token = telegramConfig.token;
logger.info('Telegram Handler: Telegram Bot token configured ' + token);

const authorizedUsers = getAuthorizedUsers();
logger.info('Telegram Handler: Authorized users: ' + authorizedUsers.join('; '));

//Returns the list of the authorized users to use the Bot
function getAuthorizedUsers() {

  var users = telegramConfig.users.split(',');
  logger.debug('Telegram Handler: Authorized user list retrieved: ' + users.join(';'));
  return users;

}

function getSticker(id) {

  logger.info('Telegram Handler: Retrieving sticker id of ' + id);
  var stickers = telegramConfig.stickers;

  if (stickers.hasOwnProperty(id)) {

    var sticker = stickers[id];
    logger.info('Telegram Handler: Sticker id value ' + sticker);
    return sticker;

  } else {

    logger.error('Telegram Handler: Sticker id value not found in configuration');
    return '';

  }
}

function isAuthorized(user) {

  if (authorizedUsers.includes(user)) {
    logger.info('Telegram Handler: User ' + user + ' is authorized');
    return true;
  } else {
    logger.warn('Telegram Handler: User ' + user + ' is not authorized');
    return false;
  }

}

function getToken() {
  return token;
}

module.exports = {
  getToken: getToken,
  getAuthorizedUsers,
  getSticker: getSticker,
  isAuthorized: isAuthorized
}