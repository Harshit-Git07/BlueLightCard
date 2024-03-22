import { EventBridgeEvent } from 'aws-lambda';
import { z } from 'zod';

import { Result } from '@blc-mono/core/types/result';

import { Controller } from '../Controller';

export type UnknownEventBridgeEvent = EventBridgeEvent<string, unknown>;

export abstract class EventBridgeController<ParsedRequest> extends Controller<
  UnknownEventBridgeEvent,
  void,
  void,
  ParsedRequest,
  Error
> {
  protected formatResponse(request: UnknownEventBridgeEvent): void {
    // There is no option to return a response to the caller in this context so
    // instead we log that the event was handled successfully.
    this.logger.info({
      message: 'Event handled successfully',
      context: {
        controller: this.constructor.name || 'EventBridgeController (unknown)',
        location: 'EventBridgeController.formatResponse',
        tracingId: request.id,
      },
    });
  }

  protected async onUnhandledError(request: UnknownEventBridgeEvent, err: unknown): Promise<void> {
    this.logUnhandledError(request.id, err);

    throw err;
  }

  protected async onParseError(request: UnknownEventBridgeEvent, err: Error): Promise<void> {
    // Because the request is coming from our own infrastructure, we can assume
    // that the error is due to a bug in our code. Therefore, this should be hanlded
    // the same as any other unhandled error. There is also no option to return an
    // error response to the caller in this context.
    return this.onUnhandledError(request, err);
  }

  // ====== Helpers ======

  protected zodParseRequest(
    request: UnknownEventBridgeEvent,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: z.ZodObject<any, any, any, ParsedRequest, any>,
  ): Result<ParsedRequest, Error> {
    return Result.ok(schema.parse(request));
  }
}
