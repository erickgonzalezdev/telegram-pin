/**
 * Integration with telegram-bot-api.
 *
 * INSTRUCTIONS.
 *
 * To use this telegram bot without download and upload limits we need
 * to install telegram-bot-api https://github.com/tdlib/telegram-bot-api/tree/master
 *
 * Install :  https://tdlib.github.io/telegram-bot-api/build.html?os=Linux
 *
 * make sure to install on the same server as this repository.
 *
 *
 * Visit https://my.telegram.org/apps in order to get a key a <api-id> and <api-hash>
 *
 * to run the api move to the repository and use ./bin/telegram-bot-api --api-id=<api-id> --api-hash=<api-hash> --local
 *
 * set the enviroment BOT_URL to this repositorio  with the telegram-bot-api url.
 *
 */
import Server from './server.js'
const server = new Server()

server.start()
