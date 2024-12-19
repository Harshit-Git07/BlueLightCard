import { Table } from 'sst/node/table';
import { Queue } from 'sst/node/queue';

export const getMemberProfilesTableName = () => Table.memberProfiles.tableName;
export const getMemberProfilesSeedSearchIndexTableName = () =>
  Table.memberProfilesSeedSearchIndex.tableName;
export const getSeedSearchIndexTableQueueUrl = () =>
  Queue.MemberProfilesSeedSearchIndexTableQueue.queueUrl;
