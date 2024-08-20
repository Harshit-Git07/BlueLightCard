import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandOutput,
  PutEventsRequest
} from "@aws-sdk/client-eventbridge";

export async function putEvent(entry: PutEventsRequest): Promise<PutEventsCommandOutput> {
  const eventBridgeClient = new EventBridgeClient({ region: process.env.E2E_AWS_REGION });
  return await eventBridgeClient.send(new PutEventsCommand(entry));
}