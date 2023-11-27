import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferRestriction } from '../../../../../../../core/src/offers/offerRestriction';
import { BannerRepository } from '../../../../../repositories/bannerRepository';
import { ONE_HOUR } from '../../../../../utils/duration';
import { CacheService } from '../../../../../services/CacheService';
import { BannersQueryInput, BannersQueryInputModel } from '../../../../../models/queries-input/bannersQueryInput';

export class BannersByBrandIdAndTypeResolver {
  constructor(private bannerRepository: BannerRepository, private logger: Logger, private cacheService: CacheService) {
    logger.info('getBanners Started');
  }

  async handler(event: AppSyncResolverEvent<any>) {
    const {
      brandId,
      type,
      limit,
      restriction: { organisation, isUnder18 },
    }: BannersQueryInput = this.validateBannersQueryInput(event.arguments.input);

    const cacheKey = `${brandId}-${type}-banners`;
    this.logger.debug('BannersByBrandIdAndTypeResolver - Before get cache', { cacheKey });
    const cacheData = await this.cacheService.get(cacheKey);
    this.logger.debug('BannersByBrandIdAndTypeResolver - After get cache', { cacheKey, cacheData })

    let data;
    if (!cacheData) {
      this.logger.debug('BannersByBrandIdAndTypeResolver -  Cache Does not exist. retrieve data from Dynamo', { brandId });
      data = await getBanners(brandId, type, this.bannerRepository, limit);
      this.logger.debug('BannersByBrandIdAndTypeResolver - Data from Dynamo', { data });
      if (!data || !data.Items) {
        this.logger.error(`No ${type} banners found for brandId`, { brandId });
        throw new Error(`No ${type} banners found for brandId ${brandId}`);
      }

      this.logger.debug('BannersByBrandIdAndTypeResolver - Set cache', { cacheKey, data })
      await this.cacheService.set(cacheKey, JSON.stringify(data), ONE_HOUR);
      this.logger.debug('BannersByBrandIdAndTypeResolver - Cache set', { cacheKey })
    } else {
      this.logger.debug('BannersByBrandIdAndTypeResolver - Cache exists. Retrieve data from cache', { cacheKey });
      data = JSON.parse(cacheData);
      this.logger.debug('BannersByBrandIdAndTypeResolver - Cache parsed', { cacheKey, data });
    }

    this.logger.debug('BannersByBrandIdAndTypeResolver - Apply OfferRestriction', { cacheKey, data });
    const restrictOffers = new OfferRestriction({ isUnder18 });
    this.logger.debug('BannersByBrandIdAndTypeResolver - OfferRestriction applied', { cacheKey, data, restrictOffers });

    const banners = data.Items.filter((banner: any) => !restrictOffers.isBannerRestricted(banner));

    return banners;
  }

  private validateBannersQueryInput(payload: any) {
    const result = BannersQueryInputModel.safeParse(payload);
    if (result.success) {
      return payload as BannersQueryInput;
    } else {
      this.logger.error(`Error validating banners query input ${result.error}`);
      throw new Error(`Error validating banners query input ${result.error}`);
    }
  }
}

const getBanners = async (brandId: string, type: string, bannerRepository: BannerRepository, limit?: number) =>
  bannerRepository.getBannersByBrandIdAndType(brandId, type, limit);
