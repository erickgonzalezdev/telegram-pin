import HelpUseCase from './help-command-uc.js'
import KeyCommand from './key-command-uc.js'
export default class UseCases {
  constructor (config = {}) {
    if (!config.libraries) { throw new Error('Libraries instance should be passed in UseCases Constructor.') }

    this.help = new HelpUseCase(config)
    this.key = new KeyCommand(config)
  }
}
