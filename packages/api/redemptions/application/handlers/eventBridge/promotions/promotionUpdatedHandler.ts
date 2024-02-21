import { and, eq, inArray, sql } from 'drizzle-orm';

import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { DatabaseConnection, DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { withConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { AffiliateConfigurationHelper } from '../../../helpers/affiliateConfiguration';
import { isSpotifyUrl } from '../../../helpers/isSpotifyUrl';

import { PromotionUpdatedEventDetail, PromotionUpdatedEventSchema } from './events';

type Redemption = typeof redemptionsTable.$inferSelect;
type RedemptionUpdate = Partial<Redemption>;
type RedemptionConnection = Pick<Redemption, 'connection' | 'affiliate' | 'offerType' | 'url'>;

function parseConnectionWithLink(link: string): RedemptionConnection {
  if (isSpotifyUrl(link)) {
    return {
      affiliate: null,
      connection: 'spotify',
      offerType: 'online',
      url: link,
    };
  }

  const affiliateConfig = new AffiliateConfigurationHelper(link).getConfig();

  if (!affiliateConfig) {
    return {
      affiliate: null,
      connection: 'direct',
      offerType: 'online',
      url: link,
    };
  }

  return {
    affiliate: affiliateConfig.affiliate,
    connection: 'affiliate',
    offerType: 'online',
    url: link,
  };
}

function parseConnection(event: PromotionUpdatedEventDetail): RedemptionConnection {
  if (event.update.link) {
    return parseConnectionWithLink(event.update.link);
  }

  return {
    affiliate: null,
    connection: 'direct',
    offerType: 'in-store',
    url: null,
  };
}

export const promotionUpdatedHandler = async (
  { db }: DatabaseConnection,
  logger: ILogger,
  event: unknown,
): Promise<void> => {
  const promotionUpdatedEvent = PromotionUpdatedEventSchema.parse(event);
  const eventDetail = promotionUpdatedEvent.detail;
  const dependentVaults = eventDetail.meta.dependentEntities.filter((entity) => entity.type === 'vault');

  if (!dependentVaults.length) {
    return;
  }

  const redemptionUpdate: RedemptionUpdate = parseConnection(eventDetail);

  const updatedRedemptions = await db
    .update(redemptionsTable)
    .set(redemptionUpdate)
    .where(
      and(
        eq(redemptionsTable.platform, eventDetail.meta.platform),
        inArray(
          sql`(${redemptionsTable.offerId}, ${redemptionsTable.companyId})`,
          dependentVaults.map(({ offerId, companyId }) => sql`(${offerId}, ${companyId})`),
        ),
      ),
    );

  logger.info({
    message: 'Processed promotion updated event',
    context: {
      updatedRedemptionsCount: updatedRedemptions.length,
      dependentVaultsCount: dependentVaults.length,
      dependentVaults: dependentVaults.map(({ offerId, companyId }) => ({ offerId, companyId })),
      platform: eventDetail.meta.platform,
    },
  });
};

export const handler = withConnection(
  DatabaseConnectionType.READ_WRITE,
  async (connection, event: unknown): Promise<void> => {
    const logger = new LambdaLogger({ serviceName: 'redemption-promotions-updated-event-handler' });

    return promotionUpdatedHandler(connection, logger, event);
  },
);
