import 'reflect-metadata';
import { container, inject, injectable } from 'tsyringe';
import { Logger } from '../../../core/src/utils/logger/logger';
import { LambdaLogger } from '../../../core/src/utils/logger/lambdaLogger';
import { Banner } from '../models/banner';
import { BannerRepository } from '../repositories/bannerRepository';

export interface IBannerService {
  getBannersByBrandIdAndTypeAndIsAgeGated(brandId: string, type: string, isAgeGated: boolean): Promise<Banner[]>;
}

@injectable()
export class BannerService implements IBannerService {
  private bannerRepository: BannerRepository;
  constructor(@inject(Logger.key) private readonly logger: LambdaLogger) {
    this.bannerRepository = container.resolve(BannerRepository);
  }

  public async getBannersByBrandIdAndTypeAndIsAgeGated(
    brandId: string,
    type: string,
    isAgeGated: boolean,
  ): Promise<Banner[]> {
    this.logger.info({ message: 'getCategoryMenu triggered', body: { brandId, type, isAgeGated } });
    try {
      const result = await this.bannerRepository.getByBrandIdAndTypeAndIsAgeGated(brandId, type, isAgeGated);
      this.logger.info({ message: 'getByBrandIdAndTypeAndIsAgeGated: ', body: { result } });

      if (result && result.Items && result.Count && result.Count > 0) {
        return result.Items as Banner[];
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error({ message: 'Get Banners by BrandId, Type, IsAgeGated failed', body: { error } });
      throw error;
    }
  }
}
