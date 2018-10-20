var chai = require("chai");
var nock = require('nock');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

var expect = chai.expect;

var logger = require('../config/logger-config');

//Supress logger console messages during tests
logger.transports.forEach((t) => (t.silent = true));

//Test target
var portainerHandler = require('../handlers/portainer-handler');

//Configuration helper
var portainerConfig = require('../config/portainer-config');

//URI values for Portainer API
const portainerUri = 'http://' + portainerConfig.host + ':' + portainerConfig.port;

//Target test start
describe('Portainer Handler:', () => {

    it('Expect all functions to be defined', () => {
        expect(portainerHandler.isUp).to.not.be.undefined;
        expect(portainerHandler.getConfig).to.not.be.undefined;
        expect(portainerHandler.getToken).to.not.be.undefined;
        expect(portainerHandler.getContainers).to.not.be.undefined;
        expect(portainerHandler.startContainer).to.not.be.undefined;
        expect(portainerHandler.stopContainer).to.not.be.undefined;
    });

    it('Expect to return configuration parameters', () => {
        return expect(portainerHandler.getConfig()).to.not.be.null;
    });

    it('Expect Portainer instance to be running', () => {
        nock(portainerUri)
            .get('/api/status')
            .reply(200, {
                "Authentication": true,
                "EndpointManagement": true,
                "Snapshot": true,
                "Analytics": true,
                "Version": "Test version"
            });

        return portainerHandler.isUp().then((running) => {
            return expect(running).to.be.true;
        });
    });

    it('Expect Portainer to not be running', () => {
        nock(portainerUri)
            .get('/api/status')
            .replyWithError('Request error');

        return expect(portainerHandler.isUp()).to.be.eventually.rejected;
    });

    it('Expect Portainer login token to be returned', () => {
        nock(portainerUri)
            .post('/api/auth')
            .reply(200, {
                "jwt": "portainer_token"
            });

        return portainerHandler.getToken().then((token) => {
            return expect(token).to.not.be.null;
        });
    });

    it('Expect Portainer login token to not be returned', () => {
        nock(portainerUri)
            .post('/api/auth')
            .replyWithError('Request error');

        return expect(portainerHandler.getToken()).to.be.eventually.rejected;
    });

    it('Expect Portainer to start test container successfully', () => {
        var container = 'test';
        nock(portainerUri)
            .post('/api/auth')
            .reply(200, {
                "jwt": "portainer_token"
            })
            .post('/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/' + container + '/start')
            .reply(200);

        return portainerHandler.startContainer('test').then((status) => {
            return expect(status).to.equal('success');
        });
    });

    it('Expect Portainer to fail starting test container: already running', () => {
        var container = 'test';
        nock(portainerUri)
            .post('/api/auth')
            .reply(200, {
                "jwt": "portainer_token"
            })
            .post('/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/' + container + '/start')
            .reply(304);

        return expect(portainerHandler.startContainer('test')).to.be.eventually.rejectedWith('test container is already running');
    });

    it('Expect Portainer to fail starting test container: request error', () => {
        var container = 'test';
        nock(portainerUri)
            .post('/api/auth')
            .reply(200, {
                "jwt": "portainer_token"
            })
            .post('/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/' + container + '/start')
            .replyWithError('Request error');

        return expect(portainerHandler.startContainer('test')).to.be.eventually.rejected;
    });

    afterEach(() => {
        nock.cleanAll();
        return;
    });

});