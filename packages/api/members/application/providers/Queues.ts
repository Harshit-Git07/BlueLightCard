import { Queue } from 'sst/node/queue';

export const seedSearchIndexTableQueueUrl = (): string =>
  Queue.MemberProfilesSeedSearchIndexTableQueue.queueUrl;
