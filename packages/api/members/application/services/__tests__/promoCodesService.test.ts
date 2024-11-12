import { PromoCodesService } from '@blc-mono/members/application/services/promoCodesService';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { APIError } from '@blc-mono/members/application/models/APIError';
import { APIErrorCode } from '@blc-mono/members/application/enums/APIErrorCode';
import { PromoCodeType } from '@blc-mono/members/application/enums/PromoCodeType';
import { PromoCodeModel } from '@blc-mono/members/application/models/promoCodeModel';
import { MemberProfileModel } from '@blc-mono/members/application/models/memberProfileModel';
import { MemberProfileService } from '@blc-mono/members/application/services/memberProfileService';

jest.mock('../../repositories/promoCodesRepository');
jest.mock('../../../../core/src/utils/logger/lambdaLogger');
jest.mock('../memberProfileService');

describe('PromoCodesService', () => {
  let service: PromoCodesService;
  let mockRepository: jest.MockedObject<PromoCodesRepository>;
  let mockLogger: jest.MockedObject<LambdaLogger>;
  let mockMemberProfileService: jest.MockedObject<MemberProfileService>;
  let errorSet: APIError[] = [];
  const memberUuid = '96cc6f7a-ef23-4696-8a49-50a11877653d';
  const promoCode = 'CODE123';

  beforeEach(() => {
    mockRepository = {
      getMultiUseOrSingleUseChildPromoCode: jest.fn(),
      getSingleUseParentPromoCode: jest.fn(),
    } as unknown as jest.MockedObject<PromoCodesRepository>;

    mockLogger = {
      error: jest.fn(),
    } as unknown as jest.MockedObject<LambdaLogger>;

    mockMemberProfileService = {
      getMemberProfiles: jest.fn(),
    } as unknown as jest.MockedObject<MemberProfileService>;

    service = new PromoCodesService(
      mockRepository as PromoCodesRepository,
      mockLogger as LambdaLogger,
      mockMemberProfileService as MemberProfileService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    errorSet = [];
  });

  describe('on validate promo code', () => {
    describe('and call to get multi or single use code is unsuccessful', () => {
      describe('and call throws error', () => {
        it('should return undefined and error message for error while fetching', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockRejectedValue(
            new Error('Database error'),
          );

          const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(result).toBe(undefined);
          expect(errorSet).toEqual([
            new APIError(
              APIErrorCode.GENERIC_ERROR,
              'getMultiUseOrSingleUseChildPromoCode',
              'Error fetching promo code',
            ),
          ]);
        });
      });

      describe('and call does not find promo code', () => {
        it('should return undefined and error message for promo code not existing', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue(null);

          const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(result).toBe(undefined);
          expect(errorSet).toEqual([
            new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code does not exist'),
          ]);
        });
      });
    });

    describe('and call to get multi or single use code is successful', () => {
      describe('and promo code is single use type', () => {
        describe('and promo code is used', () => {
          it('should return undefined and error message for promo code having already been used', async () => {
            const singleUseCodeModel = singleUseCodeModelWithUsed(true);

            mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
              singleUseCodeModel,
            ]);

            const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

            expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
            expect(mockRepository.getSingleUseParentPromoCode).not.toHaveBeenCalled();
            expect(result).toBe(undefined);
            expect(errorSet).toEqual([
              new APIError(
                APIErrorCode.VALIDATION_ERROR,
                'promoCode',
                'Promo code has already been used',
              ),
            ]);
          });
        });

        describe('and promo code is not used', () => {
          describe('and parent promo code cannot be found', () => {
            it('should return undefined and error message for promo code details not being found', async () => {
              const singleUseCodeModel = singleUseCodeModelWithUsed(false);

              mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
                singleUseCodeModel,
              ]);
              mockRepository.getSingleUseParentPromoCode.mockResolvedValue(null);

              const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

              expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
              expect(mockRepository.getSingleUseParentPromoCode).toHaveBeenCalled();
              expect(result).toBe(undefined);
              expect(errorSet).toEqual([
                new APIError(
                  APIErrorCode.VALIDATION_ERROR,
                  'promoCode',
                  'Promo code details cannot be found',
                ),
              ]);
            });
          });
        });
      });

      describe('and promo code is multi use type', () => {
        it('should not call get single use parent promo code', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
            parentCodeModelWithType(PromoCodeType.MULTI_USE, true, true, true, true),
          ]);

          await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(mockRepository.getSingleUseParentPromoCode).not.toHaveBeenCalled();
        });
      });

      describe('and promo code is not active', () => {
        it('should return undefined and error message for promo code being invalid', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
            parentCodeModelWithType(PromoCodeType.MULTI_USE, false, true, true, true),
          ]);

          const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(result).toBe(undefined);
          expect(errorSet).toEqual([
            new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code is invalid'),
          ]);
        });
      });

      describe('and promo code is not within valid dates', () => {
        it('should return undefined and error message for promo code being invalid', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
            parentCodeModelWithType(PromoCodeType.MULTI_USE, true, false, true, true),
          ]);

          const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(result).toBe(undefined);
          expect(errorSet).toEqual([
            new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code is invalid'),
          ]);
        });
      });

      describe('and promo code is not within usage limit', () => {
        it('should return undefined and error message for promo code being invalid', async () => {
          mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
            parentCodeModelWithType(PromoCodeType.MULTI_USE, true, true, false, true),
          ]);

          const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

          expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
          expect(result).toBe(undefined);
          expect(errorSet).toEqual([
            new APIError(APIErrorCode.VALIDATION_ERROR, 'promoCode', 'Promo code is invalid'),
          ]);
        });
      });

      describe('and promo code is valid', () => {
        describe('and promo code has code provider', () => {
          describe('and code provider does not match member profile', () => {
            it('should return undefined and error message for promo code not being applicable for employer', async () => {
              const memberProfile: Partial<MemberProfileModel> = {
                employerId: '63d17bbb-66d8-446e-95ad-17717e58ca5d',
              };
              const promoCodeDetails = parentCodeModelWithType(
                PromoCodeType.MULTI_USE,
                true,
                true,
                true,
                true,
              );
              mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
                promoCodeDetails,
              ]);
              mockMemberProfileService.getMemberProfiles.mockResolvedValue([
                memberProfile,
              ] as MemberProfileModel[]);

              const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

              expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
              expect(result).toBe(undefined);
              expect(errorSet).toEqual([
                new APIError(
                  APIErrorCode.VALIDATION_ERROR,
                  'promoCode',
                  'Promo code is not applicable for this employer',
                ),
              ]);
            });
          });

          describe('and code provider does match member profile', () => {
            it('should return promo code response model', async () => {
              const memberProfile: Partial<MemberProfileModel> = {
                employerId: '4489d238-245d-472f-ba17-582d68fd2bd7',
              };
              const promoCodeDetails = parentCodeModelWithType(
                PromoCodeType.MULTI_USE,
                true,
                true,
                true,
                true,
              );
              mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
                promoCodeDetails,
              ]);
              mockMemberProfileService.getMemberProfiles.mockResolvedValue([
                memberProfile,
              ] as MemberProfileModel[]);

              const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

              expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
              expect(result).toStrictEqual({
                bypassPayment: promoCodeDetails.bypassPayment,
                bypassVerification: promoCodeDetails.bypassVerification,
              });
              expect(errorSet).toEqual([]);
            });
          });
        });

        describe('and promo code does not have code provider', () => {
          it('should return promo code response model', async () => {
            const promoCodeDetails = parentCodeModelWithType(
              PromoCodeType.MULTI_USE,
              true,
              true,
              true,
              false,
            );
            mockRepository.getMultiUseOrSingleUseChildPromoCode.mockResolvedValue([
              promoCodeDetails,
            ]);

            const result = await service.validatePromoCode(memberUuid, promoCode, errorSet);

            expect(mockRepository.getMultiUseOrSingleUseChildPromoCode).toHaveBeenCalled();
            expect(result).toStrictEqual({
              bypassPayment: promoCodeDetails.bypassPayment,
              bypassVerification: promoCodeDetails.bypassVerification,
            });
            expect(errorSet).toEqual([]);
          });
        });
      });
    });
  });

  const parentCodeModelWithType = (
    type: PromoCodeType,
    active: boolean,
    inDate: boolean,
    withinUsages: boolean,
    hasCodeProvider: boolean,
  ): PromoCodeModel => {
    return {
      parentUuid: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      active: active,
      bypassPayment: false,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: promoCode,
      codeProvider: hasCodeProvider ? '4489d238-245d-472f-ba17-582d68fd2bd7' : '',
      createdDate: '2021-09-07',
      currentUsages: withinUsages ? 300 : 1000,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07',
      maxUsages: 1000,
      name: 'NHS',
      promoCodeType: type,
      validityEndDate: inDate ? '2122-09-07' : '2021-09-10',
      validityStartDate: '2021-09-07',
      addedDate: undefined,
      singleCodeUuid: undefined,
      used: undefined,
      usedDate: undefined,
    };
  };

  const singleUseCodeModelWithUsed = (used: boolean): PromoCodeModel => {
    return {
      parentUuid: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
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
      singleCodeUuid: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
      used: used,
      usedDate: '2021-10-15',
    };
  };
});
