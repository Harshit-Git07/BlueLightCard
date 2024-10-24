import { Stack, Table } from 'sst/constructs';

export function createMemberProfilesTable(stack: Stack): Table {
  return new Table(stack, 'memberProfiles', {
    fields: {
      pk: 'string',
      sk: 'string',
    },
    primaryIndex: {
      partitionKey: 'pk',
      sortKey: 'sk',
    },
    globalIndexes: {
      gsi1: {
        partitionKey: 'sk',
        sortKey: 'pk',
      },
    },
    stream: true,
  });
}
