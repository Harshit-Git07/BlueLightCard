import { EventBridgeClient, PutEventsCommand, PutEventsCommandInput } from '@aws-sdk/client-eventbridge';

import { Company, Offer } from '@blc-mono/discovery/application/models/SanityTypes';

interface TestEvents {
  source: string;
  events: Offer[] | Company[];
}

export async function sendTestEvents(testEvents: TestEvents): Promise<void> {
  const client = new EventBridgeClient({ region: 'eu-west-2' });

  const params: PutEventsCommandInput = {
    Entries: testEvents.events.map((event) => {
      return {
        Detail: JSON.stringify(event),
        DetailType: 'TestEvent',
        EventBusName: '<YOUR_EVENT_BUS_NAME_HERE>',
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
