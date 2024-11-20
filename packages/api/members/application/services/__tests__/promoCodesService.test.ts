import { PromoCodeService } from '../../services/promoCodeService';
import { PromoCodeRepository } from '../../repositories/promoCodeRepository';
import { ProfileService } from '../../services/profileService';
import { ValidationError } from '../../errors/ValidationError';
import { PromoCodeType } from '../../models/enums/PromoCodeType';
import { PromoCodeModel } from '../../models/promoCodeModel';
import { v4 as uuidv4 } from 'uuid';
import { ProfileModel } from '../../models/profileModel';

jest.mock('../../repositories/promoCodeRepository');
jest.mock('../../services/profileService');
jest.mock('sst/node/table', () => ({
  Table: jest.fn(),
}));

describe('PromoCodeService', () => {
  let service: PromoCodeService;
  let promoCodeRepositoryMock: jest.Mocked<PromoCodeRepository>;
  let profileServiceMock: jest.Mocked<ProfileService>;
  const memberId = uuidv4();
  const promoCodeId = 'CODE123';

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
    promoCodeRepositoryMock = new PromoCodeRepository() as jest.Mocked<PromoCodeRepository>;
    profileServiceMock = new ProfileService() as jest.Mocked<ProfileService>;

    service = new PromoCodeService(promoCodeRepositoryMock, profileServiceMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePromoCode', () => {
    it('should throw ValidationError if promo code does not exist', async () => {
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue(null);

      await expect(service.validatePromoCode(memberId, promoCodeId)).rejects.toThrow(
        new ValidationError('Promo code does not exist'),
      );
    });

    it('should throw ValidationError if single use promo code has already been used', async () => {
      const singleUseCodeModel = singleUseCodeModelWithUsed(true);
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        singleUseCodeModel,
      ]);

      await expect(service.validatePromoCode(memberId, promoCodeId)).rejects.toThrow(
        new ValidationError('Promo code has already been used'),
      );
    });

    it('should throw ValidationError if parent promo code details cannot be found', async () => {
      const singleUseCodeModel = singleUseCodeModelWithUsed(false);
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        singleUseCodeModel,
      ]);
      promoCodeRepositoryMock.getSingleUseParentPromoCode.mockResolvedValue(null);

      await expect(service.validatePromoCode(memberId, promoCodeId)).rejects.toThrow(
        new ValidationError('Promo code details cannot be found'),
      );
    });

    it('should throw ValidationError if promo code is invalid', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE, false);
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);

      await expect(service.validatePromoCode(memberId, promoCodeId)).rejects.toThrow(
        new ValidationError('Promo code is invalid'),
      );
    });

    it('should throw ValidationError if promo code is not applicable for this employer', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE);
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);
      profileServiceMock.getProfile.mockResolvedValue(profile);

      await expect(service.validatePromoCode(memberId, promoCodeId)).rejects.toThrow(
        new ValidationError('Promo code is not applicable for this employer'),
      );
    });

    it('should return promo code response model if promo code is valid and has no code provider', async () => {
      const parentCodeModel = parentCodeModelWithType(
        PromoCodeType.MULTI_USE,
        true,
        true,
        true,
        false,
      );
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);

      const result = await service.validatePromoCode(memberId, promoCodeId);

      expect(result).toStrictEqual({
        bypassPayment: parentCodeModel.bypassPayment,
        bypassVerification: parentCodeModel.bypassVerification,
      });
    });

    it('should return promo code response model if promo code is valid and code provider matches member profile', async () => {
      const parentCodeModel = parentCodeModelWithType(PromoCodeType.MULTI_USE);
      promoCodeRepositoryMock.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
        parentCodeModel,
      ]);
      profileServiceMock.getProfile.mockResolvedValue({
        ...profile,
        employerId: parentCodeModel.codeProvider,
      });

      const result = await service.validatePromoCode(memberId, promoCodeId);

      expect(result).toStrictEqual({
        bypassPayment: parentCodeModel.bypassPayment,
        bypassVerification: parentCodeModel.bypassVerification,
      });
    });
  });

  const parentCodeModelWithType = (
    type: PromoCodeType,
    active: boolean = true,
    inDate: boolean = true,
    withinUsages: boolean = true,
    hasCodeProvider: boolean = true,
  ): PromoCodeModel => {
    return {
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      active: active,
      bypassPayment: false,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: promoCodeId,
      codeProvider: hasCodeProvider ? uuidv4() : '',
      createdDate: '2021-09-07',
      currentUsages: withinUsages ? 300 : 1000,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07',
      maxUsages: 1000,
      name: 'NHS',
      type: type,
      validityEndDate: inDate ? '2122-09-07' : '2021-09-10',
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
      code: promoCodeId,
      codeProvider: undefined,
      createdDate: undefined,
      currentUsages: undefined,
      description: undefined,
      lastUpdatedDate: undefined,
      maxUsages: undefined,
      name: undefined,
      type: PromoCodeType.SINGLE_USE,
      validityEndDate: undefined,
      validityStartDate: undefined,
      addedDate: '2021-09-07',
      singleCodeId: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
      used: used,
      usedDate: '2021-10-15',
    };
  };
});
