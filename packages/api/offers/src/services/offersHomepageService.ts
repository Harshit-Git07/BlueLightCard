import 'reflect-metadata';
import { container, inject, injectable } from 'tsyringe';
import { Logger } from '../../../core/src/utils/logger/logger';
import { LambdaLogger } from '../../../core/src/utils/logger/lambdaLogger';
import sortNumbers from '../../../core/src/utils/sortNumbers';
import { OfferHomepageQueryInput } from '../models/queries-input/homepageMenuQueryInput';
import { CategoryMenu, CompanyMenu, OffersHomepage } from '../models/offersHomepage';
import { IOfferHomepageRepository, OfferHomepageRepository } from '../repositories/offersHomepageRepository';
import { TYPE_KEYS } from '../utils/global-constants';
import { ObjectDynamicKeys } from '../graphql/resolvers/queries/handlers/homepage/types';
import { OfferRestriction } from '../../../core/src/offers/offerRestriction';

/**
 * Offers Homepage Service Interface
 */
export interface IOffersHomepageService {
  getHomepage(
    tableName: string,
    { brandId, isUnder18, organisation }: OfferHomepageQueryInput,
  ): Promise<OffersHomepage>;
  getCategoryMenu(brand: string, type: TYPE_KEYS): Promise<CategoryMenu[]>;
  getCompanyMenu(brand: string, type: TYPE_KEYS, isAgeGated: boolean): Promise<CompanyMenu[]>;
}

@injectable()
export class OffersHomepageService implements IOffersHomepageService {
  private offersHomePageRepository: IOfferHomepageRepository;
  constructor(@inject(Logger.key) private readonly logger: LambdaLogger) {
    this.offersHomePageRepository = container.resolve(OfferHomepageRepository);
  }

  /**
   * Get the category menu for a brand
   * @param brand
   * @param type
   * @returns Promise<CategoryMenu[]>
   */
  public async getCategoryMenu(brand: string, type: TYPE_KEYS): Promise<CategoryMenu[]> {
    this.logger.info({ message: 'getCategoryMenu triggered', body: { brand, type } });
    const result = await this.fetchByIdAndType(brand, type);
    if (result && result.json) {
      return JSON.parse(result.json) as CategoryMenu[];
    } else {
      return [];
    }
  }

  /**
   * Get the company menu for a brand and apply ageGated restriction
   * @param brand
   * @param type
   * @param isAgeGated
   * @returns Promise<CompanyMenu[]>
   */
  public async getCompanyMenu(brand: string, type: TYPE_KEYS, isAgeGated: boolean): Promise<CompanyMenu[]> {
    this.logger.info({ message: 'getCompanyMenu triggered', body: { brand, type, isAgeGated } });
    const result = await this.fetchByIdAndType(brand, type);
    if (result && result.json) {
      return this.applyCompaniesRestriction(JSON.parse(result.json) as CompanyMenu[], isAgeGated);
    } else {
      return [];
    }
  }

  /**
   * Fetch the data from dynamo table for homepage by brand and type
   * @param brand
   * @param type
   * @returns data from dynamo table or undefined
   * @throws error if fetching data fails
   */
  private async fetchByIdAndType(brand: string, type: TYPE_KEYS) {
    this.logger.info({ message: 'fetchByIdAndType triggered', body: { brand, type } });
    try {
      const data = await this.offersHomePageRepository.getByIdAndType({ id: brand, type });
      if (!data || !data.Item) {
        this.logger.error({ message: `No categories or companies found for brand ${brand}` });
        return undefined;
      } else {
        return data.Item;
      }
    } catch (error) {
      this.logger.error({ message: `Error fetching categories or companies for brand ${brand}`, body: error });
      throw error;
    }
  }

  /**
   * Apply ageGated restriction to company menu
   * @param companies
   * @param isAgeGated
   * @returns companies after applying ageGated restriction
   */
  private async applyCompaniesRestriction(companies: CompanyMenu[], isAgeGated: boolean) {
    this.logger.info({
      message: 'applyCompaniesRestriction triggered',
      body: { isAgeGated },
    });
    const restrictOffers = new OfferRestriction({ isUnder18: isAgeGated });
    return companies.filter((company) => !restrictOffers.isCompanyRestricted(company));
  }

  public async getHomepage(
    tableName: string,
    { brandId, isUnder18, organisation }: OfferHomepageQueryInput,
  ): Promise<OffersHomepage> {
    this.logger.debug({ message: 'getHomepage offers - init', body: { tableName, brandId, isUnder18, organisation } });
    const data = await this.getHomePageMenus(brandId, tableName);
    this.logger.debug({ message: 'getHomepage offers - Data from Dynamo', body: data });

    if (!data || !data.Responses || !data.Responses[tableName]) {
      this.logger.error({ message: 'No homepage offers found for brandId', body: brandId });
      throw new Error(`No homepage offers found for brandId ${brandId}`);
    }
    let menus: ObjectDynamicKeys = {};
    const homePageItems = data.Responses[tableName];

    homePageItems.forEach(({ type, json }) => {
      menus[type] = JSON.parse(json);
    });

    this.logger.debug({
      message: 'getHomepage offers - Apply OfferRestriction',
      body: { brandId, isUnder18, organisation },
    });
    const restrictOffers = new OfferRestriction({ organisation, isUnder18 });
    this.logger.debug({
      message: 'getHomepage offers - OfferRestriction applied',
      body: { brandId, isUnder18, organisation },
    });

    const marketplaceOffers = this.getMarketplaceOffers(restrictOffers, menus[TYPE_KEYS.MARKETPLACE]);

    const flexibleMenus = menus[TYPE_KEYS.FLEXIBLE];

    flexibleMenus.forEach((flexible: any) => {
      if (flexible.items) {
        flexible.items = flexible.items.filter((offer: any) => !restrictOffers.isFlexibleMenuItemRestricted(offer));
      }
    });
    const filteredFeaturedOffers = menus[TYPE_KEYS.FEATURED].filter(
      (offer: any) => !restrictOffers.isFeaturedOfferRestricted(offer),
    );
    const deals = menus[TYPE_KEYS.DEALS].filter((offer: any) => !restrictOffers.isDealOfTheWeekRestricted(offer));

    return {
      deals,
      featured: filteredFeaturedOffers,
      flexible: flexibleMenus,
      marketplace: marketplaceOffers,
    };
  }

  private getHomePageMenus(brandId: string, tableName: string) {
    const offerHomepageRepository = new OfferHomepageRepository(tableName);
    return offerHomepageRepository.batchGetByIds([
      {
        id: brandId,
        type: TYPE_KEYS.DEALS,
      },
      {
        id: brandId,
        type: TYPE_KEYS.FLEXIBLE,
      },
      {
        id: brandId,
        type: TYPE_KEYS.MARKETPLACE,
      },
      {
        id: brandId,
        type: TYPE_KEYS.FEATURED,
      },
    ]);
  }

  private getMarketplaceOffers(restrictOffers: OfferRestriction, marketPlaceMenus: any) {
    const slidersFileArray = Object.keys(marketPlaceMenus)
      .map((sliderFileName) => parseInt(sliderFileName.split('.')[0]))
      .sort(sortNumbers);

    this.logger.debug({
      message: 'getMarketplaceOffers - slidersFileArray before reduce',
      body: slidersFileArray,
    });
    const formattedMarketPlaceMenus = slidersFileArray.reduce((accumulator: any[], key: number) => {
      const slider = marketPlaceMenus[`${key}.txt`];
      if (slider && !slider.hidden) {
        if (slider.items) {
          slider.items = Object.entries(slider.items).reduce((accumulator: { id: String; item: any }[], [id, item]) => {
            if (!restrictOffers.isMarketPlaceMenuItemRestricted(item)) {
              accumulator.push({
                id,
                item,
              });
            }
            return accumulator;
          }, []);
        }
        accumulator.push(slider);
      }
      return accumulator;
    }, []);
    this.logger.debug({
      message: 'getMarketplaceOffers - formattedMarketPlaceMenus after reduce',
      body: formattedMarketPlaceMenus,
    });
    return formattedMarketPlaceMenus;
  }
}
