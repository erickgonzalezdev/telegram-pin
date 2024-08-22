import { assert } from 'chai'

import sinon from 'sinon'
import LibUnderTest from '../../../src/lib/pin-service.js'

describe('#PinServiceLibrary', () => {
  let sandbox
  let uut

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    uut = new LibUnderTest({ pinServiceApi: 'http://localhost:{port}' })
    uut.wlogger = { info: () => {}, error: () => {} }
  })
  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if api url is not specified', () => {
      try {
        uut = new LibUnderTest()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'API url is required when instantiate PinService library.'
        )
      }
    })
  })

  describe('#registerJWT', () => {
    it('should throw an error if chatId is not provided!', async () => {
      try {
        await uut.registerJWT()

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'chatId is required')
      }
    })

    it('should throw an error if JWT is not provided!', async () => {
      try {
        await uut.registerJWT({ chatId: 'telegram chat id' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'JWT is required')
      }
    })
    it('should register jwt into the state', async () => {
      try {
        const inObj = { chatId: 'telegram chat id', JWT: 'myjwt' }
        await uut.registerJWT(inObj)
        assert.equal(uut.state[inObj.chatId], inObj.JWT)
      } catch (error) {
        assert.fail('Unexpected code path')
      }
    })
  })
  describe('#pinFile', () => {
    it('should throw an error if chatId JWT is not found!', async () => {
      try {
        await uut.pinFile({ chatId: 'telegram chat id' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'could not verify JWT')
      }
    })

    it('should throw an error if file could not be uploaded!', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut, 'uploadFile').throws(new Error('test error'))
        await uut.pinFile({ chatId: 'telegram chat id' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })
    it('should handle axios error!', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut, 'uploadFile').resolves({})
        sandbox.stub(uut.axios, 'request').throws(new Error('test error'))

        await uut.pinFile({ chatId: 'telegram chat id' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })
    it('should pin file', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut, 'uploadFile').resolves({})
        sandbox.stub(uut.axios, 'request').resolves({ data: {} })

        const result = await uut.pinFile({ chatId: 'telegram chat id', name: 'optional name', description: 'optional description' })
        assert.isObject(result)
        assert.property(result, 'cid')
      } catch (error) {
        assert.fail('Unexpected code path')
      }
    })
  })

  describe('#uploadFile', () => {
    it('should throw an error if chatId JWT is not found!', async () => {
      try {
        await uut.uploadFile({ chatId: 'telegram chat id', path: 'myfile/path.jpeg' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'could not verify JWT')
      }
    })

    it('should throw an error if file is not found!', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut.fs, 'existsSync').returns(false)
        await uut.uploadFile({ chatId: 'telegram chat id', path: 'myfile/path.jpeg' })

        assert.fail('Unexpected code path')
      } catch (error) {
        console.error(error)
        assert.include(error.message, 'file not found')
      }
    })
    it('should handle axios error!', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut.fs, 'existsSync').resolves(false)
        sandbox.stub(uut.axios, 'post').throws(new Error('test error'))

        await uut.uploadFile({ chatId: 'telegram chat id', path: 'myfile/path.jpeg' })

        assert.fail('Unexpected code path')
      } catch (error) {
        assert.include(error.message, 'test error')
      }
    })
    it('should upload file', async () => {
      try {
        uut.state['telegram chat id'] = 'JWT'
        sandbox.stub(uut.fs, 'existsSync').resolves(false)
        sandbox.stub(uut.axios, 'post').resolves({ data: 'success' })

        const result = await uut.uploadFile({ chatId: 'telegram chat id', path: 'myfile/path.jpeg' })
        assert.isString(result)
        assert.equal(result, 'success')
      } catch (error) {
        console.error(error)
        assert.fail('Unexpected code path')
      }
    })
  })
})
