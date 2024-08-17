import { assert } from 'chai'

import sinon from 'sinon'
import LibUnderTest from '../../../src/lib/telegram-bot.js'
import { TelegramBotPackageMock, mockPrivateMsg, mockGroupMsg } from '../mocks/telegram-bot-mock.js'

describe('#TelegramBotLibrary', () => {
  let sandbox
  let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new LibUnderTest({ telegramBotToken: 'test token' })
    uut.bot = new TelegramBotPackageMock()
  })
  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if telegram token is not specified', () => {
      try {
        uut = new LibUnderTest()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Bot Telegram token must be passed as BOT_TOKEN environment variable.'
        )
      }
    })
  })

  describe('#instanceTelegramBot', () => {
    it('should instance telegram bot', () => {
      uut.TelegramBot = TelegramBotPackageMock
      const result = uut.instanceTelegramBot()
      assert.isTrue(result)
    })
  })

  describe('#itsAPrivateMessage', () => {
    it('should verify if the msg comes from a private chat', async () => {
      // Mock dependencies

      const result = await uut.itsAPrivateMessage(mockPrivateMsg)

      assert.equal(result, true)
    })

    it('should return false if the msg comes from a non-private chat', async () => {
      const result = await uut.itsAPrivateMessage(mockGroupMsg)

      assert.equal(result, false)
    })
  })

  describe('#delebeBotSpam', () => {
    it('should start a timer', () => {
      const timerHandle = uut.deleteBotSpam(mockGroupMsg)
      const delayMs = timerHandle._idleTimeout

      clearTimeout(timerHandle)

      assert.equal(delayMs, uut.delayMs)
    })
    it('should start a timer with the provided ms', () => {
      const customMs = 2500
      const timerHandle = uut.deleteBotSpam(mockGroupMsg, customMs)
      const delayMs = timerHandle._idleTimeout
      clearTimeout(timerHandle)

      assert.equal(delayMs, customMs)
    })
  })

  describe('#_deleteMsgQuietly', () => {
    it('should delete msg quietly', async () => {
      await uut._deleteMsgQuietly('chat id', 'msg id')
      assert(true, 'Test passed')
    })

    it('should ignore errors', async () => {
      sandbox.stub(uut.bot, 'deleteMessage').throws(new Error('test error'))
      await uut._deleteMsgQuietly('chat id', 'msg id')
      assert(true, 'Test passed')
    })
  })

  describe('#downloadFile', () => {
    it('should download file', async () => {
      await uut.downloadFile({ file_id: 'a file id ' })
      assert(true, 'Test passed')
    })

    it('should handle error', async () => {
      try {
        sandbox.stub(uut.bot, 'downloadFile').throws(new Error('test error'))
        await uut.downloadFile({ file_id: 'a file id ' })
        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })
  })
})
