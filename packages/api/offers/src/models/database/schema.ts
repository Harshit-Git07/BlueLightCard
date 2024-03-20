import { v4 as uuid4 } from 'uuid';
import { bigint, index, mysqlTable, MySqlTableWithColumns, varchar, ReferenceConfig } from 'drizzle-orm/mysql-core';

const DEFAULT_FOREIGN_KEY_ACTIONS: ReferenceConfig['actions'] = {
  onDelete: 'restrict',
  onUpdate: 'cascade',
};

export const offersTablePrefix: string = 'ofr';
export const createOffersId = (): string => `${offersTablePrefix}-${uuid4()}`;

export const exclusionTypeTable: MySqlTableWithColumns<any> = mysqlTable('exclusionType', {
  id: varchar('id', { length: 36 }).primaryKey().unique().$defaultFn(createOffersId),
  name: varchar('name', { length: 255 }).notNull().unique(),
});

export const offerExclusionsTable: MySqlTableWithColumns<any> = mysqlTable(
  'offerExclusions',
  {
    id: varchar('id', { length: 36 }).primaryKey().unique().$defaultFn(createOffersId),
    offerId: bigint('offerId', { mode: 'bigint', unsigned: true }).notNull(),
    exclusionTypeId: varchar('exclusionTypeId', { length: 36 })
      .references(() => exclusionTypeTable.id, DEFAULT_FOREIGN_KEY_ACTIONS)
      .notNull(),
  },
  (table) => ({
    offerIdx: index('offerId_idx').on(table.offerId),
  }),
);
