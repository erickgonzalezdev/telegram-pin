import { assert } from 'chai'
import sinon from 'sinon'

import UseCases from '../../../src/use-cases/index.js'
import Libraries from '../../../src/lib/index.js'
import CommandUnderTest from '../../../src/commands/help.js'
import { TelegramBotPackageMock, mockMsg } from '../mocks/telegram-bot-mock.js'

describe('#commands-help', () => {
  let sandbox, uut, useCases, libraries

  beforeEach(() => {
    libraries = new Libraries({ telegramBotToken: 'test token' })
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
        assert.include(err.message, 'Instance of Use Cases library required when instantiating HelpCommand Class.')
      }
    })
    it('should throw an error if libraries are not passed in', () => {
      try {
        uut = new CommandUnderTest({ useCases })

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of Libraries required when instantiating HelpCommand Class.'
        )
      }
    })
  })

  describe('#process', () => {
    it('should return message when triggered', async () => {
      // Mock dependencies
      const result = await uut.process(mockMsg)

      assert.isTrue(result)
    })

    it('should skip there are any additional words in the command', async () => {
      // Mock dependencies
      mockMsg.text = '/help test'
      const result = await uut.process(mockMsg)

      assert.equal(result, undefined)
    })

    it('should catch and throw errors', async () => {
      try {
        await uut.process()

        assert.fail('Unexpected result')
      } catch (err) {
        assert.include(err.message, 'Cannot read')
      }
    })
  })
})
