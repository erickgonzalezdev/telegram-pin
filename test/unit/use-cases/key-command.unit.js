// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
// const testUtils = require('../../utils/test-utils')

import Libraries from '../../../src/lib/index.js'
import UseCaseUnderTest from '../../../src/use-cases/key-command-uc.js'
import { TelegramBotPackageMock, mockMsg } from '../mocks/telegram-bot-mock.js'
import config from '../../../config.js'

describe('#key-use-case', () => {
  let uut, libraries
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    libraries = new Libraries(config)
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

  describe('#setKey', () => {
    it('should throw an error if msg is nto provided', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.libraries.pinService, 'registerJWT').throws(new Error('test error'))

        await uut.setKey({ })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'msg is required')
      }
    })
    it('should throw an error if command text is incomplete', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut.libraries.pinService, 'registerJWT').throws(new Error('test error'))

        await uut.setKey({ msg: mockMsg, msgParts: ['/setKey'] })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })

    it('should send success message', async () => {
      // Mock dependencies
      sandbox.stub(uut.libraries.pinService, 'registerJWT').resolves(true)
      sandbox.stub(uut.libraries.telegramBot.bot, 'sendMessage').resolves(true)
      const result = await uut.setKey({ msg: mockMsg, msgParts: ['/setKey', 'mykey'] })

      assert.isTrue(result)
    })
  })
})
