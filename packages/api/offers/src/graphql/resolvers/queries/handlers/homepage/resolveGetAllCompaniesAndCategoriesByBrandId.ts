import { AppSyncResolverEvent } from "aws-lambda";
import { Logger } from '@aws-lambda-powertools/logger';
import { TYPE_KEYS } from '@blc-mono/offers/src/utils/global-constants';
import { OfferHomepageRepository } from "../../../../../repositories/offersHomepageRepository";
import { ObjectDynamicKeys } from "./types";
import { unpackJWT } from '../../../../../../../core/src/utils/unpackJWT';
import { MemberProfile } from "../../../../../services/MemberProfile";
import { OfferRestriction } from "../../../../../services/OfferRestriction";

interface Company {
  id: string;
  name: string;
  isAgeGated: boolean;
}

export class OfferCategoriesAndCompaniesResolver {

  constructor(
    private brandId: string, 
    private tableName: string, 
    private offerHomepageRepository: OfferHomepageRepository,
    private logger: Logger
  ) {
    logger.info('OfferCategoriesAndCompaniesResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const authHeader: string = event.request.headers.authorization ?? '';
    const { 'custom:blc_old_id': legacyUserId } = unpackJWT(authHeader);

    const selections = event.info.selectionSetList;

    let fetchCategories = false;
    let fetchCompanies = false;

    // !selection as if it is empty, we want to return both categories and companies
    if(selections.find((val) => val == 'categories')) {
      this.logger.info('Fetching categories');
      fetchCategories = true;
    }

    if(selections.find((val) => val == 'companies')) {
      this.logger.info('Fetching Companies');
      fetchCompanies = true;
    }
    
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

    const dbResultsMap : ObjectDynamicKeys = {};

    const dbResults = data.Responses[this.tableName]

    dbResults.forEach(({ type, json }) => {
      dbResultsMap[type] = JSON.parse(json);
    })

    if (fetchCompanies) {
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