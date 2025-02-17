import { Stack, Table } from 'sst/constructs';

export function createOrganisationsTable(stack: Stack): Table {
  return new Table(stack, 'memberOrganisations', {
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
