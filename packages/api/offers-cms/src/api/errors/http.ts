import { z } from '@hono/zod-openapi'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'
import type { ZodError } from 'zod'

import type { HonoEnv } from '../hono/env'

const ErrorCode = z.enum([
  'BAD_REQUEST',
  'FORBIDDEN',
  'INTERNAL_SERVER_ERROR',
  'USAGE_EXCEEDED',
  'DISABLED',
  'NOT_FOUND',
  'NOT_UNIQUE',
  'RATE_LIMITED',
  'UNAUTHORIZED',
  'PRECONDITION_FAILED',
  'INSUFFICIENT_PERMISSIONS',
  'METHOD_NOT_ALLOWED',
  'EXPIRED',
  'DELETE_PROTECTED',
])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorSchemaFactory(code: z.ZodEnum<any>) {
  return z.object({
    error: z.object({
      code: code.openapi({
        description: 'A machine readable error code.',
        example: code._def.values.at(0),
      }),

      message: z.string().openapi({
        description: 'A human readable explanation of what went wrong.',
      }),
      requestId: z.string().openapi({
        description: 'A unique identifier for the request.',
        example: '1234',
      }),
    }),
  })
}

export const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode.openapi({
      description: 'A machine readable error code.',
      example: 'INTERNAL_SERVER_ERROR',
    }),
    message: z.string().openapi({
      description: 'A human readable explanation of what went wrong.',
    }),
    requestId: z.string().openapi({
      description: 'A unique identifier for the request.',
      example: '1234',
    }),
  }),
})

export type ErrorResponse = z.infer<typeof ErrorSchema>

function codeToStatus(code: z.infer<typeof ErrorCode>): StatusCode {
  switch (code) {
    case 'BAD_REQUEST':
      return 400
    case 'FORBIDDEN':
    case 'DISABLED':
    case 'UNAUTHORIZED':
    case 'INSUFFICIENT_PERMISSIONS':
    case 'USAGE_EXCEEDED':
    case 'EXPIRED':
      return 403
    case 'NOT_FOUND':
      return 404
    case 'METHOD_NOT_ALLOWED':
      return 405
    case 'NOT_UNIQUE':
      return 409
    case 'DELETE_PROTECTED':
    case 'PRECONDITION_FAILED':
      return 412
    case 'RATE_LIMITED':
      return 429
    case 'INTERNAL_SERVER_ERROR':
      return 500
  }
}

function statusToCode(status: StatusCode): z.infer<typeof ErrorCode> {
  switch (status) {
    case 400:
      return 'BAD_REQUEST'
    case 401:
      return 'UNAUTHORIZED'
    case 403:
      return 'FORBIDDEN'

    case 404:
      return 'NOT_FOUND'

    case 405:
      return 'METHOD_NOT_ALLOWED'
    case 500:
      return 'INTERNAL_SERVER_ERROR'
    default:
      return 'INTERNAL_SERVER_ERROR'
  }
}

export class ApiError extends HTTPException {
  public readonly code: z.infer<typeof ErrorCode>

  constructor({ code, message }: { code: z.infer<typeof ErrorCode>; message: string }) {
    super(codeToStatus(code), { message })
    this.code = code
  }
}

export function handleZodError(
  result:
    | {
        success: true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any
      }
    | {
        success: false
        error: ZodError
      },
  c: Context,
) {
  if (!result.success) {
    return c.json<z.infer<typeof ErrorSchema>>(
      {
        error: {
          code: 'BAD_REQUEST',
          message: parseZodErrorMessage(result.error),
          requestId: c.get('requestId'),
        },
      },
      { status: 400 },
    )
  }
}

export function handleError(err: Error, c: Context<HonoEnv>): Response {
  /**
   * We can handle this very well, as it is something we threw ourselves
   */
  if (err instanceof ApiError) {
    return c.json<z.infer<typeof ErrorSchema>>(
      {
        error: {
          code: err.code,
          message: err.message,
          requestId: c.get('requestId'),
        },
      },
      { status: err.status },
    )
  }

  /**
   * HTTPExceptions from hono at least give us some idea of what to do as they provide a status and
   * message
   */
  if (err instanceof HTTPException) {
    const code = statusToCode(err.status)
    return c.json<z.infer<typeof ErrorSchema>>(
      {
        error: {
          code,
          message: err.message,
          requestId: c.get('requestId'),
        },
      },
      { status: err.status },
    )
  }

  return c.json<z.infer<typeof ErrorSchema>>(
    {
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err.message ?? 'something unexpected happened',
        requestId: c.get('requestId'),
      },
    },
    { status: 500 },
  )
}

export function errorResponse(c: Context, code: z.infer<typeof ErrorCode>, message: string) {
  return c.json<z.infer<typeof ErrorSchema>>(
    {
      error: {
        code,
        message,
        requestId: c.get('requestId'),
      },
    },
    { status: codeToStatus(code) },
  )
}

export function parseZodErrorMessage(err: z.ZodError): string {
  try {
    const arr = JSON.parse(err.message) as Array<{
      message: string
      path: Array<string>
    }>
    const { path, message } = arr[0]
    return `${path.join('.')}: ${message}`
  } catch {
    return err.message
  }
}
