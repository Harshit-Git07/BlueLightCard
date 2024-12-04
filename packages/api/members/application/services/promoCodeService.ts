import { PromoCodeRepository } from '../repositories/promoCodeRepository';
import { PromoCodeModel } from '../models/promoCodeModel';
import { PromoCodeType } from '../models/enums/PromoCodeType';
import { ProfileService } from './profileService';
import { logger } from '../middleware';
import { ValidationError } from '../errors/ValidationError';

type PromoCodeResponse = Pick<PromoCodeModel, 'bypassPayment' | 'bypassVerification'>;

export class PromoCodeService {
  constructor(
    private repository: PromoCodeRepository = new PromoCodeRepository(),
    private profileService: ProfileService = new ProfileService(),
  ) {}

  async validatePromoCode(
    memberId: string,
    promoCode: string,
  ): Promise<PromoCodeResponse | undefined> {
    const codeDetails = await this.getMultiUseOrSingleUseChildPromoCode(promoCode);

    if (!codeDetails) {
      throw new ValidationError('Promo code does not exist');
    }

    let parentCodeDetails: PromoCodeModel | undefined = codeDetails;
    if (codeDetails.promoCodeType === PromoCodeType.SINGLE_USE) {
      if (codeDetails.used === false) {
        parentCodeDetails = await this.getParentCode(codeDetails);
      } else {
        throw new ValidationError('Promo code has already been used');
      }
    }

    if (
      parentCodeDetails &&
      parentCodeDetails.active !== undefined &&
      parentCodeDetails.validityStartDate &&
      parentCodeDetails.validityEndDate &&
      parentCodeDetails.currentUsages &&
      parentCodeDetails.maxUsages
    ) {
      const currentDate = new Date();
      const validityStartDate = new Date(parentCodeDetails.validityStartDate);
      const validityEndDate = new Date(parentCodeDetails.validityEndDate);
      validityEndDate.setHours(23, 59, 59, 999);

      if (
        parentCodeDetails.active &&
        currentDate >= validityStartDate &&
        currentDate <= validityEndDate &&
        parentCodeDetails.currentUsages < parentCodeDetails.maxUsages
      ) {
        if (parentCodeDetails.codeProvider) {
          return await this.checkCodeProvider(memberId, parentCodeDetails);
        } else {
          return this.generatePromoCodeResponse(parentCodeDetails);
        }
      } else {
        throw new ValidationError('Promo code is invalid');
      }
    }
  }

  private async getMultiUseOrSingleUseChildPromoCode(
    promoCode: string,
  ): Promise<PromoCodeModel | undefined> {
    try {
      const codeResult = await this.repository.getMultiUseOrSingleUseChildPromoCode(promoCode);
      return codeResult?.[0];
    } catch (error) {
      logger.error({ message: 'Error fetching promo code', error });
    }
  }

  private async getParentCode(
    singleUseChildCode: PromoCodeModel,
  ): Promise<PromoCodeModel | undefined> {
    const parentCodeResult = await this.getSingleUseParentPromoCode(singleUseChildCode);

    if (parentCodeResult) {
      return parentCodeResult;
    }

    throw new ValidationError('Promo code details cannot be found');
  }

  private async getSingleUseParentPromoCode(
    singleUseChildCode: PromoCodeModel,
  ): Promise<PromoCodeModel | undefined> {
    try {
      const parentCodeResult = await this.repository.getSingleUseParentPromoCode(
        singleUseChildCode.parentId,
      );
      return parentCodeResult?.[0];
    } catch (error) {
      logger.error({ message: 'Error fetching parent promo code', error });
    }
  }

  private async checkCodeProvider(
    memberId: string,
    parentCodeDetails: PromoCodeModel,
  ): Promise<PromoCodeResponse | undefined> {
    const profile = await this.profileService.getProfile(memberId);
    const employerId = profile.employerId;
    if (employerId && employerId === parentCodeDetails.codeProvider) {
      return this.generatePromoCodeResponse(parentCodeDetails);
    }

    throw new ValidationError('Promo code is not applicable for this employer');
  }

  private generatePromoCodeResponse = (parentCodeDetails: PromoCodeModel): PromoCodeResponse => {
    return {
      bypassPayment: parentCodeDetails.bypassPayment,
      bypassVerification: parentCodeDetails.bypassVerification,
    };
  };
}
