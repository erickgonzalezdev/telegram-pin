import Commands from './commands/index.js'
import UseCases from './use-cases/index.js'
import Libraries from './lib/index.js'
import ErrorHandler from './utils/error.js'

export default class InitController {
  constructor (config = {}) {
    this.config = config

    this.errorHandler = new ErrorHandler()
    this.config.errorHandler = this.errorHandler

    this.libraries = new Libraries(config)
    this.config.libraries = this.libraries

    this.useCases = new UseCases(this.config)
    this.config.useCases = this.useCases

    this.commands = new Commands(this.config)

    this.start = this.start.bind(this)
  }

  start () {
    this.commands.startBot()
  }
}
