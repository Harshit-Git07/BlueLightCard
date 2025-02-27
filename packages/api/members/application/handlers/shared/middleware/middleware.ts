import { Logger } from '@aws-lambda-powertools/logger';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  DynamoDBStreamEvent,
  EventBridgeEvent,
  S3Event,
  SQSEvent,
  StreamRecord,
} from 'aws-lambda';
import { datadog } from 'datadog-lambda-js';
import 'dd-trace/init';
import { ZodError } from 'zod';
import { isAPIGatewayProxyResult } from '@blc-mono/members/application/types/apiGatewayProxyResult';
import { ForbiddenError } from '@blc-mono/members/application/errors/ForbiddenError';
import { UnauthorizedError } from '@blc-mono/members/application/errors/UnauthorizedError';
import { NotFoundError } from '@blc-mono/members/application/errors/NotFoundError';
import { Response } from '@blc-mono/members/application/handlers/shared/middleware/responses/response';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { logger } from '@blc-mono/members/application/utils/logging/Logger';

const USE_DATADOG_AGENT = process.env.USE_DATADOG_AGENT ?? 'false';

const SERVICE = process.env.SERVICE as string;
const auditLogger = new Logger({ serviceName: SERVICE });

type Handler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

export function middleware<LambdaResponse>(
  handler: (event: APIGatewayProxyEvent) => Promise<LambdaResponse>,
): Handler {
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
        if (isAPIGatewayProxyResult(returnValue)) {
          return returnValue;
        }

        return Response.OK(returnValue);
      }

      return Response.NoContent();
    } catch (error) {
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
      } else if (error instanceof ValidationError || error instanceof ZodError) {
        logger.warn('Validation error', error);
        return Response.BadRequest({ error: error.message });
      } else {
        return Response.Error(error as Error);
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
    } catch (error) {
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

type SQSHandler = (event: SQSEvent, context: Context) => Promise<void>;

export function sqsMiddleware(handler: SQSHandler): SQSHandler {
  return async (event: SQSEvent, context: Context): Promise<void> => {
    logger.addContext(context);

    try {
      auditLogger.info({
        message: 'Event start',
        numberOfRecords: event.Records.length,
      });

      await handler(event, context);

      auditLogger.info({
        message: 'Event success',
        numberOfRecords: event.Records.length,
      });
    } catch (error) {
      logger.error({ message: 'Error occurred', error });

      auditLogger.info({
        message: 'Request failed',
        numberOfRecords: event.Records.length,
        error: (error as Error)?.message,
      });

      if (error instanceof ValidationError || error instanceof ZodError) {
        logger.warn('Validation error', error.message);
      }

      throw error;
    }
  };
}

type DynamoDBHandler = (event: DynamoDBStreamEvent, context: Context) => Promise<void>;

export function dynamoDBMiddleware(handler: DynamoDBHandler): DynamoDBHandler {
  return async (event: DynamoDBStreamEvent, context: Context): Promise<void> => {
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
    } catch (error) {
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

type EventBusHandler<DetailType = StreamRecord> = (
  event: EventBridgeEvent<string, DetailType>,
  context: Context,
) => Promise<void>;

export function eventBusMiddleware<DetailType = StreamRecord>(
  handler: EventBusHandler<DetailType>,
): EventBusHandler<DetailType> {
  return async (event, context): Promise<void> => {
    logger.addContext(context);

    try {
      auditLogger.info({
        message: 'Event start',
        eventDetail: event.detail,
        eventDetailType: event['detail-type'],
      });

      await handler(event, context);

      auditLogger.info({
        message: 'Event success',
      });
    } catch (error) {
      logger.error({ message: 'Error occurred', error });

      auditLogger.info({
        message: 'Request failed',
        eventDetail: event.detail,
        eventDetailType: event['detail-type'],
        error: (error as Error)?.message,
      });

      if (error instanceof ValidationError || error instanceof ZodError) {
        logger.warn('Validation error', error.message);
      }

      throw error;
    }
  };
}

type LambdaHandler = (context: Context) => Promise<void>;

export function lambdaMiddleware(handler: LambdaHandler): LambdaHandler {
  return async (context: Context): Promise<void> => {
    logger.addContext(context);

    try {
      auditLogger.info({
        message: 'Event start',
      });

      await handler(context);

      auditLogger.info({
        message: 'Event success',
      });
    } catch (error) {
      logger.error({ message: 'Error occurred', error });

      auditLogger.info({
        message: 'Request failed',
        error: (error as Error)?.message,
      });

      if (error instanceof ValidationError || error instanceof ZodError) {
        logger.warn('Validation error', error.message);
      }

      throw error;
    }
  };
}
