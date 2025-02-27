import 'reflect-metadata';
import { ILegacyAPIService, LegacyAPICallService } from './legacyAPIService';
import { LegacyOffers } from '../models/legacy/legacyOffers';
import { LambdaLogger } from '../../../core/src/utils/logger/lambdaLogger';
import { container, inject, injectable } from 'tsyringe';
import { Logger } from '../../../core/src/utils/logger/logger';
import { OFFER_TYPES } from '../../src/utils/global-constants';
import { Offer, OfferModel } from '../models/offers';
import { validateByZodSafeParse } from '../../src/utils/validation';
import { CompanyOffers, CompanyOffersModel } from '../../src/models/companyOffers';
import { CompanyInfo, CompanyInfoModel } from '../../src/models/companyInfo';

@injectable()
export class CompanyOffersService {
  private legacyApiService: ILegacyAPIService;

  constructor(@inject(Logger.key) private readonly logger: LambdaLogger) {
    this.legacyApiService = container.resolve(LegacyAPICallService);
  }

  private async callToLegacyApi(
    authToken: string,
    offersLegacyApiEndpoint: string,
    queryParams: string,
    id: string,
    idComp: boolean,
  ) {
    try {
      const { data: legacyApiResponse } = await this.legacyApiService.get<any>({
        apiEndPoint: offersLegacyApiEndpoint,
        authToken: authToken,
        queryParams,
        byPass: true,
      });

      this.logger.info({ message: 'Output received from API.', body: legacyApiResponse });

      if (
        (idComp && (!legacyApiResponse || Number(id) !== legacyApiResponse.data?.id)) ||
        (!idComp &&
          !legacyApiResponse.data?.offers.find((offer: LegacyOffers) => offer.id === Number(id)))
      ) {
        this.logger.warn({ message: ' Id mismatch' });
        return undefined;
      }

      return legacyApiResponse;
    } catch (error) {
      this.logger.error({ message: 'Error fetching details from legacy API', body: error });
      throw error;
    }
  }

  public async getCompanyOffers(
    authToken: string,
    offersLegacyApiEndpoint: string,
    queryParams: string,
    id: string,
  ) {
    const idComp = true;
    const response = await this.callToLegacyApi(
      authToken,
      offersLegacyApiEndpoint,
      queryParams,
      id,
      idComp,
    );

    if (!response) {
      return undefined;
    } else {
      const requiredData = {
        offers: response.data.offers.map((offer: LegacyOffers) => this.getOfferDetail(offer)),
      };
      const data = validateByZodSafeParse<CompanyOffers>(
        CompanyOffersModel,
        requiredData,
        this.logger,
      );
      return data;
    }
  }

  public async getCompanyInfo(
    authToken: string,
    offersLegacyApiEndpoint: string,
    queryParams: string,
    id: string,
  ) {
    const idComp = true;
    const response = await this.callToLegacyApi(
      authToken,
      offersLegacyApiEndpoint,
      queryParams,
      id,
      idComp,
    );

    if (!response) {
      return undefined;
    } else {
      const requiredData = {
        id: response.data.id,
        name: response.data.name,
        description: response.data.summary ?? '',
      };
      const data = validateByZodSafeParse<CompanyInfo>(CompanyInfoModel, requiredData, this.logger);
      return data;
    }
  }

  public async getOfferById(
    authToken: string,
    offersLegacyApiEndpoint: string,
    queryParams: string,
    id: string,
  ) {
    const idComp = false;
    const response = await this.callToLegacyApi(
      authToken,
      offersLegacyApiEndpoint,
      queryParams,
      id,
      idComp,
    );
    if (!response) {
      return undefined;
    } else {
      const offer = response.data.offers.find((offer: LegacyOffers) => offer.id === Number(id));
      const requiredData = {
        ...this.getOfferDetail(offer),
        companyId: response.data.id,
        companyLogo: response.data.s3logos,
      };
      const data = validateByZodSafeParse(OfferModel, requiredData, this.logger);
      return data;
    }
  }

  private getOfferDetail(offer: LegacyOffers): Offer {
    const offerType = OFFER_TYPES[offer.typeid as keyof typeof OFFER_TYPES];
    const expiry =
      offer.expires && !isNaN(new Date(offer.expires).valueOf())
        ? new Date(offer.expires)
        : undefined;
    const offerWithOutExpiry = {
      id: offer.id,
      name: offer.name,
      description: offer.desc,
      type: offerType,
      terms: offer.terms,
      image: offer.imageoffer,
    };
    const offerRes = expiry ? { ...offerWithOutExpiry, expiry } : offerWithOutExpiry;
    return offerRes;
  }
}
