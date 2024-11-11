import { ScheduledEvent } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';

import { Controller } from '../Controller';

export type UnknownScheduledEvent = ScheduledEvent<object>;

export abstract class CronController<ParsedRequest> extends Controller<
  UnknownScheduledEvent,
  void,
  void,
  ParsedRequest,
  Error
> {
  protected onRequest(request: UnknownScheduledEvent): void {
    this.setDefaultLoggerDetail({
      context: {
        tracingId: request.id,
      },
    });
  }

  protected formatResponse(request: UnknownScheduledEvent): void {
    this.logger.info({
      message: 'Cron event handled successfully',
      context: {
        controller: this.constructor.name || 'CronController (unknown)',
        location: 'CronController.formatResponse',
        tracingId: request.id,
      },
    });
  }

  protected onUnhandledError(_: UnknownScheduledEvent, err: unknown): Promise<void> {
    this.logUnhandledError(err);

    return Promise.reject(err as Error);
  }

  protected onParseError(request: UnknownScheduledEvent, err: Error): Promise<void> {
    return this.onUnhandledError(request, err);
  }

  protected zodParseRequest(
    request: UnknownScheduledEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodObject<any, any, any, ParsedRequest, any>,
  ): Result<ParsedRequest, Error> {
    return Result.ok(schema.parse(request));
  }
}
