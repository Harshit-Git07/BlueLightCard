import { Stack, Table } from 'sst/constructs';

export function createProfilesTable(stack: Stack): Table {
  return new Table(stack, 'memberProfiles', {
    fields: {
      pk: 'string',
      sk: 'string',
      code: 'string',
      cardStatus: 'string',
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
      CardStatusIndex: {
        partitionKey: 'cardStatus',
        sortKey: 'pk',
      },
    },
    stream: 'new_and_old_images',
    consumers: {
      consumer: {
        function: {
          handler: 'packages/api/members/application/handlers/dynamodb/eventDispatcher.handler',
          timeout: 10,
          permissions: ['events:PutEvents'],
        },
      },
    },
  });
}
