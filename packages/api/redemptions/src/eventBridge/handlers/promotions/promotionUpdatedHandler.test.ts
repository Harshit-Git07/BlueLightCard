import { afterAll, afterEach, beforeAll, describe, it } from '@jest/globals';
import { eq, not } from 'drizzle-orm';

import { DatabaseConnection } from '../../../database/connection';
import { redemptionsTable } from '../../../database/schema';
import { RedemptionsTestDatabase } from '../../../helpers/test/database';
import { createTestLogger } from '../../../helpers/test/logger';
import {
  promotionUpdatedEventFactory,
  vaultDependentEntityFactory,
} from '../../events/promotions/promotionsEvents.factory';

import { promotionUpdatedHandler } from './promotionUpdatedHandler';

describe('promotionUpdatedHandler', () => {
  const logger = createTestLogger();

  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database?.reset?.();
  });

  afterAll(async () => {
    await database?.down?.();
  });

  it('should update each vault in dependentEntities', async () => {
    // Arrange
    const event = promotionUpdatedEventFactory.build({
      detail: {
        update: {
          link: 'https://example.com/new-url',
        },
        meta: {
          dependentEntities: vaultDependentEntityFactory.buildList(2),
        },
      },
    });
    await connection.db
      .insert(redemptionsTable)
      .values([
        {
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url-1',
        },
        {
          companyId: event.detail.meta.dependentEntities[1].companyId,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[1].offerId,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url-2',
        },
      ])
      .returning({
        id: redemptionsTable.id,
      });

    // Act
    await promotionUpdatedHandler(connection, logger, event);

    // Assert
    const redemptions = await connection.db.select().from(redemptionsTable).execute();
    expect(redemptions).toHaveLength(2);
    expect(redemptions[0].url).toBe('https://example.com/new-url');
    expect(redemptions[1].url).toBe('https://example.com/new-url');
  });

  it('should apply updates for only redemptions matching both offerId and companyId', async () => {
    // Arrange
    const event = promotionUpdatedEventFactory.build({
      detail: {
        update: {
          link: 'https://example.com/new-url',
        },
        meta: {
          dependentEntities: vaultDependentEntityFactory.buildList(1),
        },
      },
    });
    await connection.db
      .insert(redemptionsTable)
      .values([
        {
          id: 'to-be-updated',
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        },
        {
          companyId: 42,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        },
        {
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: 42,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        },
        {
          companyId: 42,
          connection: 'direct',
          offerId: 42,
          offerType: 'online',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        },
      ])
      .returning({
        id: redemptionsTable.id,
      });

    // Act
    await promotionUpdatedHandler(connection, logger, event);

    // Assert
    const redemptionsNotToBeUpdated = await connection.db
      .select()
      .from(redemptionsTable)
      .where(not(eq(redemptionsTable.id, 'to-be-updated')));
    const redemptionToBeUpdated = await connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.id, 'to-be-updated'));

    expect(redemptionsNotToBeUpdated).toHaveLength(3);
    expect(redemptionsNotToBeUpdated[0].url).toBe('https://example.com/old-url');
    expect(redemptionsNotToBeUpdated[1].url).toBe('https://example.com/old-url');
    expect(redemptionsNotToBeUpdated[2].url).toBe('https://example.com/old-url');

    expect(redemptionToBeUpdated).toHaveLength(1);
    expect(redemptionToBeUpdated[0].url).toBe('https://example.com/new-url');
  });

  describe('should map event data correctly', () => {
    it.each([
      'https://www.spotify.com/a/!!!CODE!!!/b',
      'https://www.spotify.com/a/b/!!!CODE!!!',
      'https://www.spotify.com/a/b/?code=!!!CODE!!!',
    ])('for spotify connections', async (spotifyLink) => {
      // Arrange
      const event = promotionUpdatedEventFactory.build({
        detail: {
          update: {
            link: spotifyLink,
          },
          meta: {
            dependentEntities: vaultDependentEntityFactory.buildList(1),
          },
        },
      });
      await connection.db
        .insert(redemptionsTable)
        .values({
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'in-store',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        })
        .returning({
          id: redemptionsTable.id,
        });

      // Act
      await promotionUpdatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].url).toBe(spotifyLink);
      expect(redemptions[0].connection).toBe('spotify');
      expect(redemptions[0].offerType).toBe('online');
    });

    it('for direct online connections', async () => {
      // Arrange
      const event = promotionUpdatedEventFactory.build({
        detail: {
          update: {
            link: 'https://www.example.com/direct-connection',
          },
          meta: {
            dependentEntities: vaultDependentEntityFactory.buildList(1),
          },
        },
      });
      await connection.db
        .insert(redemptionsTable)
        .values({
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'affiliate',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'in-store',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        })
        .returning({
          id: redemptionsTable.id,
        });

      // Act
      await promotionUpdatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].url).toBe(event.detail.update.link);
      expect(redemptions[0].connection).toBe('direct');
      expect(redemptions[0].offerType).toBe('online');
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
      const event = promotionUpdatedEventFactory.build({
        detail: {
          update: {
            link: affiliateUrl,
          },
          meta: {
            dependentEntities: vaultDependentEntityFactory.buildList(1),
          },
        },
      });
      await connection.db
        .insert(redemptionsTable)
        .values({
          companyId: event.detail.meta.dependentEntities[0].companyId,
          connection: 'direct',
          offerId: event.detail.meta.dependentEntities[0].offerId,
          offerType: 'in-store',
          platform: event.detail.meta.platform,
          redemptionType: 'vault',
          url: 'https://example.com/old-url',
        })
        .returning({
          id: redemptionsTable.id,
        });

      // Act
      await promotionUpdatedHandler(connection, logger, event);

      // Assert
      const redemptions = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptions).toHaveLength(1);
      expect(redemptions[0].url).toBe(event.detail.update.link);
      expect(redemptions[0].connection).toBe('affiliate');
      expect(redemptions[0].affiliate).toBe(affiliate);
      expect(redemptions[0].offerType).toBe('online');
    });
  });

  it('for direct online connections', async () => {
    // Arrange
    const event = promotionUpdatedEventFactory.build({
      detail: {
        update: {
          link: 'https://www.example.com/direct-connection',
        },
        meta: {
          dependentEntities: vaultDependentEntityFactory.buildList(1),
        },
      },
    });
    await connection.db
      .insert(redemptionsTable)
      .values({
        companyId: event.detail.meta.dependentEntities[0].companyId,
        connection: 'affiliate',
        offerId: event.detail.meta.dependentEntities[0].offerId,
        offerType: 'in-store',
        platform: event.detail.meta.platform,
        redemptionType: 'vault',
        url: 'https://example.com/old-url',
      })
      .returning({
        id: redemptionsTable.id,
      });

    // Act
    await promotionUpdatedHandler(connection, logger, event);

    // Assert
    const redemptions = await connection.db.select().from(redemptionsTable).execute();
    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].url).toBe(event.detail.update.link);
    expect(redemptions[0].connection).toBe('direct');
    expect(redemptions[0].offerType).toBe('online');
  });

  it('for direct in-store connections', async () => {
    // Arrange
    const event = promotionUpdatedEventFactory.build({
      detail: {
        update: {
          link: undefined,
        },
        meta: {
          dependentEntities: vaultDependentEntityFactory.buildList(1),
        },
      },
    });
    await connection.db
      .insert(redemptionsTable)
      .values({
        companyId: event.detail.meta.dependentEntities[0].companyId,
        connection: 'affiliate',
        offerId: event.detail.meta.dependentEntities[0].offerId,
        offerType: 'online',
        platform: event.detail.meta.platform,
        redemptionType: 'vault',
        url: 'https://example.com/old-url',
      })
      .returning({
        id: redemptionsTable.id,
      });

    // Act
    await promotionUpdatedHandler(connection, logger, event);

    // Assert
    const redemptions = await connection.db.select().from(redemptionsTable).execute();
    expect(redemptions).toHaveLength(1);
    expect(redemptions[0].url).toBeNull();
    expect(redemptions[0].connection).toBe('direct');
    expect(redemptions[0].offerType).toBe('in-store');
  });
});
