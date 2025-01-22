import { PromoCodeType } from '@blc-mono/shared/models/members/enums/PromoCodeType';
import { PromoCodeModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { v4 as uuidv4 } from 'uuid';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';
import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';
import { EligibilityStatus } from '@blc-mono/shared/models/members/enums/EligibilityStatus';

jest.mock('@blc-mono/members/application/repositories/promoCodesRepository');
jest.mock('@blc-mono/members/application/services/profileService');

interface PromoCodeConditions {
  active: boolean;
  inDate: boolean;
  withinUsages: boolean;
  hasCodeProvider: boolean;
  bypassVerification: boolean;
  bypassPayment: boolean;
}

describe('PromoCodeService', () => {
  let service: PromoCodesService;
  let promoCodesRepositoryMock: jest.Mocked<PromoCodesRepository>;
  let profileServiceMock: jest.Mocked<ProfileService>;
  const memberId = uuidv4();
  const promoCode = 'CODE123';

  const profile: ProfileModel = {
    memberId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    dateOfBirth: '2024-01-01',
    organisationId: uuidv4(),
    employerId: uuidv4(),
    applications: [],
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    promoCodesRepositoryMock = new PromoCodesRepository() as jest.Mocked<PromoCodesRepository>;
    profileServiceMock = new ProfileService() as jest.Mocked<ProfileService>;

    service = new PromoCodesService(promoCodesRepositoryMock, profileServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePromoCode', () => {
    it('should throw ValidationError if promo code does not exist', async () => {
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue(null);

      await expect(service.validatePromoCode(memberId, promoCode)).rejects.toThrow(
        new ValidationError(`Promo code does not exist '${promoCode}'`),
      );
    });

    it('should throw ValidationError if single use promo code has already been used', async () => {
      const singleUseCodeModel = singleUseCodeModelWithUsed(true);
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        singleUseCodeModel,
      ]);

      await expect(service.validatePromoCode(memberId, promoCode)).rejects.toThrow(
        new ValidationError(`Promo code has already been used '${promoCode}'`),
      );
    });

    it('should throw ValidationError if parent promo code details cannot be found', async () => {
      const singleUseCodeModel = singleUseCodeModelWithUsed(false);
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        singleUseCodeModel,
      ]);
      promoCodesRepositoryMock.getSingleUseParentPromoCode.mockResolvedValue(null);

      await expect(service.validatePromoCode(memberId, promoCode)).rejects.toThrow(
        new ValidationError('Promo code details cannot be found'),
      );
    });

    it('should throw ValidationError if promo code is invalid', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
        active: false,
        inDate: true,
        withinUsages: true,
        hasCodeProvider: true,
        bypassPayment: false,
        bypassVerification: false,
      });
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);

      await expect(service.validatePromoCode(memberId, promoCode)).rejects.toThrow(
        new ValidationError('Promo code has expired'),
      );
    });

    it('should throw ValidationError if promo code is not applicable for this employer', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
        active: true,
        inDate: true,
        withinUsages: true,
        hasCodeProvider: true,
        bypassPayment: false,
        bypassVerification: false,
      });
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);
      profileServiceMock.getProfile.mockResolvedValue(profile);

      await expect(service.validatePromoCode(memberId, promoCode)).rejects.toThrow(
        new ValidationError('Promo code is not applicable for this employer'),
      );
    });

    it('should return promo code response model if promo code is valid and has no code provider', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
        active: true,
        hasCodeProvider: false,
        inDate: true,
        withinUsages: true,
        bypassPayment: false,
        bypassVerification: false,
      });
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);

      const result = await service.validatePromoCode(memberId, promoCode);

      expect(result).toStrictEqual({
        bypassPayment: parentCodeModel.bypassPayment,
        bypassVerification: parentCodeModel.bypassVerification,
      });
    });

    it('should return promo code response model if promo code is valid and code provider matches member profile', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
        active: true,
        hasCodeProvider: true,
        inDate: true,
        withinUsages: true,
        bypassPayment: false,
        bypassVerification: false,
      });
      promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);
      profileServiceMock.getProfile.mockResolvedValue({
        ...profile,
        employerId: parentCodeModel.codeProvider,
      });

      const result = await service.validatePromoCode(memberId, promoCode);

      expect(result).toStrictEqual({
        bypassPayment: parentCodeModel.bypassPayment,
        bypassVerification: parentCodeModel.bypassVerification,
      });
    });
  });

  describe('on apply promo code', () => {
    const applicationId = 'e533971b-4273-4d2c-90bd-ff9c30f230c9';
    const promoCodeApplied = true;

    describe('and bypass payment is true', () => {
      it('should call update promo code usage', async () => {
        const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
          active: true,
          hasCodeProvider: false,
          inDate: true,
          withinUsages: true,
          bypassPayment: true,
          bypassVerification: false,
        });
        promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
          parentCodeModel,
        ]);
        const expectedApplicationUpdateModel = {
          promoCode: promoCode,
          promoCodeApplied: promoCodeApplied,
          paymentStatus: PaymentStatus.PAID_PROMO_CODE,
          purchaseDate: '2023-01-01T00:00:00.000Z',
        };

        await service.applyPromoCode(memberId, applicationId, promoCode, promoCodeApplied);

        expect(promoCodesRepositoryMock.updatePromoCodeUsage).toHaveBeenCalledWith(
          PromoCodeType.MULTI_USE,
          parentCodeModel.parentId,
          memberId,
          applicationId,
          expectedApplicationUpdateModel,
        );
      });
    });

    describe('and bypass verification is true', () => {
      it('should call update promo code usage', async () => {
        const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, {
          active: true,
          hasCodeProvider: false,
          inDate: true,
          withinUsages: true,
          bypassVerification: true,
          bypassPayment: false,
        });
        promoCodesRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
          parentCodeModel,
        ]);
        const expectedApplicationUpdateModel = {
          eligibilityStatus: EligibilityStatus.ELIGIBLE,
          promoCode: promoCode,
          promoCodeApplied: promoCodeApplied,
        };

        await service.applyPromoCode(memberId, applicationId, promoCode, promoCodeApplied);

        expect(promoCodesRepositoryMock.updatePromoCodeUsage).toHaveBeenCalledWith(
          PromoCodeType.MULTI_USE,
          parentCodeModel.parentId,
          memberId,
          applicationId,
          expectedApplicationUpdateModel,
        );
      });
    });
  });

  const parentCodeModelWithType = (
    type: PromoCodeType,
    conditions: PromoCodeConditions,
  ): PromoCodeModel => {
    return {
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      active: conditions.active,
      bypassPayment: conditions.bypassPayment,
      bypassVerification: conditions.bypassVerification,
      cardValidityTerm: 2,
      code: promoCode,
      codeProvider: conditions.hasCodeProvider ? uuidv4() : '',
      createdDate: '2021-09-07',
      currentUsages: conditions.withinUsages ? 300 : 1000,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07',
      maxUsages: 1000,
      name: 'NHS',
      promoCodeType: type,
      validityEndDate: conditions.inDate ? '2122-09-07' : '2021-09-10',
      validityStartDate: '2021-09-07',
      addedDate: undefined,
      singleCodeId: undefined,
      used: undefined,
      usedDate: undefined,
    };
  };

  const singleUseCodeModelWithUsed = (used: boolean): PromoCodeModel => {
    return {
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      active: undefined,
      bypassPayment: undefined,
      bypassVerification: undefined,
      cardValidityTerm: undefined,
      code: promoCode,
      codeProvider: undefined,
      createdDate: undefined,
      currentUsages: undefined,
      description: undefined,
      lastUpdatedDate: undefined,
      maxUsages: undefined,
      name: undefined,
      promoCodeType: PromoCodeType.SINGLE_USE,
      validityEndDate: undefined,
      validityStartDate: undefined,
      addedDate: '2021-09-07',
      singleCodeId: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
      used: used,
      usedDate: '2021-10-15',
    };
  };
});
