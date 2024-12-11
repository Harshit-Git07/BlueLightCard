import { Function, Stack, Table } from 'sst/constructs';

export function createSeedOrganisations(
  stack: Stack,
  organisationsTable: Table,
  service: string,
): void {
  new Function(stack, 'SeedOrganisations', {
    handler:
      'packages/api/members/application/handlers/admin/organisations/seedOrganisations.handler',
    environment: {
      STAGE: stack.stage ?? '',
      SERVICE: service,
      BRAND: process.env.BRAND ?? 'BLC_UK',
    },
    bind: [organisationsTable],
    timeout: 30,
    copyFiles: [{ from: 'packages/api/members/data/organisationEmployerIdMapping.csv' }],
  });
}
