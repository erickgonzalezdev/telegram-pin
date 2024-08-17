import TelegramBotLib from './telegram-bot.js'
import PinService from './pin-service.js'

import Logger from './winston-logger.js'
class Lib {
  constructor (config = {}) {
    this.config = config
    // Setting w-logger
    const loggerInstance = new Logger(this.config)

    loggerInstance.outputToConsole() // Allow the logger to write to the console.

    this.wlogger = loggerInstance.wlogger
    this.config.wlogger = this.wlogger

    this.telegramBot = new TelegramBotLib(this.config)
    this.pinService = new PinService(this.config)
  }
}

export default Lib
