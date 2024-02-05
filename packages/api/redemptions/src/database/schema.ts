import { boolean, integer, pgEnum, pgTable, ReferenceConfig, timestamp, varchar } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

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
export const connectionEnum = pgEnum('connection', ['affiliate', 'direct', 'spotify']);
export const integrationEnum = pgEnum('integration', ['eagleeye', 'uniqodo']);
export const offerTypeEnum = pgEnum('offerType', ['online', 'in-store']);
export const platformEnum = pgEnum('platform', ['BLC_UK', 'BLC_AU', 'DDS_UK']);
export const redemptionTypeEnum = pgEnum('redemptionType', ['generic', 'vault']);
export const statusEnum = pgEnum('status', ['active', 'in-active']);

export const redemptionsPrefix = 'rdm';
export const createRedemptionsId = (): string => `${redemptionsPrefix}-${uuidv4()}`;
export const redemptionsTable = pgTable('redemptions', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createRedemptionsId),
  // FK

  // Other
  affiliate: affiliateEnum('affiliate'),
  companyId: integer('companyId').notNull(),
  connection: connectionEnum('connection').notNull(),
  offerId: integer('offerId').notNull(),
  offerType: offerTypeEnum('offerType').notNull(),
  platform: platformEnum('platform').notNull(),
  redemptionType: redemptionTypeEnum('redemptionType').notNull(),
  url: varchar('url'),
});

export const genericsPrefix = 'gnr';
export const createGenericsId = (): string => `${genericsPrefix}-${uuidv4()}`;
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
  integrationId: integer('integrationId'),
  maxPerUser: integer('maxPerUser'),
  showQR: boolean('showQR').default(false).notNull(),
  status: statusEnum('status').notNull(),
  terms: varchar('terms'),
});

export const vaultBatchesPrefix = 'vbt';
export const createVaultBatchesId = (): string => `${vaultBatchesPrefix}-${uuidv4()}`;
export const vaultBatchesTable = pgTable('vaultBatches', {
  // PK
  id: varchar('id').primaryKey().$defaultFn(createVaultBatchesId),
  // FK
  vaultId: varchar('vaultId')
    .references(() => vaultsTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
    .notNull(),
  // Other
  file: varchar('file').notNull(),
});

export const vaultCodesPrefix = 'vcd';
export const createVaultCodesId = (): string => `${vaultCodesPrefix}-${uuidv4()}`;
export const vaultCodesTable = pgTable('vaultCodes', {
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
  memberId: varchar('memberId'),
});
