import { Sequelize } from 'sequelize'
import { logger } from './modules/common/logger'

const { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } = process.env

export const dbConnection = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: (msg) => logger.debug(msg.replace(/\r?\n|\r/g, ''))
})

export const connect = async (): Promise<void> => {
  try {
    logger.info('⌚️ Connecting to MySQL')
    await dbConnection.authenticate()
    logger.info('✅ Connection has been established successfully.')
  } catch (error) {
    logger.error('❌ Unable to connect to the database:', error)
  }
}
