var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;

var logger = require('../config/logger-config');

//Supress logger console messages during tests
logger.transports.forEach((t) => (t.silent = true));

//Test target
var telegramHandler = require('../handlers/telegram-handler');

//Configuration helper
var telegramConfig = require('../config/telegram-config');

//Target test start
describe('Telegram Handler:', () => {

    it('Expect all functions to be defined', () => {
        expect(telegramHandler.getToken).to.not.be.undefined;
        expect(telegramHandler.getSticker).to.not.be.undefined;
        expect(telegramHandler.getAuthorizedUsers).to.not.be.undefined;
        expect(telegramHandler.isAuthorized).to.not.be.undefined;
    });

    it('Expect to return Bot token', () => {
        return expect(telegramHandler.getToken()).to.not.be.null;
    });

    it('Expect to return authorized users list', () => {
        return expect(telegramHandler.getAuthorizedUsers()).to.not.be.null;
    });

    it('Expect authorized users to not be empty', () => {
        return expect(telegramHandler.getAuthorizedUsers()).to.not.be.empty;
    });

    it('Expect BotFather to not be authorized', () => {
        var users = telegramHandler.getAuthorizedUsers();
        users.push('BotFather');
        telegramConfig.users = users.toString();
        return expect(telegramHandler.isAuthorized('BotFather')).to.be.false;
    });

    it('Expect sticker \'confused\' to be retrieved successfully', () => {
        return expect(telegramHandler.getSticker('confused')).to.not.be.undefined;
    });

    it('Expect sticker \'sticker\' to not be retrieved', () => {
        return expect(telegramHandler.getSticker('sticker')).to.be.equals('');
    });

});