/*
  Chane token icon command handler
*/
class KeyUseCase {
  constructor (config = {}) {
    this.libraries = config.libraries
    if (!this.libraries) {
      throw new Error(
        'Instance of Libraries required when instantiating HelpUseCase Class.'
      )
    }

    this.wlogger = this.libraries.wlogger

    this.config = config
    // Bind all sub functions
    this.setKey = this.setKey.bind(this)
  }

  async setKey (inObj = {}) {
    try {
      const { msg, msgParts } = inObj

      const JWT = msgParts[1]
      const chatId = msg.from.id
      this.libraries.pinService.registerJWT({ JWT, chatId })

      const sentMsg = await this.libraries.telegramBot.bot.sendMessage(msg.chat.id, 'Key registered.')
      this.libraries.telegramBot.deleteBotSpam(msg)
      this.libraries.telegramBot.deleteBotSpam(sentMsg)
    } catch (error) {
      this.wlogger.error('Error in use-cases/setKey()')
      throw error
    }
  }
}

export default KeyUseCase
