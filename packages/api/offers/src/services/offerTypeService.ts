import { Logger } from '@aws-lambda-powertools/logger';
import { OfferTypeRepository } from '../repositories/offerTypeRepository';
import { OfferType } from '../models/offerType';

export class OfferTypeService {
  private readonly offerTypeRepository: OfferTypeRepository;
  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.offerTypeRepository = new OfferTypeRepository(tableName);
  }

  async batchQueryByLegacyIds(legacyIds: number[]) {
    const params = legacyIds.map((legacyId) => this.offerTypeRepository.getByLegacyId(legacyId));
    return Promise.all(params);
  }

  async batchWrite(offerTypes: any[]) {
    const putRequests = offerTypes.map((offerType: OfferType) => {
      return {
        PutRequest: {
          Item: offerType,
        },
      };
    });
    return this.offerTypeRepository.batchWrite(putRequests);
  }
}
