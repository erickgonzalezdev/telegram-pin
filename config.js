const env = process.env.ENVIROMENT || 'development'

const config = {
  botName: 'Starter-Bot',
  telegramBotToken: process.env.BOT_TOKEN, // Teelgram Bot Token
  env,
  pinServiceApi: process.env.PIN_SERVICE_API || 'http://localhost:5001'
}

export default config
