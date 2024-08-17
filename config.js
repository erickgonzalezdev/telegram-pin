const env = process.env.ENVIROMENT || 'development'

const config = {
  botName: 'Starter-Bot',
  telegramBotToken: process.env.BOT_TOKEN, // Teelgram Bot Token
  env
}

export default config
