const env = process.env.ENVIROMENT || 'development'

const config = {
  botName: 'Starter-Bot',
  telegramBotToken: process.env.BOT_TOKEN || 'telegram bot', // Teelgram Bot Token
  env,
  pinServiceApi: process.env.PIN_SERVICE_API || 'http://localhost:5001',
  botServiceApi: process.env.BOT_URL || 'https://api.telegram.org',
  pinServiceGateway: process.env.GATEWAY || 'http://localhost:8080'

}

export default config
