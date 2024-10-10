import { Stack, Table } from 'sst/constructs';

export function createMemberCodesTable(stack: Stack): Table {
  return new Table(stack, 'memberCodes', {
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
  });
}
