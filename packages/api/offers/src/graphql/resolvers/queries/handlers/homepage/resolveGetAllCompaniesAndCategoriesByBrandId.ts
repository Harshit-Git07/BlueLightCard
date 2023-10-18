import { AppSyncResolverEvent } from "aws-lambda";
import { Logger } from '@aws-lambda-powertools/logger';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from "../../../../../repositories/offersHomepageRepository";
import { ObjectDynamicKeys } from "./types";
import { unpackJWT } from '../../../../../../../core/src/utils/unpackJWT';
import { MemberProfile } from "../../../../../services/MemberProfile";
import { OfferRestriction } from "../../../../../services/OfferRestriction";
import { FIFTEEN_MINUTES, ONE_DAY } from "../../../../../utils/duration"
import { CacheService } from '../../../../../services/CacheService';

interface Company {
  id: string;
  name: string;
  isAgeGated: boolean;
}

export class OfferCategoriesAndCompaniesResolver {

  private readonly categoriesCacheKey = `${this.brandId}-offers-categories`;
  private readonly companiesCacheKey = `${this.brandId}-offers-companies`;

  constructor(
    private brandId: string, 
    private tableName: string, 
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger,
    private cacheService: CacheService
  ) {
    logger.info('OfferCategoriesAndCompaniesResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {

    const authHeader: string = event.request.headers.authorization ?? '';
    const { 'custom:blc_old_id': legacyUserId } = unpackJWT(authHeader);

    const selections = event.info.selectionSetList;

    let fetchCategories = false;
    let fetchCompanies = false;
    let categoriesCache;
    let companiesCache;

    // !selection as if it is empty, we want to return both categories and companies
    if(selections.find((val) => val == 'categories')) {
      this.logger.info('Fetching categories');
      categoriesCache = await this.cacheService.get(this.categoriesCacheKey);
      fetchCategories = !categoriesCache;

    }

    const companySelection = selections.find((val) => val == 'companies');
    if(companySelection) {
      this.logger.info('Fetching Companies');
      companiesCache = await this.cacheService.get(this.companiesCacheKey);
      fetchCompanies = !companiesCache;
    }

    let dbResultsMap : ObjectDynamicKeys = {};

    if((fetchCompanies && !companiesCache) || (fetchCategories && !categoriesCache)) {
      const data = await getCategoriesOrCompanies(
        this.brandId,
        this.offerHomepageRepository,
        fetchCategories,
        fetchCompanies
      )

      if (!data || !data.Responses || !data.Responses[this.tableName]) {
        this.logger.error('No categories or companies found for brandId', { brandId: this.brandId });
        throw new Error(`No categories or companies found for brandId ${this.brandId}`);
      }

      const dbResults = data.Responses[this.tableName]

      dbResults.forEach(({ type, json }) => {
        dbResultsMap[type] = JSON.parse(json);
      })

      fetchCategories && await this.cacheService.set(this.categoriesCacheKey, JSON.stringify(dbResultsMap[TYPE_KEYS.CATEGORIES]), ONE_DAY);
      fetchCompanies && await this.cacheService.set(this.companiesCacheKey, JSON.stringify(dbResultsMap[TYPE_KEYS.COMPANIES]), FIFTEEN_MINUTES);

    }

    if(categoriesCache) {
       dbResultsMap[TYPE_KEYS.CATEGORIES] = JSON.parse(categoriesCache);
    }

    if(companiesCache) {
      dbResultsMap[TYPE_KEYS.COMPANIES] = JSON.parse(companiesCache);
    }


    if (companySelection) {
      const memberProfileService = new MemberProfile(legacyUserId, authHeader, this.logger);
      const { organisation, isUnder18, dislikedCompanyIds } = await memberProfileService.getProfile();

      const restrictOffers = new OfferRestriction(organisation, isUnder18, dislikedCompanyIds);

      dbResultsMap[TYPE_KEYS.COMPANIES] = dbResultsMap[TYPE_KEYS.COMPANIES].filter((company: Company) => !restrictOffers.isCompanyRestricted(company))
    }

    return {
      companies: dbResultsMap[TYPE_KEYS.COMPANIES],
      categories: dbResultsMap[TYPE_KEYS.CATEGORIES]
    };
  }
}

const getCategoriesOrCompanies = async (
  brandId: string, 
  offerHomepageRepository: OfferHomepageRepository,
  fetchCategories = false, 
  fetchCompanies = false
) => 
  offerHomepageRepository.batchGetByIds(
    [
      ...(fetchCategories ? [{ id: brandId, type: TYPE_KEYS.CATEGORIES }] : []), 
      ...(fetchCompanies ? [{ id: brandId, type: TYPE_KEYS.COMPANIES }] : []),
    ]
  )