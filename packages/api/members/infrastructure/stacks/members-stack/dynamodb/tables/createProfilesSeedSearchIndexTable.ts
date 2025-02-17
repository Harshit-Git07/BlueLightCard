import { Stack, Table } from 'sst/constructs';

export function createProfilesSeedSearchIndexTable(stack: Stack): Table {
  return new Table(stack, 'memberProfilesSeedSearchIndex', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    stream: true,
  });
}
