import '../../../../../.sst/types/index';

import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-eventbridge';
import {
  Company,
  Event as EventOffer,
  MenuDealsOfTheWeek,
  MenuFeaturedOffers,
  MenuMarketplace,
  MenuThemedEvent,
  MenuThemedOffer,
  MenuWaysToSave,
  Offer,
} from '@bluelightcard/sanity-types';
import { EventBus } from 'sst/node/event-bus';

import { getEnv } from '@blc-mono/core/src/utils/getEnv';
import { SanityCompanyLocationEventBody } from '@blc-mono/discovery/helpers/sanityMappers/mapSanityCompanyLocationToCompanyLocation';
import { DiscoveryStackEnvironmentKeys } from '@blc-mono/discovery/infrastructure/constants/environment';
import { DetailTypes } from '@blc-mono/discovery/infrastructure/eventHandling/events';

interface TestEvents {
  source: string;
  events:
    | Offer[]
    | Company[]
    | MenuThemedOffer[]
    | SanityCompanyLocationEventBody[]
    | EventOffer[]
    | MenuThemedEvent[]
    | MenuMarketplace[]
    | MenuDealsOfTheWeek[]
    | MenuFeaturedOffers[]
    | MenuWaysToSave[];
}

export async function sendTestEvents(testEvents: TestEvents, eventBusName?: string): Promise<void> {
  const region = getEnv(DiscoveryStackEnvironmentKeys.REGION);
  const client = new EventBridgeClient({ region: region });
  const eventBus = eventBusName ?? EventBus.eventBus.eventBusName;

  const params: PutEventsCommandInput = {
    Entries: testEvents.events.map((event) => {
      return {
        Detail: JSON.stringify(event),
        DetailType: DetailTypes.INTEGRATION_TEST,
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
