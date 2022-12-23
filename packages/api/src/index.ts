import cors from 'cors'
import express from 'express'
import expressWinston from 'express-winston'
import helmet from 'helmet'
import 'reflect-metadata'
import { useExpressServer } from 'routing-controllers'
import winston from 'winston'
import { clsMiddleware } from './modules/common/cls'

import { HealthController } from './modules/health/health.controller'
import { ErrorHandlerMiddleware } from './modules/middleware/error/handler.middleware'
import { VersionController } from './modules/version/version.controller'

const app = express()

/* Security */
app.use(helmet({ contentSecurityPolicy: false, frameguard: false }))
app.use(cors())
app.use(express.json({ limit: '1MB' }))
app.use(express.urlencoded({ limit: '1MB', extended: true }))
app.use(express.text({ limit: '1MB' }))

// Required for Async operations
app.use(clsMiddleware)

// Log error details using express-winston
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    msg: '{{err.message}}',
    format: winston.format.combine(winston.format.json())
  })
)

useExpressServer(app, {
  defaultErrorHandler: false,
  controllers: [
    HealthController,
    VersionController,
  ],
  middlewares: [ ErrorHandlerMiddleware]
})

export default app