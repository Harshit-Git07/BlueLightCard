import { AppSyncResolverEvent } from "aws-lambda";
import { Logger } from '@aws-lambda-powertools/logger';
import { unpackJWT } from '../../../../../../../core/src/utils/unpackJWT';
import { MemberProfile } from "../../../../../services/MemberProfile";
import { OfferRestriction } from "../../../../../services/OfferRestriction";
import { BannerRepository } from "../../../../../repositories/bannerRepository";
import { ONE_HOUR } from "../../../../../utils/duration";
import { CacheService } from '../../../../../services/CacheService';

export class BannersByBrandIdAndTypeResolver {

  constructor(
    private brandId: string, 
    private bannerRepository: BannerRepository,
    private logger: Logger,
    private cacheService: CacheService
  ) {
    logger.info('BannersByBrandIdAndTypeResolver Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const type = event.arguments?.type;
    const limit = event.arguments?.limit;

    if (!type) {
      this.logger.error('type is required', { type });
      throw new Error('type is required');
    }

    const cacheKey = `${this.brandId}-${type}-banners`;
    const cacheData = await this.cacheService.get(cacheKey);

    const authHeader: string = event.request.headers.authorization ?? '';
    let  legacyUserId: string = '';
    try {
      legacyUserId = unpackJWT(authHeader)['custom:blc_old_id'];
    }catch (error) {
      this.logger.error('Error unpacking JWT', { error });
    }

    let data;
    if(!cacheData) {
      data = await getBanners(
        this.brandId,
        type,
        limit,
        this.bannerRepository
      )

      if (!data || !data.Items) {
        this.logger.error(`No ${type} banners found for brandId`, { brandId: this.brandId });
        throw new Error(`No ${type} banners found for brandId ${this.brandId}`);
      }

      await this.cacheService.set(cacheKey, JSON.stringify(data), ONE_HOUR);
    } else {
      data = JSON.parse(cacheData);
    }

    const memberProfileService = new MemberProfile(legacyUserId, authHeader, this.logger);
    const { organisation, isUnder18, dislikedCompanyIds } = await memberProfileService.getProfile();

    const restrictOffers = new OfferRestriction(organisation, isUnder18, dislikedCompanyIds);

    const banners = data.Items.filter((banner: any) => !restrictOffers.isBannerRestricted(banner))

    return banners;
  }
}

const getBanners = async (
  brandId: string, 
  type: string,
  limit: number,
  bannerRepository: BannerRepository,
) => bannerRepository.getBannersByBrandIdAndType(brandId, type, limit)