// Public npm libraries
import { assert } from 'chai'
import sinon from 'sinon'

// Local support libraries
// const testUtils = require('../../utils/test-utils')

import Libraries from '../../../src/lib/index.js'
import UseCaseUnderTest from '../../../src/use-cases/pin-command-uc.js'
import { TelegramBotPackageMock, mockMsg, mockReplyImgMsg } from '../mocks/telegram-bot-mock.js'
import config from '../../../config.js'

describe('#pin-use-case', () => {
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
          'Instance of Libraries required when instantiating PinUseCase Class.'
        )
      }
    })
  })

  describe('#getFileFromRplyMsg', () => {
    it('should throw an error if input is missing ', () => {
      try {
        uut.getFileFromRplyMsg()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'msg is required!'
        )
      }
    })
    it('should return false if is not a reply message', () => {
      try {
        const result = uut.getFileFromRplyMsg(mockMsg)
        assert.isFalse(result)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
    it('should return photo type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { photo: ['file1', 'file2'] }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isString(result)
        assert.equal(result, 'file2')
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
    it('should return video type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { video: 'video' }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isString(result)
        assert.equal(result, 'video')
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
    it('should return document type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { document: 'document' }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isString(result)
        assert.equal(result, 'document')
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
    it('should return animation type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { animation: 'animation' }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isString(result)
        assert.equal(result, 'animation')
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
    it('should return sticker type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { sticker: 'sticker' }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isString(result)
        assert.equal(result, 'sticker')
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should return false for unknow type', () => {
      try {
        const mock = Object.assign({}, mockReplyImgMsg)
        mock.reply_to_message = { unknow: 'unknow' }
        const result = uut.getFileFromRplyMsg(mock)
        assert.isFalse(result)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
  })

  describe('#pinFile', () => {
    it('should throw an error if msg is not provided', async () => {
      try {
        await uut.pinFile({})

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'msg is required')
      }
    })
    it('should throw an error if JWT is not found', async () => {
      try {
        // Mock dependencies

        uut.libraries.pinService.state[mockReplyImgMsg.from.id] = null
        await uut.pinFile({ msg: mockMsg, msgParts: ['/pin'] })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'Missing JWT')
      }
    })
    it('should throw an error for unknow file type', async () => {
      try {
        // Mock dependencies

        uut.libraries.pinService.state[mockReplyImgMsg.from.id] = 'mykey'
        await uut.pinFile({ msg: mockMsg, msgParts: ['/pin'] })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'Unknow file type')
      }
    })
    it('should throw an error  getting file path', async () => {
      try {
        // Mock dependencies
        sandbox.stub(uut, 'getFileFromRplyMsg').resolves(true)
        sandbox.stub(uut.libraries.telegramBot, 'getFilePath').throws(new Error('test error'))
        uut.libraries.pinService.state[mockReplyImgMsg.from.id] = 'mykey'
        await uut.pinFile({ msg: mockMsg, msgParts: ['/pin'] })

        assert.fail('unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })

    it('should pin reply file', async () => {
      // Mock dependencies
      sandbox.stub(uut, 'getFileFromRplyMsg').resolves(true)
      sandbox.stub(uut.libraries.telegramBot.bot, 'sendMessage').resolves(true)
      sandbox.stub(uut.libraries.telegramBot, 'getFilePath').resolves({ result: { file_path: 'path' } })
      sandbox.stub(uut.libraries.pinService, 'pinFile').resolves(true)
      uut.libraries.pinService.state[mockReplyImgMsg.from.id] = 'mykey'
      const result = await uut.pinFile({ msg: mockMsg, msgParts: ['/pin'] })

      assert.isTrue(result)
    })
  })
})
