import { ApiError } from './http'

export function notFound(message?: string): never {
  throw new ApiError({
    code: 'NOT_FOUND',
    message: message || 'The specified resource could not be found',
  })
}

export function internalError(message?: string): never {
  throw new ApiError({
    code: 'INTERNAL_SERVER_ERROR',
    message: message || 'An internal server error occurred',
  })
}
