import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandOutput,
  PutEventsRequest,
} from '@aws-sdk/client-eventbridge';

export async function putEvent(
  entry: PutEventsRequest,
  region: string,
): Promise<PutEventsCommandOutput> {
  const eventBridgeClient = new EventBridgeClient({ region: region });
  return await eventBridgeClient.send(new PutEventsCommand(entry));
}
