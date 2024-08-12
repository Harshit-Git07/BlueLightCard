import { TransactionManager } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';

import { OfferCreatedEvent } from '../../../controllers/eventBridge/offer/OfferCreatedController';
import {
  parseAffiliate,
  parseConnection,
  parseOfferType,
  parseOfferUrl,
  parseRedemptionType,
} from '../../../helpers/dataSync/offerLegacyToRedemptionConfig';
import { GenericsRepository, NewGeneric } from '../../../repositories/GenericsRepository';
import { NewRedemption, RedemptionsRepository } from '../../../repositories/RedemptionsRepository';

export interface IOfferCreatedService {
  createOffer(event: OfferCreatedEvent): Promise<void>;
}

export class OfferCreatedService implements IOfferCreatedService {
  static readonly key = 'OfferService';
  static readonly inject = [RedemptionsRepository.key, GenericsRepository.key, TransactionManager.key] as const;

  constructor(
    private readonly redemptionsRepository: RedemptionsRepository,
    private readonly genericsRepository: GenericsRepository,
    private readonly transactionManager: TransactionManager,
  ) {}

  public async createOffer(event: OfferCreatedEvent): Promise<void> {
    const { detail } = event;

    const redemptionData: NewRedemption = {
      offerId: detail.offerId,
      companyId: detail.companyId,
      redemptionType: parseRedemptionType(detail.offerUrl, detail.offerCode).redemptionType,
      connection: parseConnection(detail.offerUrl).connection,
      affiliate: parseAffiliate(detail.offerUrl).affiliate,
      offerType: parseOfferType(detail.offerType).offerType,
      url: parseOfferUrl(detail.offerUrl).url,
    };

    await this.transactionManager.withTransaction(async (transaction) => {
      const transactionConnection = { db: transaction };
      const redemptionTransaction = this.redemptionsRepository.withTransaction(transactionConnection);
      const newRedemption = await redemptionTransaction.createRedemption(redemptionData);

      const redemptionId = newRedemption.id;
      if (redemptionData.redemptionType === 'generic' && detail.offerCode) {
        const genericData: NewGeneric = {
          redemptionId: redemptionId,
          code: detail.offerCode,
        };

        const genericTransaction = this.genericsRepository.withTransaction(transactionConnection);
        await genericTransaction.createGeneric(genericData);
      }
    });
  }
}
