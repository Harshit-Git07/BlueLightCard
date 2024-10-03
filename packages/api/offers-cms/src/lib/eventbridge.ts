import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

const client = new EventBridgeClient({});

export function createEBClient() {
  return client;
}
