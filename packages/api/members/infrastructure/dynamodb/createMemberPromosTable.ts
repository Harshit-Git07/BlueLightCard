import { Stack, Table } from 'sst/constructs';

export function createMemberPromosTable(stack: Stack): Table {
  return new Table(stack, 'memberPromos', {
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
      gsi2: { partitionKey: 'code', sortKey: 'pk' },
    },
  });
}
