import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { parseConnection, parseOfferType, parseOfferUrl, parseRedemptionType } from '../../../helpers/offer';

import { OfferCreatedEventSchema } from './events';

type NewRedemption = typeof redemptionsTable.$inferInsert;
type NewGeneric = typeof genericsTable.$inferInsert;

export const offerCreatedHandler = async ({ db }: DatabaseConnection, logger: ILogger, event: unknown) => {
  const offerCreatedEvent = OfferCreatedEventSchema.parse(event);
  const eventDetail = offerCreatedEvent.detail;

  const redemptionData: NewRedemption = {
    offerId: eventDetail.offerId,
    companyId: eventDetail.companyId,
    platform: eventDetail.platform,
    ...parseRedemptionType(eventDetail.offerUrl, eventDetail.offerCode),
    ...parseConnection(eventDetail.offerUrl),
    ...parseOfferType(eventDetail.offerType, eventDetail.offerUrl),
    ...parseOfferUrl(eventDetail.offerUrl),
  };

  await db.transaction(async (tx) => {
    const redemptionInsert = await tx
      .insert(redemptionsTable)
      .values(redemptionData)
      .returning({ id: redemptionsTable.id });

    if (redemptionInsert.length < 1) {
      logger.error({
        message: 'Redemption insert for create offer failed',
        context: {
          offerId: eventDetail.offerId,
          companyId: eventDetail.companyId,
          platform: eventDetail.platform,
        },
      });
      return;
    }

    const redemptionId = redemptionInsert[0].id;
    if (redemptionData.redemptionType === 'generic') {
      const genericData: NewGeneric = {
        redemptionId: redemptionId,
        code: eventDetail.offerCode,
      };
      const genericInsert = await tx.insert(genericsTable).values(genericData).returning({ id: genericsTable.id });

      if (genericInsert.length < 1) {
        logger.error({
          message: 'Generic code insert for create offer failed',
          context: {
            offerId: eventDetail.offerId,
            companyId: eventDetail.companyId,
            redemptionId: redemptionId,
            platform: eventDetail.platform,
          },
        });
      }
    }
  });
};
