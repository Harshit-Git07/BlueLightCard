import { AddressInfo } from 'net'
import { logger } from './modules/common/logger'
import { connect as mysqlConnect } from './mysql.db'

import app from '.'

const { PORT = 1337, SERVER_TIMEOUT = '65000' } = process.env

const init = async () => {
  await Promise.all([mysqlConnect()])
  // Launch the server on port
  const server = app.listen(PORT, () => {
    const { address, port } = server.address() as AddressInfo
    logger.info(`👋 Hey - Listening: http://${address}:${port}`)
  })

  server.setTimeout(parseInt(SERVER_TIMEOUT, 10))
}

init()

process.on('uncaughtException', (err) => {
  logger.error('There was an uncaught error')
  logger.error(err.message)
  process.exit(1) // mandatory (as per the Node.js docs)
})