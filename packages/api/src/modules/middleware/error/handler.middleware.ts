import { NextFunction, Request, Response } from 'express'
import {
  BadRequestError,
  ExpressErrorMiddlewareInterface,
  Middleware
} from 'routing-controllers'
import { HttpError } from '../../common/http.error'

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error (err: Error | HttpError | BadRequestError | null, req: Request, res: Response, next: NextFunction): any {
    // No error? Return
    if (err != null) {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      return next()
    }

    // HTTP Error
    if (err instanceof HttpError) {
      return res.status(err.statusCode).send({ error: err.serialize() })
    }

    // Handle errors coming from class-validator
    // on controller dtos
    if (err instanceof BadRequestError) {
      return res.status(err.httpCode).send({
        message: err.message,
        // @ts-expect-error
        error: err.errors
      })
    }

    // Return 500 to the client to hide error contents
    return res.sendStatus(500)
  }
}
