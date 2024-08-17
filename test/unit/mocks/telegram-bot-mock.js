const mockMsg = {
  message_id: 46546,
  from: {
    id: 649043967,
    is_bot: false,
    first_name: 'ExampleName',
    last_name: 'ExampleLastN',
    username: 'exampleusername',
    language_code: 'en'
  },
  chat: {
    id: -1107281109,
    title: 'example-test',
    username: 'exampleusername',
    type: 'group'
  },
  date: 6464646466,
  text: 'test'
}

const mockPrivateMsg = {
  message_id: 46546,
  from: {
    id: 649043967,
    is_bot: false,
    first_name: 'ExampleName',
    last_name: 'ExampleLastN',
    username: 'exampleusername',
    language_code: 'en'
  },
  chat: {
    id: -1107281109,
    title: 'example-test',
    username: 'exampleusername',
    type: 'private'
  },
  date: 6464646466,
  text: 'test'
}

const mockGroupMsg = {
  message_id: 46546,
  from: {
    id: 649043967,
    is_bot: false,
    first_name: 'ExampleName',
    last_name: 'ExampleLastN',
    username: 'exampleusername',
    language_code: 'en'
  },
  chat: {
    id: -1107281109,
    title: 'example-test',
    username: 'exampleusername',
    type: 'group'
  },
  date: 6464646466,
  text: 'test'
}

const mockReplyImgMsg = {
  message_id: 46546,
  from: {
    id: 649043967,
    is_bot: false,
    first_name: 'ExampleName',
    last_name: 'ExampleLastN',
    username: 'exampleusername',
    language_code: 'en'
  },
  chat: {
    id: -1107281109,
    title: 'example-test',
    username: 'exampleusername',
    type: 'group'
  },
  date: 6464646466,
  text: 'test',
  reply_to_message: {
    photo: [
      { id: -649043967 },
      { id: -649043967 }
    ]
  }
}

class TelegramBotPackageMock {
  constructor (config = {}) {
    this.config = config
  }

  async deleteMessage () {
    return true
  }

  async sendMessage () {
    return mockMsg
  }

  async downloadFile () {
    return {}
  }
}

export { mockMsg, mockPrivateMsg, mockGroupMsg, mockReplyImgMsg, TelegramBotPackageMock }
