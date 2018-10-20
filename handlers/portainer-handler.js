const logger = require('../config/logger-config');
const request = require('request-promise');
const portainerConfig = require('../config/portainer-config');

const host = portainerConfig.host;
const port = portainerConfig.port;
const user = portainerConfig.user;
const password = portainerConfig.password;
var running = false;

logger.info('Portainer Handler: Starting handler...');
logger.info('Portainer Handler: Checking Portainer instance runninng on ' + host + ':' + port + '...');

isUp().then(function (data) {

    logger.info('Portainer Handler: Portainer instance is running');

}).catch(function (err) {

    logger.error('Portainer Handler: Portainer instance is not running ' + err);

});

function isUp() {

    return new Promise(function (resolve, reject) {

        request('http://' + host + ':' + port + '/api/status').then(function (data) {

            logger.info('Portainer Handler: Portainer version ' + JSON.parse(data).Version + ' is running');
            running = true;
            resolve(running);

        }).catch(function (err) {

            logger.error('Portainer Handler: Portainer instance not running: ' + err);
            running = false;
            reject(err);

        });

    });

}

function getConfig() {

    logger.info('Portainer Handler: configuration parameters requested');

    var config = {

        host: host,
        port: port,
        user: user,
        password: password

    }

    logger.info('Portainer Handler: configuration parameters: ' + JSON.stringify(config));

    return config;
}

function getToken() {

    logger.info('Portainer Handler: retrieving Portainer API autheintication token');

    return new Promise(function (resolve, reject) {

        var token = '';
        var options = {
            method: 'POST',
            uri: 'http://' + host + ':' + port + '/api/auth',
            body: {
                Username: user,
                Password: password
            },
            json: true // Automatically stringifies the body to JSON
        }

        request(options).then(function (data) {

            logger.info('Portainer Handler: Portainer token successfully retrieved: ' + data.jwt);
            token = data.jwt;
            resolve(token);

        }).catch(function (err) {

            logger.error('Portainer Handler: Unexpected error during token retrieval ' + err);
            reject(err);

        });

    });

}

function getContainers(state) {

    logger.info('Portainer Handler: retrieving container list: ' + state);

    return new Promise(function (resolve, reject) {

        getToken().then(function (token) {

            var options = {
                method: 'GET',
                uri: 'http://' + host + ':' + port + '/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/json?all==true',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                json: true // Automatically stringifies the body to JSON
            }

            request(options).then(function (data) {

                logger.debug('Portainer Handler: containers response body: ' + JSON.stringify(data));

                var containers;

                if (state === 'all') {

                    var containers = '';

                    data.forEach(element => {

                        containers += 'Container ' + element.Names[0].substring(1) + ' ' + element.State + ' ' + element.Status;
                        containers += '\n';

                    });

                } else if (state === 'stopped') {

                    var containers = [];

                    data.forEach(element => {

                        if (element.State != 'running')
                            containers.push(
                                {
                                    name: element.Names[0].substring(1)
                                }
                            )

                    });

                } else if (state === 'running') {

                    var containers = [];

                    data.forEach(element => {

                        if (element.State === 'running')
                            containers.push(
                                {
                                    name: element.Names[0].substring(1)
                                }
                            )

                    });

                }

                resolve(containers);

            }).catch(function (err) {

                logger.error('Portainer Handler: Unexpected error during containers retrieval ' + err);
                reject(err);

            });

        }).catch(function (err) {

            logger.error('Portainer Handler: Unexpected error during containers retrieval ' + err);
            reject(err);

        });

    });
}

function startContainer(container) {

    return new Promise(function (resolve, reject) {

        getToken().then(function (token) {

            var options = {
                method: 'POST',
                uri: 'http://' + host + ':' + port + '/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/' + container + '/start',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                json: true // Automatically stringifies the body to JSON
            }

            request(options).then(function (data) {

                logger.info('Portainer Handler: container ' + container + ' successfully started');
                resolve('success');

            }).catch(function (err) {

                logger.error('Portainer Handler: Unexpected error during container start operation: ' + err);
                var status = err.statusCode;

                if (status === 304) {

                    logger.warn('Portainer Handler: Container already running');
                    reject(container + ' container is already running');

                }

                reject('Container already running');

            });

        }).catch(function (err) {

            logger.error('Portainer Handler: Unexpected error during Portainer API token retrieval ' + err);
            reject(err);

        });

    });

}

function stopContainer(container) {

    return new Promise(function (resolve, reject) {

        getToken().then(function (token) {

            var options = {
                method: 'POST',
                uri: 'http://' + host + ':' + port + '/api/endpoints/' + portainerConfig.endpoint + '/docker/containers/' + container + '/stop',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                json: true // Automatically stringifies the body to JSON
            }

            request(options).then(function (data) {

                logger.info('Portainer Handler: container ' + container + ' successfully stopped');
                resolve('success');

            }).catch(function (err) {

                logger.error('Portainer Handler: Unexpected error during container stop operation: ' + err);
                var status = err.statusCode;

                if (status === 304) {

                    logger.warn('Portainer Handler: Container already stopped');
                    reject(container + ' container is already stopped');

                }

                reject('Container already running');

            });

        }).catch(function (err) {

            logger.error('Portainer Handler: Unexpected error during Portainer API token retrieval ' + err);
            reject(err);

        });

    });

}

module.exports = {
    isUp: isUp,
    getConfig: getConfig,
    getToken: getToken,
    getContainers: getContainers,
    startContainer: startContainer,
    stopContainer: stopContainer
}