import { logger } from '../middleware';
import { ApplyPromoCodeApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import {
  PromoCodeModel,
  PromoCodeResponseModel,
} from '@blc-mono/shared/models/members/promoCodeModel';

let promoCodeServiceSingleton: PromoCodesService;

export class PromoCodesService {
  constructor(
    private repository: PromoCodesRepository = new PromoCodesRepository(),
    private profileService: ProfileService = new ProfileService(),
  ) {}

  async applyPromoCode(
    memberId: string,
    applicationId: string,
    promoCode: string,
    promoCodeApplied: boolean,
  ): Promise<void> {
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

  async validatePromoCode(memberId: string, promoCode: string): Promise<PromoCodeResponseModel> {
    logger.debug({ message: 'Validating promo code', promoCode });
    const promoCodeDetails = await this.getPromoCodeIfConsumable(promoCode);
    if (!this.isWellFormedPromoCode(promoCodeDetails)) {
      throw new ValidationError('Promo code is malformed on the database, so cannot process it');
    }
    if (!this.isValidPromoCode(promoCodeDetails)) {
      throw new ValidationError('Promo code has expired');
    }

    if (promoCodeDetails.codeProvider) {
      return await this.checkCodeProvider(memberId, promoCodeDetails);
    } else {
      return this.generatePromoCodeResponse(promoCodeDetails);
    }
  }

  private async getPromoCodeIfConsumable(promoCode: string): Promise<PromoCodeModel> {
    const promoCodeDetails = await this.getMultiUseOrSingleUseChildPromoCode(promoCode);
    if (!promoCodeDetails) {
      throw new ValidationError(`Promo code does not exist '${promoCode}'`);
    }
    if (promoCodeDetails.promoCodeType !== PromoCodeType.SINGLE_USE) {
      return promoCodeDetails;
    }

    if (promoCodeDetails.used) {
      throw new ValidationError(`Promo code has already been used '${promoCode}'`);
    }

    const parentCodeDetails = await this.getParentCode(promoCodeDetails);
    if (!parentCodeDetails) {
      throw new ValidationError(
        `Single use promo code '${promoCode}' does not have a parent promo code`,
      );
    }

    return parentCodeDetails;
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

  private isWellFormedPromoCode(
    promoCode: PromoCodeModel | undefined,
  ): promoCode is Required<PromoCodeModel> {
    return (
      promoCode !== undefined &&
      promoCode.active !== undefined &&
      promoCode.validityStartDate !== undefined &&
      promoCode.validityEndDate !== undefined &&
      promoCode.currentUsages !== undefined &&
      promoCode.maxUsages !== undefined
    );
  }

  private isValidPromoCode(promoCodeDetails: Required<PromoCodeModel>): boolean {
    const currentDate = new Date();
    const validityStartDate = new Date(promoCodeDetails.validityStartDate);
    const validityEndDate = new Date(promoCodeDetails.validityEndDate);
    validityEndDate.setHours(23, 59, 59, 999);

    return (
      promoCodeDetails.active &&
      currentDate >= validityStartDate &&
      currentDate <= validityEndDate &&
      promoCodeDetails.currentUsages < promoCodeDetails.maxUsages
    );
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

  private generatePromoCodeResponse(parentCodeDetails: PromoCodeModel): PromoCodeResponseModel {
    return {
      bypassPayment: parentCodeDetails.bypassPayment,
      bypassVerification: parentCodeDetails.bypassVerification,
    };
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
}

export function promoCodeService(): PromoCodesService {
  if (!promoCodeServiceSingleton) {
    promoCodeServiceSingleton = new PromoCodesService();
  }

  return promoCodeServiceSingleton;
}
