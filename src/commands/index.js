import HelpCommand from './help.js'
import KeyCommand from './key.js'
import PinCommand from './pin.js'

export default class Commands {
  constructor (config = {}) {
    this.config = config
    this.useCases = config.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases required when instantiating Commands Class.'
      )
    }
    this.libraries = config.libraries

    if (!this.libraries) {
      throw new Error(
        'Instance of Libraries equired when instantiating Commands Class.'
      )
    }
    this.wlogger = this.libraries.wlogger
    this.telegramBot = this.libraries.telegramBot

    // commands
    this.help = new HelpCommand(this.config)
    this.key = new KeyCommand(this.config)
    this.pin = new PinCommand(this.config)

    // Bind function to this class.
    this.startBot = this.startBot.bind(this)
    this.processMsg = this.processMsg.bind(this)
  }

  startBot () {
    try {
      this.telegramBot.instanceTelegramBot()
      this.bot = this.telegramBot.bot

      /**
       * To manage the bot in groups, the bot must have administrator privileges
       * so that in this way it has permissions to obtain  some information .
       *
       */

      // Bot event hooks.
      this.bot.on('message', this.processMsg)
      this.bot.onText(/\/help/, this.help.process)
      this.bot.onText(/\/start/, this.help.process)
      this.bot.onText(/\/setkey/, this.key.process)
      this.bot.onText(/\/pin/, this.pin.process)

      // this.bot.on('polling_error', console.log)

      return true
    } catch (err) {
      this.wlogger.error('Error in controllers/chat-bot/index.js/startBot()')
      throw err
    }
  }

  // Process all messages.
  async processMsg (msg) {
    try {
      // Query the tgUser model from the data.
      const tgId = msg.from.id
      this.wlogger.info(`Message received from ${tgId}`)
      return true
    } catch (err) {
      return false
    }
  }
}
