/*
  Chane token icon command handler
*/
class HelpUseCase {
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
    this.sendHelp = this.sendHelp.bind(this)
  }

  async sendHelp (inObj = {}) {
    try {
      const { msg } = inObj
      const outputMsg = `
      Welcome to the ${this.config.botName}, 

      Available commands:
    
      /help
        - Bring up this help message.
    
      `
      const sentMsg = await this.libraries.telegramBot.bot.sendMessage(msg.chat.id, outputMsg)
      this.libraries.telegramBot.deleteBotSpam(msg)
      this.libraries.telegramBot.deleteBotSpam(sentMsg)

      return outputMsg
    } catch (error) {
      this.wlogger.error('Error in use-cases/sendHelp()')
      throw error
    }
  }
}

export default HelpUseCase
