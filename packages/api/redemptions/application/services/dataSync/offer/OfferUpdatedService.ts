import { ILogger, Logger } from '@blc-mono/core/utils/logger/logger';
import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { OfferUpdatedEvent } from '../../../controllers/eventBridge/offer/OfferUpdatedController';
import {
  parseAffiliate,
  parseConnection,
  parseOfferType,
  parseOfferUrl,
  parseRedemptionType,
} from '../../../helpers/dataSync/offerLegacyToRedemptionConfig';
import { GenericsRepository, NewGeneric, UpdateGeneric } from '../../../repositories/GenericsRepository';
import { NewRedemption, RedemptionsRepository, UpdateRedemption } from '../../../repositories/RedemptionsRepository';

export interface IOfferUpdatedService {
  updateOffer(event: OfferUpdatedEvent): Promise<void>;
}

export class OfferUpdatedService implements IOfferUpdatedService {
  static readonly key = 'OfferService';
  static readonly inject = [
    Logger.key,
    RedemptionsRepository.key,
    GenericsRepository.key,
    TransactionManager.key,
  ] as const;

  constructor(
    private readonly logger: ILogger,
    private readonly redemptionsRepository: RedemptionsRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly transactionManager: TransactionManager,
  ) {}

  public async updateOffer(event: OfferUpdatedEvent): Promise<void> {
    const { detail } = event;

    /**
     * select record currently stored first for following reasons:
     *
     * there may have been a data sync issue in the past so that there is no record to update,
     * so the update to the 'redemptions' table will require to be an insert instead
     *
     * we need to assess if the current record has an redemptionType of 'generic'
     * if the update is to change the redemptionType from 'generic' to another redemptionType ('showCard', 'vault', 'preApplied')
     * then we must delete any associated records in the 'generics' table
     *
     * we need to assess if the current record has an redemptionType of 'showCard', 'vault', or 'preApplied'
     * if the update is to change the redemptionType from 'showCard', 'vault', or 'preApplied' to 'generic'
     * then we must insert an associated record in the 'generics' table
     *
     * if the current record has an redemptionType of 'generic' and the update is also 'generic'
     * then we must update the 'generics' table record if it exists, or create it if it does not exist
     */
    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const redemptionTransaction = this.redemptionsRepository.withTransaction(transactionConnection);
      const existingRedemptionData = await redemptionTransaction.findOneByOfferId(detail.offerId);

      if (!existingRedemptionData) {
        const redemptionData: NewRedemption = {
          offerId: detail.offerId,
          companyId: detail.companyId,
          platform: detail.platform,
          redemptionType: parseRedemptionType(detail.offerUrl, detail.offerCode).redemptionType,
          connection: parseConnection(detail.offerUrl).connection,
          affiliate: parseAffiliate(detail.offerUrl).affiliate,
          offerType: parseOfferType(detail.offerType).offerType,
          url: parseOfferUrl(detail.offerUrl).url,
        };

        const redemptionInsert = await redemptionTransaction.createRedemption(redemptionData);

        const redemptionId = redemptionInsert[0].id;
        if (redemptionData.redemptionType === 'generic') {
          const genericData: NewGeneric = {
            redemptionId: redemptionId,
            code: detail.offerCode,
          };

          const genericTransaction = this.genericsRepository.withTransaction(transactionConnection);
          await genericTransaction.createGeneric(genericData);
        }
      } else {
        const updateRedemptionData: UpdateRedemption = {
          offerId: detail.offerId,
          companyId: detail.companyId,
          platform: detail.platform,
          redemptionType: parseRedemptionType(detail.offerUrl, detail.offerCode).redemptionType,
          connection: parseConnection(detail.offerUrl).connection,
          affiliate: parseAffiliate(detail.offerUrl).affiliate,
          offerType: parseOfferType(detail.offerType).offerType,
          url: parseOfferUrl(detail.offerUrl).url,
        };

        const redemptionUpdate = await redemptionTransaction.updateByOfferId(detail.offerId, updateRedemptionData);
        if (redemptionUpdate.length < 1) {
          this.logger.error({
            message: 'Offer Update - Redemption update by offerId failed: No redemptions were updated',
            context: {
              offerId: detail.offerId,
              companyId: detail.companyId,
              platform: detail.platform,
            },
          });
          throw new Error(
            `Offer Update - Redemption update by offerId failed: No redemptions were updated (offerId="${detail.offerId}")`,
          );
        }

        if (existingRedemptionData.redemptionType === 'generic' || updateRedemptionData.redemptionType == 'generic') {
          const genericTransaction = this.genericsRepository.withTransaction(transactionConnection);
          const genericExist = await genericTransaction.findOneByRedemptionId(existingRedemptionData.id);

          const genericToDelete =
            genericExist &&
            existingRedemptionData.redemptionType === 'generic' &&
            updateRedemptionData.redemptionType !== 'generic';

          const genericToInsert = !genericExist && updateRedemptionData.redemptionType === 'generic';

          const genericToUpdate = genericExist && updateRedemptionData.redemptionType === 'generic';

          if (genericToDelete) {
            const genericDelete = await genericTransaction.deleteByRedemptionId(existingRedemptionData.id);
            if (genericDelete.length < 1) {
              this.logger.error({
                message: 'Offer Update - Generic delete by redemptionId failed: No generics were deleted',
                context: {
                  offerId: detail.offerId,
                  companyId: detail.companyId,
                  redemptionId: existingRedemptionData.id,
                  platform: detail.platform,
                },
              });
              throw new Error(
                `Offer Update - Generic delete by redemptionId failed: No generics were deleted (redemptionId="${existingRedemptionData.id}")`,
              );
            }
          }

          if (genericToInsert) {
            const genericData: NewGeneric = {
              redemptionId: existingRedemptionData.id,
              code: detail.offerCode,
            };
            const genericInsert = await genericTransaction.createGeneric(genericData);
            if (genericInsert.length < 1) {
              this.logger.error({
                message: 'Offer Update - Generic insert failed: no generics were inserted',
                context: {
                  offerId: detail.offerId,
                  companyId: detail.companyId,
                  redemptionId: existingRedemptionData.id,
                  platform: detail.platform,
                },
              });
              throw new Error('Offer Update - Generic insert failed: no generics were inserted');
            }
          }

          if (genericToUpdate) {
            const genericData: UpdateGeneric = {
              code: detail.offerCode,
            };
            const genericUpdate = await genericTransaction.updateByRedemptionId(existingRedemptionData.id, genericData);
            if (genericUpdate.length < 1) {
              this.logger.error({
                message: 'Offer Update - Generic update by redemptionId failed: No generics were updated',
                context: {
                  offerId: detail.offerId,
                  companyId: detail.companyId,
                  redemptionId: existingRedemptionData.id,
                  platform: detail.platform,
                },
              });
              throw new Error(
                `Offer Update - Generic update by redemptionId failed: No generics were updated (redemptionId="${existingRedemptionData.id}")`,
              );
            }
          }
        }
      }
    });
  }
}
