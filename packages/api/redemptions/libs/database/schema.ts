import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  ReferenceConfig,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

import { REDEMPTION_TYPES } from '../../../core/src/constants/redemptions';

const DEFAULT_FOREIGN_KEY_ACTIONS: ReferenceConfig['actions'] = {
  onDelete: 'restrict',
  onUpdate: 'cascade',
};

// Enums [A-Z]
export const affiliateEnum = pgEnum('affiliate', [
  'awin',
  'affiliateFuture',
  'rakuten',
  'affilinet',
  'webgains',
  'partnerize',
  'impactRadius',
  'adtraction',
  'affiliateGateway',
  'optimiseMedia',
  'commissionJunction',
  'tradedoubler',
]);
export const connectionEnum = pgEnum('connection', ['affiliate', 'direct', 'spotify', 'none']);
export const integrationEnum = pgEnum('integration', ['eagleeye', 'uniqodo']);
export const offerTypeEnum = pgEnum('offerType', ['online', 'in-store']);
export const redemptionTypeEnum = pgEnum('redemptionType', REDEMPTION_TYPES);
export const statusEnum = pgEnum('status', ['active', 'in-active']);
export const vaultTypeEnum = pgEnum('vaultType', ['standard', 'legacy']);
export const ballotEntryStatusEnum = pgEnum('ballotEntryStatus', [
  'pending',
  'unsuccessful',
  'unconfirmed',
  'confirmed',
  'cancelled',
  'expired',
]);

export const ballotStatusEnum = pgEnum('ballotStatus', ['pending', 'drawing', 'drawn']);

export type Affiliate = (typeof affiliateEnum.enumValues)[number];
export type Integration = (typeof integrationEnum.enumValues)[number];
export type OfferType = (typeof offerTypeEnum.enumValues)[number];
export type RedemptionType = (typeof redemptionTypeEnum.enumValues)[number];
export type Status = (typeof statusEnum.enumValues)[number];
export type VaultType = (typeof vaultTypeEnum.enumValues)[number];
export type Connection = (typeof connectionEnum.enumValues)[number];
export type BallotEntryStatus = (typeof ballotEntryStatusEnum.enumValues)[number];
export type BallotStatus = (typeof ballotStatusEnum.enumValues)[number];
export const redemptionsPrefix = 'rdm';
export const createRedemptionsId = (): string => `${redemptionsPrefix}-${uuidv4()}`;
export const createRedemptionsIdE2E = (): string => `e2e:${createRedemptionsId()}`;
export const redemptionsTable = pgTable('redemptions', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createRedemptionsId),
  // FK

  // Other
  affiliate: affiliateEnum('affiliate'),
  companyId: varchar('companyId').notNull(),
  connection: connectionEnum('connection').notNull(),
  offerId: varchar('offerId').notNull(),
  offerType: offerTypeEnum('offerType').notNull(),
  redemptionType: redemptionTypeEnum('redemptionType').notNull(),
  url: varchar('url'),
});

export const genericsPrefix = 'gnr';
export const createGenericsId = (): string => `${genericsPrefix}-${uuidv4()}`;
export const createGenericsIdE2E = (): string => `e2e:${createGenericsId()}`;
export const genericsTable = pgTable('generics', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createGenericsId),
  // FK
  redemptionId: varchar('redemptionId')
    .references(() => redemptionsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
    .notNull(),
  // Other
  code: varchar('code').notNull(),
});

export const vaultsPrefix = 'vlt';
export const createVaultId = (): string => `${vaultsPrefix}-${uuidv4()}`;
export const createVaultIdE2E = (): string => `e2e:${vaultsPrefix}-${uuidv4()}`;
export const vaultsTable = pgTable('vaults', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createVaultId),
  // FK
  redemptionId: varchar('redemptionId')
    .references(() => redemptionsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
    .notNull(),
  // Other
  alertBelow: integer('alertBelow').default(100).notNull(),
  created: timestamp('created').defaultNow().notNull(),
  email: varchar('email'),
  integration: integrationEnum('integration'),
  integrationId: varchar('integrationId'),
  maxPerUser: integer('maxPerUser'),
  showQR: boolean('showQR').default(false).notNull(),
  status: statusEnum('status').notNull(),
  vaultType: vaultTypeEnum('vaultType').default('standard').notNull(),
});

export const vaultBatchesPrefix = 'vbt';
export const createVaultBatchesId = (): string => `${vaultBatchesPrefix}-${uuidv4()}`;
export const createVaultBatchesIdE2E = (): string => `e2e:${vaultBatchesPrefix}-${uuidv4()}`;
export const vaultBatchesTable = pgTable('vaultBatches', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createVaultBatchesId),
  // FK
  vaultId: varchar('vaultId')
    .references(() => vaultsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
    .notNull(),
  // Other
  file: varchar('file').notNull(),
  expiry: timestamp('expiry').notNull(),
  created: timestamp('created').defaultNow().notNull(),
});

export const vaultCodesPrefix = 'vcd';
export const createVaultCodesId = (): string => `${vaultCodesPrefix}-${uuidv4()}`;
export const createVaultCodesIdE2E = (): string => `e2e:${vaultCodesPrefix}-${uuidv4()}`;
export const vaultCodesTable = pgTable(
  'vaultCodes',
  {
    // PK
    id: varchar('id').primaryKey().$defaultFn(createVaultCodesId),
    // FK
    vaultId: varchar('vaultId')
      .references(() => vaultsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
    batchId: varchar('batchId')
      .references(() => vaultBatchesTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
    // Other
    code: varchar('code').notNull(),
    created: timestamp('created').defaultNow().notNull(),
    expiry: timestamp('expiry').notNull(),
    memberId: varchar('memberId').default(sql`NULL`),
  },
  (table) => ({
    vaultIdx: index('vault_idx').on(table.vaultId),
    batchIdx: index('batch_idx').on(table.batchId),
    createdIdx: index('created_idx').on(table.created),
    expiryIdx: index('expiry_idx').on(table.expiry),
    memberIdx: index('member_idx').on(table.memberId),
    uniqueCodeIdx: unique('idx_unique_vault_code').on(table.vaultId, table.code).nullsNotDistinct(),
  }),
);

export const integrationCodesPrefix = 'vic';
export const createIntegrationCodesId = (): string => `${integrationCodesPrefix}-${uuidv4()}`;
export const integrationCodesTable = pgTable(
  'integrationCodes',
  {
    // PK
    id: varchar('id').primaryKey().$defaultFn(createIntegrationCodesId),
    // FK
    vaultId: varchar('vaultId')
      .references(() => vaultsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
    // Other
    code: varchar('code').notNull(),
    created: timestamp('created').defaultNow().notNull(),
    expiry: timestamp('expiry').notNull(),
    memberId: varchar('memberId').notNull(),
    integrationId: varchar('integrationId').notNull(),
    integration: integrationEnum('integration').notNull(),
  },
  (table) => ({
    icVaultIdx: index('ic_vault_idx').on(table.vaultId),
    icMemberIdx: index('ic_member_idx').on(table.memberId),
  }),
);

export const ballotsPrefix = 'bal';
export const createBallotsId = (): string => `${ballotsPrefix}-${uuidv4()}`;
export const createBallotsIdE2E = (): string => `e2e:${createBallotsId()}`;
export const ballotsTable = pgTable(
  'ballots',
  {
    // PK
    id: varchar('id').primaryKey().$defaultFn(createBallotsId),
    // FK
    redemptionId: varchar('redemptionId')
      .references(() => redemptionsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
    // Other
    drawDate: timestamp('drawDate').notNull(),
    totalTickets: integer('totalTickets').default(0).notNull(),
    eventDate: timestamp('eventDate').notNull(),
    offerName: varchar('offerName').notNull(),
    created: timestamp('created').defaultNow().notNull(),
    status: ballotStatusEnum('status').default('pending').notNull(),
  },
  (table) => ({
    icDrawDateIdx: index('bal_draw_date_idx').on(table.drawDate),
  }),
);

export const ballotEntriesPrefix = 'bae';
export const createBallotEntriesId = (): string => `${ballotEntriesPrefix}-${uuidv4()}`;
export const createBallotEntriesIdE2E = (): string => `e2e:${createBallotEntriesId()}`;
export const ballotEntriesTable = pgTable(
  'ballotEntries',
  {
    // PK
    id: varchar('id').primaryKey().$defaultFn(createBallotEntriesId),
    // FK
    ballotId: varchar('ballotId')
      .references(() => ballotsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
    // Other
    entryDate: timestamp('entryDate').notNull(),
    memberId: varchar('memberId').notNull(),
    status: ballotEntryStatusEnum('status').notNull(),
    created: timestamp('created').defaultNow().notNull(),
  },
  (table) => ({
    icBallotIdx: index('ba_ballot_idx').on(table.ballotId),
    icMemberIdx: index('ba_member_idx').on(table.memberId),
  }),
);
