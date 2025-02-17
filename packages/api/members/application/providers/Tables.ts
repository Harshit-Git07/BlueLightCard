import { Table } from 'sst/node/table';

export const memberProfilesTableName = (): string => Table.memberProfiles.tableName;
export const memberAdminTableName = (): string => Table.memberAdmin.tableName;
export const memberOrganisationsTableName = (): string => Table.memberOrganisations.tableName;
export const memberProfilesSeedSearchIndexTableName = (): string =>
  Table.memberProfilesSeedSearchIndex.tableName;
