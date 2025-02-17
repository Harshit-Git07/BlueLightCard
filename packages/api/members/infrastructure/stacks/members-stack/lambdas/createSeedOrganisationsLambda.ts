import { Function, Stack } from 'sst/constructs';
import { DynamoDbTables } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/dynamoDbTables';
import { SERVICE_NAME } from '@blc-mono/members/infrastructure/stacks/shared/Constants';

export function createSeedOrganisationsLambda(stack: Stack, tables: DynamoDbTables): void {
  new Function(stack, 'SeedOrganisations', {
    handler:
      'packages/api/members/application/handlers/admin/organisations/seedOrganisations.handler',
    environment: {
      STAGE: stack.stage ?? '',
      SERVICE: SERVICE_NAME,
      BRAND: process.env.BRAND ?? 'BLC_UK',
    },
    bind: [tables.organisationsTable],
    timeout: 30,
    copyFiles: [{ from: 'packages/api/members/data/organisationEmployerIdMapping.csv' }],
  });
}
