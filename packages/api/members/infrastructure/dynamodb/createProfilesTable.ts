import { Stack, Table } from 'sst/constructs';

export function createProfilesTable(stack: Stack): Table {
  return new Table(stack, 'memberProfiles', {
    fields: {
      pk: 'string',
      sk: 'string',
      code: 'string',
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
      PromoCodeIndex: {
        partitionKey: 'code',
        sortKey: 'pk',
      },
    },
    stream: true,
  });
}
