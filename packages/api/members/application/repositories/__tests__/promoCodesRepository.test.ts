import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { PromoCodesRepository } from '@blc-mono/members/application/repositories/promoCodesRepository';
import { PromoCodeType } from '@blc-mono/members/application/enums/PromoCodeType';
import 'aws-sdk-client-mock-jest';

const mockDynamoDB = mockClient(DynamoDBDocumentClient);

describe('PromoCodesRepository', () => {
  const mockPromoCode = 'CODE123';
  const mockParentPromoCodeUuid = 'fdb27574-d07d-463d-9f74-3c783cc086ac';

  let repository: PromoCodesRepository;

  beforeEach(() => {
    repository = new PromoCodesRepository(mockDynamoDB as any, 'memberPromosTest');
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
          TableName: 'memberPromosTest',
          IndexName: 'gsi2',
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
          addedDate: '2021-09-07T12:21:17.000Z',
          code: mockPromoCode,
          used: true,
          usedDate: '2021-10-15T12:21:17.000Z',
        };
        const singleUseCodeParsedModel = {
          parentUuid: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
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
          addedDate: '2021-09-07',
          singleCodeUuid: '70f4995f-4c86-48ff-b700-79f1b7b216c2',
          used: true,
          usedDate: '2021-10-15',
        };
        const mockQueryResult = { Items: [singleUseCodeQueryResult] };
        mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

        const result = await repository.getMultiUseOrSingleUseChildPromoCode(mockPromoCode);

        expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
          TableName: 'memberPromosTest',
          IndexName: 'gsi2',
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

      const result = await repository.getSingleUseParentPromoCode(mockParentPromoCodeUuid);

      expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
        TableName: 'memberPromosTest',
        KeyConditionExpression: 'pk = :pk AND sk = :singleCodeParentSk',
        ExpressionAttributeValues: {
          ':pk': `PROMO_CODE#${mockParentPromoCodeUuid}`,
          ':singleCodeParentSk': 'SINGLE_USE',
        },
      });
      expect(result).toEqual([singleUseParentCodeParsedModel]);
    });

    it('should return null when code is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const result = await repository.getSingleUseParentPromoCode(mockParentPromoCodeUuid);

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      await expect(repository.getSingleUseParentPromoCode(mockParentPromoCodeUuid)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });

  const parentCodeQueryResultWithType = (type: PromoCodeType) => {
    return {
      pk: 'PROMO_CODE#fdb27574-d07d-463d-9f74-3c783cc086ac',
      sk: type,
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
      parentUuid: 'fdb27574-d07d-463d-9f74-3c783cc086ac',
      active: true,
      bypassPayment: false,
      bypassVerification: true,
      cardValidityTerm: 2,
      code: mockPromoCode,
      codeProvider: '4489d238-245d-472f-ba17-582d68fd2bd7',
      createdDate: '2021-09-07',
      currentUsages: 300,
      description: 'For NHS employees',
      lastUpdatedDate: '2021-09-07',
      maxUsages: 1000,
      name: 'NHS',
      promoCodeType: type,
      validityEndDate: '2022-09-07',
      validityStartDate: '2021-09-07',
      addedDate: undefined,
      cardId: undefined,
      singleCodeUuid: undefined,
      used: undefined,
      usedDate: undefined,
    };
  };
});
