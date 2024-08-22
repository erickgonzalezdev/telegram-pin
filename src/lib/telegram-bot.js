import TelegramBot from 'node-telegram-bot-api'
import axios from 'axios'
class TelegramBotLib {
  constructor (localConfig = {}) {
    // Input Validation
    this.config = localConfig
    this.token = this.config.telegramBotToken

    if (!this.token) {
      throw new Error(
        'Bot Telegram token must be passed as BOT_TOKEN environment variable.'
      )
    }

    this.botServiceApi = this.config.botServiceApi
    this.TelegramBot = TelegramBot
    this.bot = {}
    this.axios = axios

    this.delayMs = 10000 // 10 seconds.

    this.itsAPrivateMessage = this.itsAPrivateMessage.bind(this)
    this.deleteBotSpam = this.deleteBotSpam.bind(this)
    this._deleteMsgQuietly = this._deleteMsgQuietly.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.getFilePath = this.getFilePath.bind(this)
  }

  instanceTelegramBot () {
    // Created instance of TelegramBot
    this.bot = new this.TelegramBot(this.token, {
      polling: true,
      baseApiUrl: this.botServiceApi
    })
    return true
  }

  // Verify if the msg comes from a private chat
  async itsAPrivateMessage (msg) {
    const chatType = msg.chat.type
    const msgId = msg.message_id
    const chatId = msg.chat.id

    if (chatType !== 'private') {
      await this._deleteMsgQuietly(chatId, msgId)

      // await this.bot.deleteMessage(chatId, msgId)
      return false
    }

    return true
  }

  // This function will delete the bot messages after a short time window. This
  // prevents bot spam in the channel.
  deleteBotSpam (botMsg, delayMs) {
    // use default ms if there not custom ms provided
    const _delayMs = delayMs || this.delayMs

    if (botMsg.chat.type !== 'private') {
      const timerHandle = setTimeout(this._deleteMsgQuietly.bind(this), _delayMs, botMsg.chat.id, botMsg.message_id)
      return timerHandle
    }
  }

  async _deleteMsgQuietly (chatId, msgId) {
    try {
      await this.bot.deleteMessage(chatId, msgId)
      await this.bot.logout()
    } catch (err) {
      /* Exit quietly */
    }
  }

  async downloadFile (file) {
    try {
      // Download a provided telegram file and store it on ./files
      const result = await this.bot.downloadFile(file.file_id, './files')
      return result
    } catch (error) {
      // throw error
      console.log('Error on downloadFile')
      throw error
    }
  }

  async getFilePath (fileId) {
    try {
      if (!fileId) throw new Error('fileId is required')
      const options = {
        method: 'POST',
        url: `${this.botServiceApi}/bot${this.token}/getFile`,
        data: {
          file_id: fileId
        }
      }

      const result = await this.axios.request(options)
      return result.data
    } catch (error) {
      console.log('Error on getFilePath()')
      throw error
    }
  }
}

export default TelegramBotLib
