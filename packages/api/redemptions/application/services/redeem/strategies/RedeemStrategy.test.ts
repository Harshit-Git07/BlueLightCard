import { faker } from '@faker-js/faker';
import { Factory } from 'fishery';

import { GenericsRepository } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { Redemption } from '@blc-mono/redemptions/application/repositories/RedemptionsRepository';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/application/test/helpers/database';
import { createTestLogger } from '@blc-mono/redemptions/application/test/helpers/logger';
import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { RedeemGenericStrategy } from './RedeemGenericStrategy';

describe('RedeemGenericStrategy', () => {
  const mockedLogger = createTestLogger();

  async function callGenericRedeemStrategy(connection: IDatabaseConnection, redemption: Redemption) {
    const genericsRepository = new GenericsRepository(connection);
    const service = new RedeemGenericStrategy(genericsRepository, mockedLogger);
    return service.redeem(redemption);
  }

  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  const redemption = Factory.define<typeof redemptionsTable.$inferSelect>(() => ({
    id: `rdm-${faker.string.uuid()}`,
    offerId: faker.number.int({
      min: 1,
      max: 1_000_000,
    }),
    companyId: 1,
    connection: 'affiliate',
    affiliate: 'awin',
    offerType: 'online',
    platform: 'BLC_UK',
    redemptionType: 'generic',
    url: 'https://www.blcshine.com',
  }));
  const generic = (redemptionId: string) =>
    Factory.define<typeof genericsTable.$inferSelect>(() => ({
      id: `gnr-${faker.string.uuid()}`,
      redemptionId: redemptionId,
      code: 'TEST10',
    }));

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database.reset();
  });

  afterAll(async () => {
    await database?.down?.();
  });

  it('Should return kind equals to "GenericNotFound" when no generic is found', async () => {
    // Arrange
    const redemptionCreated = redemption.build();
    await connection.db.insert(redemptionsTable).values(redemptionCreated);

    // Act
    const result = await callGenericRedeemStrategy(connection, redemptionCreated);

    // Assert
    expect(result.kind).toBe('GenericNotFound');
  });

  it('Should return kind equals to "Ok" when a generic is found', async () => {
    // Arrange
    const redemptionCreated = redemption.build();
    const genericCreated = generic(redemptionCreated.id).build();
    await connection.db.insert(redemptionsTable).values(redemptionCreated);
    await connection.db.insert(genericsTable).values(genericCreated);

    // Act
    const result = await callGenericRedeemStrategy(connection, redemptionCreated);

    // Assert
    expect(result.kind).toBe('Ok');
    if (result.kind === 'Ok') {
      expect(result.redemptionType).toEqual('generic');
      expect(result.redemptionDetails.code).toEqual(genericCreated.code);
      expect(result.redemptionDetails.url).toEqual(redemptionCreated.url);
    }
  });
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
describe('RedeemPreAppliedStrategy (TODO)', () => {
  it.todo('Add tests for RedeemPreAppliedStrategy');
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
describe('RedeemShowCardStrategy (TODO)', () => {
  it.todo('Add tests for RedeemShowCardStrategy');
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
describe('RedeemVaultQrStrategy (TODO)', () => {
  it.todo('Add tests for RedeemVaultQrStrategy');
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
describe('RedeemVaultStrategy (TODO)', () => {
  it.todo('Add tests for RedeemVaultStrategy');
});
