import { faker } from '@faker-js/faker';
import { afterAll, afterEach, beforeAll, describe, it } from '@jest/globals';

import { as } from '@blc-mono/core/utils/testing';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { vaultCreatedEventFactory } from '../../../test/factories/vaultEvents.factory';
import { RedemptionsTestDatabase } from '../../../test/helpers/database';
import { createTestLogger } from '../../../test/helpers/logger';

import { vaultCreatedHandler } from './vaultCreatedHandler';

describe('vaultCreatedHandler', () => {
  const logger = createTestLogger();

  describe('should map event data correctly', () => {
    let database: RedemptionsTestDatabase;
    let connection: DatabaseConnection;

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

    it('for Eagle Eye vaults', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: faker.number.int(500),
          ucCampaignId: undefined,
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].integration).toBe('eagleeye');
      expect(vaults[0].integrationId).toBe(event.detail.eeCampaignId);
    });

    it('for Uniqodo vaults', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: undefined,
          ucCampaignId: faker.number.int(500),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].integration).toBe('uniqodo');
      expect(vaults[0].integrationId).toBe(event.detail.ucCampaignId);
    });

    it('for active vaults', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: true,
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].status).toBe('active');
    });

    it('for in-active vaults', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: false,
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].status).toBe('in-active');
    });

    it('for admin email', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          adminEmail: faker.internet.email(),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].email).toBe(event.detail.adminEmail);
    });

    it('for missing admin email', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          adminEmail: undefined,
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].email).toBeNull();
    });

    it('for passthrough fields', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          alertBelow: faker.number.int(100),
          maxPerUser: faker.number.int(100),
          showQR: faker.datatype.boolean(),
          terms: faker.lorem.paragraph(),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        connection: 'direct',
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].alertBelow).toBe(event.detail.alertBelow);
      expect(vaults[0].maxPerUser).toBe(event.detail.maxPerUser);
      expect(vaults[0].showQR).toBe(event.detail.showQR);
      expect(vaults[0].terms).toBe(event.detail.terms);
    });

    it('for redemptionId', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build();
      const redemption = await connection.db
        .insert(redemptionsTable)
        .values({
          companyId: event.detail.companyId,
          connection: 'direct',
          offerId: event.detail.offerId,
          offerType: 'online',
          platform: event.detail.platform,
          redemptionType: 'vault',
        })
        .returning({
          redemptionId: redemptionsTable.id,
        });
      const redemptionId = redemption[0].redemptionId;

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const vaults = await connection.db.select().from(vaultsTable).execute();
      expect(vaults).toHaveLength(1);
      expect(vaults[0].redemptionId).toBe(redemptionId);
    });

    it.each([
      ['awin', 'https://www.awin1.com/a/b?c=d'],
      ['affiliateFuture', 'https://scripts.affiliatefuture.com/a/b?c=d'],
      ['rakuten', 'https://click.linksynergy.com/a/b?c=d'],
      ['affilinet', 'https://being.successfultogether.co.uk/a/b?c=d'],
      ['webgains', 'https://track.webgains.com/a/b?c=d'],
      ['partnerize', 'https://prf.hn/a/b?c=d'],
      ['partnerize', 'https://prf.hn/a/MEMID/b?c=d'],
      ['partnerize', 'https://prf.hn/a/destination:/b?c=d'],
      ['partnerize', 'https://prf.hn/a/camref:/b?c=d'],
      ['impactRadius', 'https://www.example.com/c/?c=d'],
      ['adtraction', 'https://track.adtraction.com/a/b?c=d'],
      ['affiliateGateway', 'https://www.tagserve.com/a/b?c=d'],
      ['optimiseMedia', 'https://clk.omgt1.com/a/b?c=d'],
      ['commissionJunction', 'https://www.anrdoezrs.net/a/b?c=d'],
      ['commissionJunction', 'https://www.apmebf.com/a/b?c=d'],
      ['commissionJunction', 'https://www.awltovhc.com/a/b?c=d'],
      ['commissionJunction', 'https://www.dpbolvw.net/a/b?c=d'],
      ['commissionJunction', 'https://www.emjcd.com/a/b?c=d'],
      ['commissionJunction', 'https://www.ftjcfx.com/a/b?c=d'],
      ['commissionJunction', 'https://www.jdoqocy.com/a/b?c=d'],
      ['commissionJunction', 'https://www.kqzyfj.com/a/b?c=d'],
      ['commissionJunction', 'https://www.lduhtrp.net/a/b?c=d'],
      ['commissionJunction', 'https://www.mjbpab.com/a/b?c=d'],
      ['commissionJunction', 'https://www.qksrv.net/a/b?c=d'],
      ['commissionJunction', 'https://www.qksz.net/a/b?c=d'],
      ['commissionJunction', 'https://www.tkqlhce.com/a/b?c=d'],
      ['commissionJunction', 'https://www.tqlkg.com/a/b?c=d'],
      ['commissionJunction', 'https://anrdoezrs.net/a/b?c=d'],
      ['commissionJunction', 'https://apmebf.com/a/b?c=d'],
      ['commissionJunction', 'https://awltovhc.com/a/b?c=d'],
      ['commissionJunction', 'https://dpbolvw.net/a/b?c=d'],
      ['commissionJunction', 'https://emjcd.com/a/b?c=d'],
      ['commissionJunction', 'https://ftjcfx.com/a/b?c=d'],
      ['commissionJunction', 'https://jdoqocy.com/a/b?c=d'],
      ['commissionJunction', 'https://kqzyfj.com/a/b?c=d'],
      ['commissionJunction', 'https://lduhtrp.net/a/b?c=d'],
      ['commissionJunction', 'https://mjbpab.com/a/b?c=d'],
      ['commissionJunction', 'https://qksrv.net/a/b?c=d'],
      ['commissionJunction', 'https://qksz.net/a/b?c=d'],
      ['commissionJunction', 'https://tkqlhce.com/a/b?c=d'],
      ['commissionJunction', 'https://tqlkg.com/a/b?c=d'],
      ['tradedoubler', 'https://tradedoubler.com/a/b?c=d'],
    ])('for affiliate connections (%s)', async (affiliate, affiliateUrl) => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          link: affiliateUrl,
          linkId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
        // We expect these to be updated by the handler
        connection: 'direct',
        affiliate: null,
        url: null,
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].connection).toBe('affiliate');
      expect(redemptions[0].url).toBe(event.detail.link);
      expect(redemptions[0].affiliate).toBe(affiliate);
    });

    it('for direct connections', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          link: faker.internet.url(),
          linkId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
        // We expect these to be updated by the handler
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/a/b?c=d',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].connection).toBe('direct');
      expect(redemptions[0].url).toBe(event.detail.link);
      expect(redemptions[0].affiliate).toBeNull();
    });

    it('for direct connections', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          link: faker.internet.url(),
          linkId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        redemptionType: 'vault',
        // We expect these to be updated by the handler
        connection: 'affiliate',
        affiliate: 'awin',
        url: 'https://www.awin1.com/a/b?c=d',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].connection).toBe('direct');
      expect(redemptions[0].url).toBe(event.detail.link);
      expect(redemptions[0].affiliate).toBeNull();
    });

    it('for vault redemption types', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          link: faker.internet.url(),
          linkId: faker.number.int({
            min: 1,
            max: 1_000_000,
          }),
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        connection: 'direct',
        // We expect these to be updated by the handler
        redemptionType: 'generic',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].redemptionType).toBe('vault');
    });

    it('for vaultQR redemption types', async () => {
      // Arrange
      const event = vaultCreatedEventFactory.build({
        detail: {
          link: null,
          linkId: null,
        },
      });
      await connection.db.insert(redemptionsTable).values({
        companyId: event.detail.companyId,
        offerId: event.detail.offerId,
        offerType: 'online',
        platform: event.detail.platform,
        connection: 'direct',
        // We expect these to be updated by the handler
        redemptionType: 'generic',
      });

      // Act
      await vaultCreatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].redemptionType).toBe('vaultQR');
      expect(redemptions[0].connection).toBe('direct');
    });
  });

  describe('throws an error if the event is invalid', () => {
    function test(name: string, event: unknown) {
      it(name, async () => {
        // Arrange
        const mockDatabaseConnection = {
          db: {
            execute: jest.fn().mockReturnValue([
              {
                id: 'mock-vault-id',
              },
            ]),
          },
        };

        // Act & Assert
        expect(
          async () => await vaultCreatedHandler(as(mockDatabaseConnection), logger, event),
        ).rejects.toThrowErrorMatchingSnapshot();
        expect(mockDatabaseConnection.db.execute).not.toHaveBeenCalled();
      });
    }

    test('because the event is null', null);
    test('because the event is undefined', undefined);
    test('because the event is an empty object', {});
    test('because the event is missing detail', vaultCreatedEventFactory.build({ detail: undefined }));
    test('because the event is missing time', vaultCreatedEventFactory.build({ time: undefined }));
    test('because the event detail is an empty object', {
      ...vaultCreatedEventFactory.build(),
      detail: {},
    });
    test(
      'because the `adminEmail` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          adminEmail: 'not-an-email',
        },
      }),
    );
    test(
      'because the `alertBelow` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          alertBelow: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `brand` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          brand: 123 as unknown as string,
        },
      }),
    );
    test(
      'because the `companyId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          companyId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `companyName` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          companyName: false as unknown as string,
        },
      }),
    );
    test(
      'because the `eeCampaignId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          eeCampaignId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `link` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          link: 123 as unknown as string,
        },
      }),
    );
    test(
      'because the `linkId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          linkId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `managerId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          managerId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `maxPerUser` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          maxPerUser: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `offerId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          offerId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `platform` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          platform: 'BLC' as 'BLC_UK',
        },
      }),
    );
    test(
      'because the `showQR` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          showQR: 'true' as unknown as boolean,
        },
      }),
    );
    test(
      'because the `terms` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          terms: false as unknown as string,
        },
      }),
    );
    test(
      'because the `ucCampaignId` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          ucCampaignId: '123' as unknown as number,
        },
      }),
    );
    test(
      'because the `vaultStatus` field is invalid',
      vaultCreatedEventFactory.build({
        detail: {
          vaultStatus: 'true' as unknown as boolean,
        },
      }),
    );
  });
});
