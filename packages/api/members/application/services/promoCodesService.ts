import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { PromoCodeModel } from '@blc-mono/members/application/models/promoCodeModel';
import { PromoCodeType } from '@blc-mono/members/application/enums/PromoCodeType';
import { APIError } from '@blc-mono/members/application/models/APIError';
import { APIErrorCode } from '@blc-mono/members/application/enums/APIErrorCode';
import { PromoCodeResponse } from '@blc-mono/members/application/types/promoCodeResponse';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { MemberProfileService } from '@blc-mono/members/application/services/memberProfileService';
import { MemberProfileQueryPayload } from '@blc-mono/members/application/types/memberProfileTypes';
import { MemberProfileModel } from '@blc-mono/members/application/models/memberProfileModel';

export class PromoCodesService {
  constructor(
    private repository: PromoCodesRepository,
    private logger: LambdaLogger,
    private memberProfileService: MemberProfileService,
  ) {}

  async validatePromoCode(
    memberUuid: string,
    promoCode: string,
    errorSet: APIError[],
  ): Promise<PromoCodeResponse | undefined> {
    const codeDetails = await this.getMultiUseOrSingleUseChildPromoCode(promoCode, errorSet);
    if (errorSet.length > 0) {
      return;
    }

    if (codeDetails) {
      let parentCodeDetails: PromoCodeModel | undefined = codeDetails;
      if (codeDetails.promoCodeType === PromoCodeType.SINGLE_USE) {
        if (codeDetails.used === false) {
          parentCodeDetails = await this.getParentCode(codeDetails, errorSet);
        } else {
          errorSet.push(
            new APIError(
              APIErrorCode.VALIDATION_ERROR,
              'promoCode',
              'Promo code has already been used',
            ),
          );
          return;
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
            return await this.checkCodeProvider(memberUuid, parentCodeDetails, errorSet);
          } else {
            return this.generatePromoCodeResponse(parentCodeDetails);
          }
        } else {
          errorSet.push(
            new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code is invalid'),
          );
          return;
        }
      }
    } else {
      errorSet.push(
        new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code does not exist'),
      );
      return;
    }
  }

  private async getMultiUseOrSingleUseChildPromoCode(
    promoCode: string,
    errorSet: APIError[],
  ): Promise<PromoCodeModel | undefined> {
    try {
      const codeResult = await this.repository.getMultiUseOrSingleUseChildPromoCode(promoCode);
      return codeResult?.[0];
    } catch (error) {
      this.logger.error({
        message: 'Error fetching promo code',
        body: { error },
      });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'getMultiUseOrSingleUseChildPromoCode',
          'Error fetching promo code',
        ),
      );
    }
  }

  private async getParentCode(
    singleUseChildCode: PromoCodeModel,
    errorSet: APIError[],
  ): Promise<PromoCodeModel | undefined> {
    const parentCodeResult = await this.getSingleUseParentPromoCode(singleUseChildCode, errorSet);

    if (parentCodeResult) {
      return parentCodeResult;
    } else {
      errorSet.push(
        new APIError(
          APIErrorCode.VALIDATION_ERROR,
          'promoCode',
          'Promo code details cannot be found',
        ),
      );
      return;
    }
  }

  private async getSingleUseParentPromoCode(
    singleUseChildCode: PromoCodeModel,
    errorSet: APIError[],
  ): Promise<PromoCodeModel | undefined> {
    try {
      const parentCodeResult = await this.repository.getSingleUseParentPromoCode(
        singleUseChildCode.parentUuid,
      );
      return parentCodeResult?.[0];
    } catch (error) {
      this.logger.error({ message: 'Error fetching parent promo code', body: { error } });
      errorSet.push(
        new APIError(
          APIErrorCode.GENERIC_ERROR,
          'getSingleUseParentPromoCode',
          'Error fetching parent promo code',
        ),
      );
    }
  }

  private async checkCodeProvider(
    memberUuid: string,
    parentCodeDetails: PromoCodeModel,
    errorSet: APIError[],
  ): Promise<PromoCodeResponse | undefined> {
    const queryPayload: MemberProfileQueryPayload = {
      memberUUID: memberUuid,
      profileId: '',
    };
    const memberDetails: MemberProfileModel[] | null =
      await this.memberProfileService.getMemberProfiles(queryPayload, errorSet);
    const memberEmployerId = memberDetails?.[0].employerId;
    if (memberEmployerId && memberEmployerId === parentCodeDetails.codeProvider) {
      return this.generatePromoCodeResponse(parentCodeDetails);
    } else {
      errorSet.push(
        new APIError(
          APIErrorCode.VALIDATION_ERROR,
          'promoCode',
          'Promo code is not applicable for this employer',
        ),
      );
      return;
    }
  }

  private generatePromoCodeResponse = (parentCodeDetails: PromoCodeModel): PromoCodeResponse => ({
    bypassPayment: parentCodeDetails.bypassPayment,
    bypassVerification: parentCodeDetails.bypassVerification,
  });
}
