import { createLogger, transports, format } from 'winston'

interface FormatPrint {
  timestamp?: string
  level?: string
  message?: string
}

export const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp = '', level = '', message = '' }: FormatPrint) => {
      return `[${timestamp}] ${level}: ${message}`
    })
  )
})
