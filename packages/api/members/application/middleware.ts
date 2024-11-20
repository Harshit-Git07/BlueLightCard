import { Logger } from '@aws-lambda-powertools/logger';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context, S3Event } from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';
import { Response } from './utils/restResponse/response';
import { ZodError } from 'zod';
import { ForbiddenError } from './errors/ForbiddenError';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { NotFoundError } from './errors/NotFoundError';
import { ValidationError } from './errors/ValidationError';

const SERVICE = process.env.SERVICE as string;
const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';
const auditLogger = new Logger({ serviceName: SERVICE });

// Middleware will add logging context to this logger so consumers do not need to
export const logger = new Logger({ serviceName: SERVICE });

type Handler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

export function middleware<T>(handler: (event: APIGatewayProxyEvent) => Promise<T>): Handler {
  const handlerUnwrapped = async (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    logger.addContext(context);

    try {
      auditLogger.info({
        message: 'Request start',
        method: event.httpMethod,
        path: event.path,
        requestId: event.requestContext?.requestId,
        user: event.requestContext?.identity?.user,
        sourceIp: event.requestContext?.identity?.sourceIp,
        userAgent: event.requestContext?.identity?.userAgent,
      });

      logger.debug({ message: 'Executing Handler' });
      logger.info({ message: 'DEBUG', body: event.body });
      const returnValue = await handler(event);

      auditLogger.info({
        message: 'Request success',
        method: event.httpMethod,
        path: event.path,
        requestId: event.requestContext?.requestId,
      });

      if (returnValue) {
        return Response.OK(returnValue);
      }

      return Response.NoContent();
    } catch (error: Error | any) {
      logger.error({ message: 'Error occurred', error });

      auditLogger.info({
        message: 'Request failed',
        method: event.httpMethod,
        path: event.path,
        requestId: event.requestContext?.requestId,
      });

      if (error instanceof ForbiddenError) {
        return Response.Forbidden({ error: 'Forbidden' });
      } else if (error instanceof UnauthorizedError) {
        return Response.Unauthorized({ error: 'Not authorized' });
      } else if (error instanceof NotFoundError) {
        return Response.NotFound({ error: 'Resource not found' });
      } else if (error instanceof ValidationError) {
        logger.warn('Validation error', error);
        return Response.BadRequest({ error: error.message });
      } else if (error instanceof ZodError) {
        logger.warn('Validation error', error);
        return Response.BadRequest({ error: JSON.parse(error.message) });
      } else {
        return Response.Error(error);
      }
    }
  };

  return USE_DATADOG_AGENT === 'true' ? datadog(handlerUnwrapped) : handlerUnwrapped;
}

type S3Handler = (event: S3Event, context: Context) => Promise<void>;

export function s3Middleware(handler: S3Handler): S3Handler {
  return async (event: S3Event, context: Context): Promise<void> => {
    logger.addContext(context);

    try {
      auditLogger.info({
        message: 'Event start',
        event: event.Records[0]?.eventName,
      });

      await handler(event, context);

      auditLogger.info({
        message: 'Event success',
        event: event.Records[0]?.eventName,
      });
    } catch (error: Error | any) {
      logger.error({ message: 'Error occurred', error });

      auditLogger.info({
        message: 'Request failed',
        event: event.Records[0]?.eventName,
      });

      if (error instanceof ValidationError || error instanceof ZodError) {
        logger.warn('Validation error', error.message);
      }
    }
  };
}
