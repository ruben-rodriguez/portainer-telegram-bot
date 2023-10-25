# portainer-telegram-bot

[![Build Status](https://travis-ci.org/ermus19/portainer-telegram-bot.svg?branch=dev)](https://travis-ci.org/ermus19/portainer-telegram-bot)

## Simple Telegram Bot to manage Docker through Portainer API

#### Built thanks to the following libraries:

* [Telegraf](https://telegraf.js.org) - Telegram Bot framework for Nodejs.
* [request-promise](https://github.com/request/request-promise) - The simplified HTTP request client 'request' with Promise support. Powered by Bluebird.
* [Winston](https://github.com/winstonjs/winston) - A logger for just about everything. 
* [Mocha](https://mochajs.org/) - The fun, simple, flexible JavaScript test framework.
* [Chai](https://www.chaijs.com/) - Assertion library for Node.
* [Nock](https://github.com/nock/nock) - HTTP server mocking and expectations library for Node.

#### Supports the following commands:

* `/help` - Prints this list
* `/hello` - Say hello!
* `/status` - Prints Portainer instance status
* `/get_containers` - Prints list of containers and status
* `/start_container` - Displays inline keyboard with containers to start if any
* `/stop_container` - Displays inline keyboard with containers to stop if any

#### Available ENV variables to configure application:

**Portainer:**

* `PORTAINER_HOST` = Hostname/IP used by Portainer instance. Default value is 'testhost'
* `PORTAINER_PORT` = Port number used by Portainer instance. Default value is '9000'
* `PORTAINER_USER` = Username used to log in Portainer instance. Default value is 'admin'
* `PORTAINER_PASSWORD` = Password of Portainer user configured. Default value is 'adminpassword'
* `PORTAINER_ENDPOINT` = Endpoint ID to manage. Default value is '1'

**Telegram:**

* `BOT_TOKEN` = Telegram Bot token provided by [@BotFather](https://telegram.me/BotFather)
* `TELEGRAM_USERS` = List of Telegram users authorized to use the application. Default value is ''

### Running Mocha test suite (locally)

Clone this repository:

```sh
$: git clone https://github.com/ruben-rodriguez/portainer-telegram-bot
```

Install dependencies:
```sh
$: npm install
```

Run test cases (no need to set any ENV variable):

```sh
$: npm test
```


### Runing on local machine 

Clone this repository:

```sh
$: git clone https://github.com/ruben-rodriguez/portainer-telegram-bot
```

Install dependencies:
```sh
$: npm install
```

Run (Don't forget to set ENV variables appropriately):

```sh
$: npm start
```

### Runing on Docker container

Clone this repository:

```sh
$: git clone https://github.com/ruben-rodriguez/portainer-telegram-bot
```

Leverage `docker-build.sh` tool. Follows example usage:

```sh
$: sudo ./scripts/docker-build.sh "-e PORTAINER_HOST=127.0.0.1 -e BOT_TOKEN=xxxxxxxxx:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq -e TELEGRAM_USERS=TelegramUser,TelegramUser2"
```

**Note**: sudo is required to execute Docker commands used by the script. Reading of the script before executing is encouraged!
