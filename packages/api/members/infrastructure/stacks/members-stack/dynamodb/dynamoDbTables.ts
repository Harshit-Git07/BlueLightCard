import { Stack, Table } from 'sst/constructs';
import { createProfilesTable } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/tables/createProfilesTable';
import { createProfilesSeedSearchIndexTable } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/tables/createProfilesSeedSearchIndexTable';
import { createOrganisationsTable } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/tables/createOrganisationsTable';
import { createAdminTable } from '@blc-mono/members/infrastructure/stacks/members-stack/dynamodb/tables/createAdminTable';
import { Construct } from 'constructs';

export class DynamoDbTables extends Construct {
  readonly profilesTable: Table;
  readonly profilesSeedSearchIndexTable: Table;
  readonly organisationsTable: Table;
  readonly adminTable: Table;

  constructor(stack: Stack) {
    super(stack, 'DynamoDbTables');

    this.profilesTable = createProfilesTable(stack);
    this.profilesSeedSearchIndexTable = createProfilesSeedSearchIndexTable(stack);
    this.organisationsTable = createOrganisationsTable(stack);
    this.adminTable = createAdminTable(stack);
  }
}
