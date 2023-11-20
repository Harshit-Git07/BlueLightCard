import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from '../../../../../repositories/offersHomepageRepository';
import { ObjectDynamicKeys } from './types';
import { OfferRestriction } from '../../../../../../../core/src/offers/offerRestriction';
import { FIFTEEN_MINUTES, ONE_DAY } from '../../../../../utils/duration';
import { CacheService } from '../../../../../services/CacheService';
import { validateBrand, validateOfferRestrictionInput } from '../../../../../utils/validation';
import { OfferRestrictionQueryInput } from '../../../../../models/queries-input/offerRestrictionQueryInput';

interface Company {
  id: string;
  name: string;
  isAgeGated: boolean;
}

export class OfferCategoriesAndCompaniesResolver {
  constructor(
    private tableName: string,
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger,
    private cacheService: CacheService,
  ) {
    logger.info('OfferCategoriesAndCompaniesResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const brandId = event.arguments.brandId;
    if (!validateBrand(brandId)) {
      this.logger.error('Invalid brandId', { brandId });
      throw new Error(`Invalid brandId ${brandId}`);
    }
    const { isUnder18, organisation }: OfferRestrictionQueryInput = validateOfferRestrictionInput(
      event.arguments.input,
      this.logger,
    );
    const categoriesCacheKey = `${brandId}-offers-categories`;
    const companiesCacheKey = `${brandId}-offers-companies`;

    const selections = event.info.selectionSetList;

    let fetchCategories = false;
    let fetchCompanies = false;
    let categoriesCache;
    let companiesCache;

    // !selection as if it is empty, we want to return both categories and companies
    if (selections.find((val) => val == 'categories')) {
      this.logger.info('Fetching categories');
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Before get categories cache', { categoriesCacheKey })
      categoriesCache = await this.cacheService.get(categoriesCacheKey);
      this.logger.debug('OfferCategoriesAndCompaniesResolver - After get categories cache', { categoriesCacheKey, categoriesCache })
      fetchCategories = !categoriesCache;
    }

    const companySelection = selections.find((val) => val == 'companies');
    if (companySelection) {
      this.logger.info('Fetching Companies');
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Before get companies cache', { companiesCacheKey })
      companiesCache = await this.cacheService.get(companiesCacheKey);
      this.logger.debug('OfferCategoriesAndCompaniesResolver - After get companies cache', { companiesCacheKey, companiesCache })
      fetchCompanies = !companiesCache;
    }

    let dbResultsMap: ObjectDynamicKeys = {};

    if ((fetchCompanies && !companiesCache) || (fetchCategories && !categoriesCache)) {
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Cache Does not exist. retrieve data from Dynamo', { brandId });
      const data = await getCategoriesOrCompanies(
        brandId,
        this.offerHomepageRepository,
        fetchCategories,
        fetchCompanies,
      );
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Data from Dynamo', { data });

      if (!data || !data.Responses || !data.Responses[this.tableName]) {
        this.logger.error('No categories or companies found for brandId', { brandId });
        throw new Error(`No categories or companies found for brandId ${brandId}`);
      }

      const dbResults = data.Responses[this.tableName];

      dbResults.forEach(({ type, json }) => {
        dbResultsMap[type] = JSON.parse(json);
      });

      this.logger.debug('OfferCategoriesAndCompaniesResolver - Set cache', { categoriesCacheKey, companiesCacheKey, dbResultsMap })
      fetchCategories &&
        (await this.cacheService.set(categoriesCacheKey, JSON.stringify(dbResultsMap[TYPE_KEYS.CATEGORIES]), ONE_DAY));
      fetchCompanies &&
        (await this.cacheService.set(
          companiesCacheKey,
          JSON.stringify(dbResultsMap[TYPE_KEYS.COMPANIES]),
          FIFTEEN_MINUTES,
        ));
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Cache set', { categoriesCacheKey, companiesCacheKey })
    }

    if (categoriesCache) {
      dbResultsMap[TYPE_KEYS.CATEGORIES] = JSON.parse(categoriesCache);
    }

    if (companiesCache) {
      dbResultsMap[TYPE_KEYS.COMPANIES] = JSON.parse(companiesCache);
    }

    if (companySelection) {
      this.logger.debug('OfferCategoriesAndCompaniesResolver - Apply OfferRestriction for Company', { organisation, isUnder18 });
      const restrictOffers = new OfferRestriction({ organisation, isUnder18 });
      this.logger.debug('OfferCategoriesAndCompaniesResolver - OfferRestriction applied for Company', { organisation, isUnder18, restrictOffers });

      dbResultsMap[TYPE_KEYS.COMPANIES] = dbResultsMap[TYPE_KEYS.COMPANIES].filter(
        (company: Company) => !restrictOffers.isCompanyRestricted(company),
      );
    }

    return {
      companies: dbResultsMap[TYPE_KEYS.COMPANIES],
      categories: dbResultsMap[TYPE_KEYS.CATEGORIES],
    };
  }
}

const getCategoriesOrCompanies = async (
  brandId: string,
  offerHomepageRepository: OfferHomepageRepository,
  fetchCategories = false,
  fetchCompanies = false,
) =>
  offerHomepageRepository.batchGetByIds([
    ...(fetchCategories ? [{ id: brandId, type: TYPE_KEYS.CATEGORIES }] : []),
    ...(fetchCompanies ? [{ id: brandId, type: TYPE_KEYS.COMPANIES }] : []),
  ]);
