import { StreamRecord } from 'aws-lambda';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { logger } from '@blc-mono/members/application/middleware';
import { EventBusSource } from '@blc-mono/shared/models/members/enums/EventBusSource';
import { MemberEvent } from '@blc-mono/shared/models/members/enums/MemberEvent';

let cachedClient: EventBridgeClient;

export abstract class EventsService {
  private static eventBusName = getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENT_BUS_NAME);

  protected constructor(private eventSource: EventBusSource) {}

  protected async sendEventBusMessage(
    messageType: MemberEvent,
    dynamoStream: StreamRecord | undefined,
  ): Promise<void> {
    try {
      const events = new PutEventsCommand({
        Entries: [
          {
            EventBusName: EventsService.eventBusName,
            Source: this.eventSource,
            DetailType: messageType,
            Detail: JSON.stringify(dynamoStream),
            Resources: [],
          },
        ],
      });

      await this.eventBridgeClient().send(events);
      logger.info({
        message: `Sent '${messageType}' event on the event bus '${EventsService.eventBusName}'`,
      });
    } catch (error) {
      logger.error({
        message: `Failed to send '${messageType}' event on event bus '${EventsService.eventBusName}'`,
        error,
      });
      throw error;
    }
  }

  private eventBridgeClient(): EventBridgeClient {
    if (!cachedClient) {
      cachedClient = new EventBridgeClient({});
    }

    return cachedClient;
  }
}
