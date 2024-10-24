import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { integrationCodesTable } from '@blc-mono/redemptions/libs/database/schema';
import { integrationCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/integrationCodeEntity.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import {
  createManyIntegrationCodesRecords,
  createRedemptionRecord,
  createVaultRecord,
} from '@blc-mono/redemptions/libs/test/helpers/databaseRecords';

import { IntegrationCodesRepository } from './IntegrationCodesRepository';

describe('IntegrationCodesRepository', () => {
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database?.reset();
  });

  afterAll(async () => {
    await database?.down();
  });

  describe('create', () => {
    it('should create the integration code record', async () => {
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const integrationCode = integrationCodeEntityFactory.build({
        vaultId: vault.id,
      });
      const repository = new IntegrationCodesRepository(connection);
      const result = await repository.create(integrationCode);

      expect(result).toEqual({ id: integrationCode.id });

      const createdIntegrationCode = await connection.db
        .select()
        .from(integrationCodesTable)
        .where(eq(integrationCodesTable.id, integrationCode.id))
        .execute();

      expect(createdIntegrationCode[0]).toEqual(integrationCode);
    });
  });

  describe('countCodesClaimedByMember', () => {
    it('should return 0 if member has not claimed any codes from vault', async () => {
      const repository = new IntegrationCodesRepository(connection);
      const result = await repository.countCodesClaimedByMember(
        `vlt-${faker.string.uuid()}`,
        faker.string.alphanumeric(20),
        faker.string.uuid(),
      );

      expect(result).toEqual(0);
    });

    it('should return correct count of codes claimed by member', async () => {
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);

      const integrationId = faker.string.alphanumeric(20);
      const memberId = faker.string.uuid();
      const claimedCodes = 10;
      await createManyIntegrationCodesRecords(connection, vault.id, integrationId, memberId, claimedCodes);

      const repository = new IntegrationCodesRepository(connection);
      const result = await repository.countCodesClaimedByMember(vault.id, integrationId, memberId);

      expect(result).toEqual(claimedCodes);
    });
  });
});
