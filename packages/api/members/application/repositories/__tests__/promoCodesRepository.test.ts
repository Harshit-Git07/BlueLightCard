import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { PromoCodeType } from '@blc-mono/members/application/models/enums/PromoCodeType';
import 'aws-sdk-client-mock-jest';
import { EligibilityStatus } from '@blc-mono/members/application/models/enums/EligibilityStatus';

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('PromoCodesRepository', () => {
  const mockPromoCode = 'CODE123';
  const mockParentPromoCodeId = 'fdb27574-d07d-463d-9f74-3c783cc086ac';

  let repository: PromoCodesRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 1));
    repository = new PromoCodesRepository(mockDynamoDB as any, 'memberProfilesTest');
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  describe('on get multi use or single use child promo code', () => {
    describe('and multi use code is found successfully', () => {
      it('should return validated promo code model for multi use', async () => {
        const multiUseCodeQueryResult = parentCodeQueryResultWithType(PromoCodeType.MULTI_USE);
        const multiUseCodeParsedModel = parentCodeParsedModelWithType(PromoCodeType.MULTI_USE);
        const mockQueryResult = { Items: [multiUseCodeQueryResult] };
        mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

        const result = await repository.getMultiUseOrSingleUseChildPromoCode(mockPromoCode);

        expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
          TableName: 'memberProfilesTest',
          IndexName: 'PromoCodeIndex',
          KeyConditionExpression: 'code = :code',
          FilterExpression: 'sk = :multiCodeSk OR begins_with(sk, :singleCodeChildSk)',
          ExpressionAttributeValues: {
            ':code': mockPromoCode,
            ':multiCodeSk': 'MULTI_USE',
            ':singleCodeChildSk': 'SINGLE_USE#',
          },
        });
        expect(result).toEqual([multiUseCodeParsedModel]);
      });
    });

    describe('and single use code is found successfully', () => {
      it('should return validated promo code model for single use', async () => {
        const singleUseCodeQueryResult = {
          pk: 'PROMO_CODE#fdb27574-d07d-463d-9f74-3c783cc086ac',
          sk: 'SINGLE_USE#70f4995f-4c86-48ff-b700-79f1b7b216c2',
          parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
          singleCodeId: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
          promoCodeType: PromoCodeType.SINGLE_USE,
          addedDate: '2021-09-07T12:21:17.000Z',
          code: mockPromoCode,
          used: true,
          usedDate: '2021-10-15T12:21:17.000Z',
        };
        const singleUseCodeParsedModel = {
          parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
          active: undefined,
          bypassPayment: undefined,
          bypassVerification: undefined,
          cardValidityTerm: undefined,
          code: mockPromoCode,
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
          addedDate: '2021-09-07T12:21:17.000Z',
          singleCodeId: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
          used: true,
          usedDate: '2021-10-15T12:21:17.000Z',
        };
        const mockQueryResult = { Items: [singleUseCodeQueryResult] };
        mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

        const result = await repository.getMultiUseOrSingleUseChildPromoCode(mockPromoCode);

        expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
          TableName: 'memberProfilesTest',
          IndexName: 'PromoCodeIndex',
          KeyConditionExpression: 'code = :code',
          FilterExpression: 'sk = :multiCodeSk OR begins_with(sk, :singleCodeChildSk)',
          ExpressionAttributeValues: {
            ':code': mockPromoCode,
            ':multiCodeSk': 'MULTI_USE',
            ':singleCodeChildSk': 'SINGLE_USE#',
          },
        });
        expect(result).toEqual([singleUseCodeParsedModel]);
      });
    });

    it('should return null when code is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getMultiUseOrSingleUseChildPromoCode(mockPromoCode);

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.getMultiUseOrSingleUseChildPromoCode(mockPromoCode)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });

  describe('on get single use parent promo code', () => {
    it('should return validated promo code model when parent code is found', async () => {
      const singleUseParentCodeQueryResult = parentCodeQueryResultWithType(
        PromoCodeType.SINGLE_USE,
      );
      const singleUseParentCodeParsedModel = parentCodeParsedModelWithType(
        PromoCodeType.SINGLE_USE,
      );
      const mockQueryResult = { Items: [singleUseParentCodeQueryResult] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getSingleUseParentPromoCode(mockParentPromoCodeId);

      expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
        TableName: 'memberProfilesTest',
        KeyConditionExpression: 'pk = :pk AND sk = :singleCodeParentSk',
        ExpressionAttributeValues: {
          ':pk': `PROMO_CODE#${mockParentPromoCodeId}`,
          ':singleCodeParentSk': 'SINGLE_USE',
        },
      });
      expect(result).toEqual([singleUseParentCodeParsedModel]);
    });

    it('should return null when code is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getSingleUseParentPromoCode(mockParentPromoCodeId);

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.getSingleUseParentPromoCode(mockParentPromoCodeId)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });

  describe('on update promo code usage', () => {
    const promoCodeType = PromoCodeType.SINGLE_USE;
    const parentPromoCodeId = '11c1a379-1cdf-49ac-9bd1-1bce39e511ef';
    const memberId = 'b487a39d-7b78-4070-936c-72e6bd085d03';
    const applicationId = 'ea5f7186-2187-4d45-87cc-57451fb61e68';
    const singlePromoCodeId = '726ddaea-2baa-4fd7-97a0-9db2b89260d6';
    const applicationModel = {
      eligibilityStatus: EligibilityStatus.ELIGIBLE,
      promoCode: mockPromoCode,
      promoCodeApplied: true,
    };

    it('should update promo code usage and application successfully', async () => {
      await repository.updatePromoCodeUsage(
        promoCodeType,
        parentPromoCodeId,
        memberId,
        applicationId,
        applicationModel,
        singlePromoCodeId,
      );

      expect(mockDynamoDB).toHaveReceivedCommandWith(TransactWriteCommand, {
        TransactItems: [
          {
            Update: {
              TableName: 'memberProfilesTest',
              Key: {
                pk: `MEMBER#${memberId}`,
                sk: `APPLICATION#${applicationId}`,
              },
              UpdateExpression: `SET #eligibilityStatus = :eligibilityStatus, #promoCode = :promoCode, #promoCodeApplied = :promoCodeApplied `,
              ExpressionAttributeNames: {
                '#eligibilityStatus': 'eligibilityStatus',
                '#promoCode': 'promoCode',
                '#promoCodeApplied': 'promoCodeApplied',
              },
              ExpressionAttributeValues: {
                ':eligibilityStatus': applicationModel.eligibilityStatus,
                ':promoCode': applicationModel.promoCode,
                ':promoCodeApplied': applicationModel.promoCodeApplied,
              },
            },
          },
          {
            Update: {
              TableName: 'memberProfilesTest',
              Key: {
                pk: `PROMO_CODE#${parentPromoCodeId}`,
                sk: promoCodeType,
              },
              UpdateExpression: `ADD currentUsages :increment`,
              ExpressionAttributeValues: {
                ':increment': 1,
              },
            },
          },
          {
            Update: {
              TableName: 'memberProfilesTest',
              Key: {
                pk: `PROMO_CODE#${parentPromoCodeId}`,
                sk: `SINGLE_USE#${singlePromoCodeId}`,
              },
              UpdateExpression: 'SET #used = :used, #usedDate = :usedDate',
              ExpressionAttributeNames: {
                '#used': 'used',
                '#usedDate': 'usedDate',
              },
              ExpressionAttributeValues: {
                ':used': true,
                ':usedDate': '2023-01-01T00:00:00.000Z',
              },
            },
          },
        ],
      });
    });

    it('should throw an error when transact write fails', async () => {
      mockDynamoDB.on(TransactWriteCommand).rejects(new Error('DynamoDB error'));

      await expect(
        repository.updatePromoCodeUsage(
          promoCodeType,
          parentPromoCodeId,
          memberId,
          applicationId,
          applicationModel,
        ),
      ).rejects.toThrow('DynamoDB error');
    });
  });

  const parentCodeQueryResultWithType = (type: PromoCodeType) => {
    return {
      pk: 'PROMO_CODE#fdb27574-d07d-463d-9f74-3c783cc086ac',
      sk: type,
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      promoCodeType: type,
      active: true,
      bypassPayment: false,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: mockPromoCode,
      codeProvider: '4489d238-245d-472f-ba17-582d68fd2bd7',
      createdDate: '2021-09-07T12:21:17.000Z',
      currentUsages: 300,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07T12:21:17.000Z',
      maxUsages: 1000,
      name: 'NHS',
      validityEndDate: '2022-09-07T12:21:17.000Z',
      validityStartDate: '2021-09-07T12:21:17.000Z',
    };
  };

  const parentCodeParsedModelWithType = (type: PromoCodeType) => {
    return {
      parentId: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      promoCodeType: type,
      active: true,
      bypassPayment: false,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: mockPromoCode,
      codeProvider: '4489d238-245d-472f-ba17-582d68fd2bd7',
      createdDate: '2021-09-07T12:21:17.000Z',
      currentUsages: 300,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07T12:21:17.000Z',
      maxUsages: 1000,
      name: 'NHS',
      validityEndDate: '2022-09-07T12:21:17.000Z',
      validityStartDate: '2021-09-07T12:21:17.000Z',
    };
  };
});
