/*
  Chane token icon command handler
*/
class PinUseCase {
  constructor (config = {}) {
    this.libraries = config.libraries
    if (!this.libraries) {
      throw new Error(
        'Instance of Libraries required when instantiating PinUseCase Class.'
      )
    }

    this.wlogger = this.libraries.wlogger

    this.config = config
    // Bind all sub functions
    this.pinFile = this.pinFile.bind(this)
    this.getFileFromRplyMsg = this.getFileFromRplyMsg.bind(this)
    this.handleError = this.handleError.bind(this)
  }

  async pinFile (inObj = {}) {
    const { msg, msgParts } = inObj
    try {
      if (!msg) throw new Error('msg is required')

      const userName = msg.from.username || msg.from.first_name

      // console.log(msg)
      const name = msgParts[1]
      const description = msgParts[2]

      const chatId = msg.from.id
      // Verify JWT
      if (!this.libraries.pinService.state[chatId]) {
        throw new Error('Missing JWT')
      }
      // get file data from msg
      const file = this.getFileFromRplyMsg(msg)
      if (!file) throw new Error('Unknow file type')

      // Send user notification.
      const outputMsg = `Dear @${userName} you file is being processed. We will notify you when it is complete.`
      const sentMsg = await this.libraries.telegramBot.bot.sendMessage(msg.chat.id, outputMsg)

      // delete /pin command msg
      this.libraries.telegramBot._deleteMsgQuietly(msg)

      console.log('downloading File')
      const fileRes = await this.libraries.telegramBot.getFilePath(file.file_id)

      const obj = {
        chatId,
        name: name || '',
        description: description || '',
        path: fileRes.result.file_path

      }
      const pinRes = await this.libraries.pinService.pinFile(obj)
      this.libraries.telegramBot._deleteMsgQuietly(sentMsg)
      const outputMsg2 = `Dear @${userName} you pin request has been created successfully.\n<code>${this.config.pinServiceGateway}/ipfs/${pinRes.cid}</code>`
      await this.libraries.telegramBot.bot.sendMessage(msg.chat.id, outputMsg2, { parse_mode: 'HTML' })
      return true
    } catch (error) {
      this.wlogger.error('Error in use-cases/pin()')
      this.handleError(error, msg)
      throw error
    }
  }

  getFileFromRplyMsg (msg) {
    try {
      if (!msg) throw new Error('msg is required!')
      const replyToMsg = msg.reply_to_message
      if (!replyToMsg) return false

      if (replyToMsg.photo) return replyToMsg.photo[1]
      if (replyToMsg.document) return replyToMsg.document
      if (replyToMsg.video) return replyToMsg.video
      if (replyToMsg.animation) return replyToMsg.animation

      return false
    } catch (error) {
      this.wlogger.error('Error in use-cases/getFileFromRplyMsg()')
      throw error
    }
  }

  // Send a msg to the user if /updateNFT command throws an error
  async handleError (error, msg) {
    try {
      const chatId = msg.chat.id
      const userName = msg.from.username || msg.from.first_name

      let outputMsg = `Dear @${userName}, an internal error occurred while running /pin command.`

      if (error.message && error.message.match('JWT')) {
        outputMsg += '\nError: Missing api-key.}'
      }

      const sentMsg = await this.libraries.telegramBot.bot.sendMessage(chatId, outputMsg, { parse_mode: 'HTML' })
      this.libraries.telegramBot.deleteBotSpam(sentMsg)
      return outputMsg
    } catch (error) {
      this.wlogger.error('Error in use-cases/commands/pin/handleError()')
      return false
    }
  }
}

export default PinUseCase
