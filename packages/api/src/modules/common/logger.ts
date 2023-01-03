import { createLogger, format, transports } from 'winston'

const { colorize, errors, timestamp, simple, combine } = format

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'warn',
  exitOnError: false,
  transports: [
    new transports.Console({
      format:
        process.env.ENV === 'development'
          ? combine(errors({ stack: true }), colorize(), timestamp(), simple())
          : format.json(),
      handleExceptions: false
    })
  ]
})
