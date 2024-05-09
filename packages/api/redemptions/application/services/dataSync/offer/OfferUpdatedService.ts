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

        const newRedemption = await redemptionTransaction.createRedemption(redemptionData);

        if (redemptionData.redemptionType === 'generic' && detail.offerCode) {
          const genericData: NewGeneric = {
            redemptionId: newRedemption.id,
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

        if (
          updateRedemptionData.redemptionType === 'vault' &&
          (existingRedemptionData.redemptionType === 'vault' || existingRedemptionData.redemptionType === 'vaultQR')
        ) {
          /**
           * if the existing record redemption type is 'vault' or 'vaultQR' and the update data redemption type is also
           * 'vault' (this is default for vault identifier URL) then we must exit here and not update the redemption for
           * the following reasons:
           *
           * redemptionType has not changed, so does not require to be updated
           *
           * connection could be overwritten for vault
           * tblpromotions.link could be an 'affiliate' or 'direct', but tblallOffers.OfferURL value will set connection
           * to 'none'
           *
           * affiliate could be overwritten for vault
           * tblpromotions.link could be an 'affiliate', but tblallOffers.OfferURL value will set affiliate to 'null'
           *
           * offerType will not change as vaults are 'online',
           * 'in-store' vaults have a redemptionType of vaultQr (this is handled by vaultCreated/Updated lambdas)
           *
           * url value (tblpromotions.link for vaults, null for vaultQR) will be overwritten with tblalloffers.OfferURL
           * value (http(s)://thevault.bluelightcard.co.uk)
           *
           * the basis here is, once the redemption record has been created by the offerCreated lambda
           * and then the redemption record has been updated by the vaultCreated lambda
           * all further updates to the redemption record if it is a vault or vaultQR and is to remain a vault or vaultQR
           * will be performed by the updateVault and updatePromotions lambdas
           *
           * the only time a record with a redemptionType of vault or vaultQR will be updated here is if the vault or
           * vaultQR is to be updated to another redemptionType or another redemptionType is to be updated to a vault
           */
          this.logger.info({
            message: `Offer Update - Redemption update by offerId exit: Redemption is a ${existingRedemptionData.redemptionType}, update will overwrite values incorrectly`,
            context: {
              offerId: detail.offerId,
              companyId: detail.companyId,
              platform: detail.platform,
            },
          });
          return;
        }

        const redemptionUpdate = await redemptionTransaction.updateOneByOfferId(detail.offerId, updateRedemptionData);
        if (!redemptionUpdate) {
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

        if (existingRedemptionData.redemptionType === 'generic' || updateRedemptionData.redemptionType === 'generic') {
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

          if (genericToInsert && detail.offerCode) {
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

          if (genericToUpdate && detail.offerCode) {
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
