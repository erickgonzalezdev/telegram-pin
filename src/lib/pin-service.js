// Library to comunicate with the pin service.

import axios from 'axios'
import fs from 'fs'

class PinService {
  constructor (config = {}) {
    this.config = config
    this.wlogger = this.config.wlogger
    this.apiUrl = this.config.pinServiceApi
    this.fs = fs
    this.state = {} // Bot state

    this.wlogger.info(`Pin service api url  :${this.apiUrl}`)

    // Bind functions
    this.registerJWT = this.registerJWT.bind(this)
    this.pinFile = this.pinFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  registerJWT (inObj = {}) {
    try {
      const { chatId, JWT } = inObj

      this.state[chatId] = JWT
    } catch (error) {
      this.wlogger.error('Error on addState()')
      throw error
    }
  }

  async pinFile (inObj = {}) {
    try {
      const { chatId, name, description, path } = inObj

      const jwt = this.state[chatId]
      if (!jwt) {
        throw new Error('could not verify JWT')
      }

      const file = await this.uploadFile({ path, chatId })
      const options = {
        method: 'POST',
        url: `${this.apiUrl}/pin`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        data: {
          fileId: file._id,
          name,
          description
        }
      }
      const result = await axios(options)
      this.wlogger.info('pinFile result ', result.data)
      return result.data
    } catch (error) {
      this.wlogger.error('Error on pinFile()')
      throw error
    }
  }

  async uploadFile (inObj = {}) {
    try {
      const { path, chatId } = inObj
      if (!this.fs.existsSync(path)) {
        throw new Error('file not found!')
      }
      const jwt = this.state[chatId]

      const form = new FormData()
      const axiosConfig = {
        headers: form.getHeaders()
      }

      axiosConfig.headers.Authorization = `Bearer ${jwt}`
      form.append('file', this.fs.createReadStream(path), 'test')

      // Send the file to the ipfs-file-stage server.
      const result = await axios.post(`${this.apiUrl}/files`, form, axiosConfig)
      this.wlogger.info('upload result ', result.data)
      return result.data
    } catch (error) {
      this.wlogger.error('Error on uploadFile()')
      throw error
    }
  }
}

export default PinService
