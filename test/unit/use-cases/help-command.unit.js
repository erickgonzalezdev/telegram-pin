// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
// const testUtils = require('../../utils/test-utils')

import Libraries from '../../../src/lib/index.js'
import UseCaseUnderTest from '../../../src/use-cases/help-command-uc.js'
import { TelegramBotPackageMock, mockMsg } from '../mocks/telegram-bot-mock.js'

describe('#help-use-case', () => {
  let uut, libraries
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    libraries = new Libraries({ telegramBotToken: 'test token' })
    libraries.telegramBot.bot = new TelegramBotPackageMock()
    uut = new UseCaseUnderTest({ libraries })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if libraries are not passed in', () => {
      try {
        uut = new UseCaseUnderTest()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Libraries required when instantiating HelpUseCase Class.'
        )
      }
    })
  })

  describe('#sendHelp', () => {
    it('should handle error', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.libraries.telegramBot.bot, 'sendMessage').throws(new Error('test error'))

        await uut.sendHelp({ msg: mockMsg })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })

    it('should send help message', async () => {
      // Mock dependencies

      const result = await uut.sendHelp({ msg: mockMsg })

      assert.isString(result)
    })
  })
})
