import {
    BadRequestError,
    ExpressErrorMiddlewareInterface,
    Middleware
  } from 'routing-controllers'
import { HttpError } from '../../common/http.error'
  
  @Middleware({ type: 'after' })
  export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    error(err, req, res, next) {
      // No error? Return
      if (!err) {
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
          // @ts-ignore
          error: err.errors
        })
      }
  
      // Return 500 to the client to hide error contents
      return res.sendStatus(500)
    }
  }