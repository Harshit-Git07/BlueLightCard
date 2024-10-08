import '../../../../../.sst/types/index';

import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-eventbridge';
import { EventBus } from 'sst/node/event-bus';

import { getEnv } from '@blc-mono/core/src/utils/getEnv';
import { Company, Offer } from '@blc-mono/discovery/application/models/SanityTypes';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';

interface TestEvents {
  source: string;
  events: Offer[] | Company[];
}

export async function sendTestEvents(testEvents: TestEvents, eventBusName?: string): Promise<void> {
  const region = getEnv(DiscoveryStackEnvironmentKeys.REGION);
  const client = new EventBridgeClient({ region: region });
  const eventBus = eventBusName ?? EventBus.eventBus.eventBusName;

  const params: PutEventsCommandInput = {
    Entries: testEvents.events.map((event) => {
      return {
        Detail: JSON.stringify(event),
        DetailType: 'TestEvent',
        EventBusName: eventBus,
        Source: testEvents.source,
      };
    }),
  };

  try {
    await client.send(new PutEventsCommand(params));
  } catch (error) {
    throw new Error(`Error sending events: [${error}]`);
  }
}
