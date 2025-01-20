import { PromoCodesRepository } from '../repositories/promoCodesRepository';
import { PromoCodeModel, PromoCodeResponseModel } from '../models/promoCodeModel';
import { PromoCodeType } from '../models/enums/PromoCodeType';
import { ProfileService } from './profileService';
import { logger } from '../middleware';
import { ValidationError } from '../errors/ValidationError';
import { ApplyPromoCodeApplicationModel } from '@blc-mono/members/application/models/applicationModel';
import { PaymentStatus } from '@blc-mono/members/application/models/enums/PaymentStatus';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';

export class PromoCodesService {
  constructor(
    private repository: PromoCodesRepository = new PromoCodesRepository(),
    private profileService: ProfileService = new ProfileService(),
  ) {}

  async validatePromoCode(memberId: string, promoCode: string): Promise<PromoCodeResponseModel> {
    logger.debug({ message: 'Validating promo code', promoCode });
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
    } else {
      throw new ValidationError('Promo code is invalid');
    }
  }

  async applyPromoCode(
    memberId: string,
    applicationId: string,
    promoCode: string,
    promoCodeApplied: boolean,
  ) {
    logger.debug({ message: 'Applying promo code to application', applicationId });
    const promoCodeResponse = await this.validatePromoCode(memberId, promoCode);

    const codeDetails = await this.getMultiUseOrSingleUseChildPromoCode(promoCode);

    if (codeDetails) {
      if (
        promoCodeResponse.bypassVerification !== undefined &&
        promoCodeResponse.bypassPayment !== undefined
      ) {
        const applyPromoCodeApplicationModel = this.getApplyPromoCodeApplicationModel(
          promoCode,
          promoCodeApplied,
          promoCodeResponse.bypassVerification,
          promoCodeResponse.bypassPayment,
        );

        if (applyPromoCodeApplicationModel) {
          if (codeDetails.promoCodeType === PromoCodeType.SINGLE_USE) {
            await this.repository.updatePromoCodeUsage(
              codeDetails.promoCodeType,
              codeDetails.parentId,
              memberId,
              applicationId,
              applyPromoCodeApplicationModel,
              codeDetails.singleCodeId,
            );
          } else {
            await this.repository.updatePromoCodeUsage(
              codeDetails.promoCodeType,
              codeDetails.parentId,
              memberId,
              applicationId,
              applyPromoCodeApplicationModel,
            );
          }
        }
      }
    }
  }

  private getApplyPromoCodeApplicationModel(
    promoCode: string,
    promoCodeApplied: boolean,
    bypassVerification: boolean,
    bypassPayment: boolean,
  ): ApplyPromoCodeApplicationModel {
    const currentDate = new Date().toISOString();
    if (bypassVerification && bypassPayment) {
      return ApplyPromoCodeApplicationModel.parse({
        promoCode: promoCode,
        promoCodeApplied: promoCodeApplied,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
        paymentStatus: PaymentStatus.PAID_PROMO_CODE,
        purchaseDate: currentDate,
      });
    } else if (bypassVerification) {
      return ApplyPromoCodeApplicationModel.parse({
        promoCode: promoCode,
        promoCodeApplied: promoCodeApplied,
        eligibilityStatus: EligibilityStatus.ELIGIBLE,
      });
    } else if (bypassPayment) {
      return ApplyPromoCodeApplicationModel.parse({
        promoCode: promoCode,
        promoCodeApplied: promoCodeApplied,
        paymentStatus: PaymentStatus.PAID_PROMO_CODE,
        purchaseDate: currentDate,
      });
    } else {
      return ApplyPromoCodeApplicationModel.parse({
        promoCode: promoCode,
        promoCodeApplied: promoCodeApplied,
      });
    }
  }

  private async getMultiUseOrSingleUseChildPromoCode(
    promoCode: string,
  ): Promise<PromoCodeModel | undefined> {
    try {
      const codeResult = await this.repository.getMultiUseOrSingleUseChildPromoCode(promoCode);
      return codeResult?.[0];
    } catch (error) {
      logger.error({
        message: 'Error fetching multi use parent promo code or single use child promo code',
        error,
      });
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
  ): Promise<PromoCodeResponseModel> {
    const profile = await this.profileService.getProfile(memberId);
    const employerId = profile.employerId;
    if (employerId && employerId === parentCodeDetails.codeProvider) {
      return this.generatePromoCodeResponse(parentCodeDetails);
    }

    throw new ValidationError('Promo code is not applicable for this employer');
  }

  private generatePromoCodeResponse = (
    parentCodeDetails: PromoCodeModel,
  ): PromoCodeResponseModel => {
    return {
      bypassPayment: parentCodeDetails.bypassPayment,
      bypassVerification: parentCodeDetails.bypassVerification,
    };
  };
}
