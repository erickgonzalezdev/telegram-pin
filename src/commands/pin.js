class PinCommand {
  constructor (config = {}) {
    this.useCases = config.useCases

    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating PinCommand Class.'
      )
    }

    this.libraries = config.libraries
    if (!this.libraries) {
      throw new Error(
        'Instance of Libraries required when instantiating PinCommand Class.'
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

      // Ignore if there are a reply file.
      if (!msg.reply_to_message) return false

      const inputObjs = {
        msgParts,
        msg
      }
      // tokenize images
      await this.useCases.pin.pinFile(inputObjs)

      return true
    } catch (err) {
      this.wlogger.error('Error on commands/help/process()')
      return false
    }
  }
}

export default PinCommand
