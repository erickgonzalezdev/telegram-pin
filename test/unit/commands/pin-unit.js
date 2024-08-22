import { assert } from 'chai'
import sinon from 'sinon'

import UseCases from '../../../src/use-cases/index.js'
import Libraries from '../../../src/lib/index.js'
import CommandUnderTest from '../../../src/commands/pin.js'
import { TelegramBotPackageMock, mockMsg, mockReplyImgMsg } from '../mocks/telegram-bot-mock.js'
import config from '../../../config.js'

describe('#commands-pin', () => {
  let sandbox, uut, useCases, libraries

  beforeEach(() => {
    libraries = new Libraries(config)
    libraries.telegramBot.bot = new TelegramBotPackageMock()
    useCases = new UseCases({ libraries })

    uut = new CommandUnderTest({ useCases, libraries })

    sandbox = sinon.createSandbox()
  })

  afterEach(async () => {
    sandbox.restore()
  })

  describe('#constructor', () => {
    it('should throw error if useCases instance is not passed in', () => {
      try {
        uut = new CommandUnderTest()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Instance of Use Cases library required when instantiating PinCommand Class.')
      }
    })
    it('should throw an error if libraries are not passed in', () => {
      try {
        uut = new CommandUnderTest({ useCases })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Libraries required when instantiating PinCommand Class.'
        )
      }
    })
  })

  describe('#process', () => {
    it('should return true when triggered', async () => {
      sandbox.stub(uut.useCases.pin, 'pinFile').resolves(true)
      // Mock dependencies
      const result = await uut.process(mockReplyImgMsg)

      assert.isTrue(result)
    })
    it('should return false if is not a reply msg', async () => {
      // Mock dependencies
      const result = await uut.process(mockMsg)

      assert.isFalse(result)
    })
    it('should return false on error', async () => {
      const result = await uut.process()
      assert.isFalse(result)
    })
  })
})
