import config from './config.js'

import Controller from './src/controller.js'

class Server {
  constructor () {
    this.config = config
    this.start = this.start.bind(this)
  }

  async start () {
    // Connect to the Mongo Database.

    this.controller = new Controller(config)
    this.controller.start()

    this.controller.libraries.wlogger.info('Bot started')
  }
}

export default Server
