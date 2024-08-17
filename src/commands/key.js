class KeyCommand {
  constructor (config = {}) {
    this.useCases = config.useCases

    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating KeyCommand Class.'
      )
    }

    this.libraries = config.libraries
    if (!this.libraries) {
      throw new Error(
        'Instance of Libraries required when instantiating KeyCommand Class.'
      )
    }
    this.wlogger = this.libraries.wlogger

    // Bind all sub functions
    this.process = this.process.bind(this)
  }

  async process (msg) {
    try {
      // Convert the message into an array of parts.
      const msgParts = msg.text.toString().split(' ')

      // Ignore if there are insufficients words in the command.
      if (msgParts.length === 1) return

      const isReplyMsg = msg.reply_to_message

      const inputObjs = {
        msgParts,
        isReplyMsg,
        msg
      }
      // tokenize images
      await this.useCases.key.setKey(inputObjs)

      return true
    } catch (err) {
      this.wlogger.error('Error on commands/help/process()')
      throw err
    }
  }
}

export default KeyCommand
