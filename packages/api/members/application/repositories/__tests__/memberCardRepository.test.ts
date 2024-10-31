import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { MemberCardRepository } from '../memberCardRepository';
import { MemberCardQueryPayload, MemberCardUpdatePayload } from '../../types/memberCardTypes';
import { CardStatus } from 'application/enums/CardStatus';
import { PaymentStatus } from 'application/enums/PaymentStatus';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';

describe('MemberCardRepository', () => {
  let repository: MemberCardRepository;
  const mockDynamoDB = mockClient(DynamoDBDocumentClient);

  beforeEach(() => {
    repository = new MemberCardRepository(mockDynamoDB as any, 'TestTable');
  });

  afterEach(() => {
    mockDynamoDB.reset();
  });

  describe('getMemberCards', () => {
    it('should return card information when card is found', async () => {
      const mockQueryResult = {
        Items: [
          {
            pk: 'MEMBER#12345678-1234-1234-12345678',
            sk: 'CARD#12345678',
            uuid: '12345678-1234-1234-12345678',
            cardNumber: '12345678',
            name_on_card: 'Test Cardholder',
            card_status: CardStatus.PHYSICAL_CARD,
            expiry_date: '2025-12-12T00:00:00Z',
            posted_date: '2024-12-12T00:00:00Z',
            purchase_time: '2024-12-12T00:00:00Z',
            payment_status: PaymentStatus.PAID_CARD,
            batch_number: '1',
          },
        ],
      };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const mockQuery: MemberCardQueryPayload = {
        uuid: '12345678-1234-1234-12345678',
        brand: 'blc-uk',
        cardNumber: '12345678',
      };

      const result = await repository.getMemberCards(mockQuery);

      expect(result).toEqual([
        {
          uuid: '12345678-1234-1234-12345678',
          cardNumber: '12345678',
          name_on_card: 'Test Cardholder',
          card_status: CardStatus.PHYSICAL_CARD,
          expiry_date: '2025-12-12',
          posted_date: '2024-12-12',
          purchase_time: '2024-12-12',
          payment_status: PaymentStatus.PAID_CARD,
          batch_number: '1',
        },
      ]);
      expect(mockDynamoDB).toHaveReceivedCommandWith(QueryCommand, {
        TableName: 'TestTable',
        KeyConditionExpression: '#pk = :pk AND #sk = :sk',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk',
        },
        ExpressionAttributeValues: {
          ':pk': `MEMBER#12345678-1234-1234-12345678`,
          ':sk': 'CARD#12345678',
        },
      });
    });

    it('should return null when card is not found', async () => {
      const mockQueryResult = { Items: [] };
      mockDynamoDB.on(QueryCommand).resolves(mockQueryResult);

      const mockQuery: MemberCardQueryPayload = {
        uuid: '12345678-1234-2134-12345678',
        brand: 'blc-uk',
        cardNumber: '123',
      };

      const result = await repository.getMemberCards(mockQuery);

      expect(result).toBeNull();
    });

    it('should throw an error when query fails', async () => {
      mockDynamoDB.on(QueryCommand).rejects(new Error('DynamoDB error'));

      const mockQuery: MemberCardQueryPayload = {
        uuid: '12345678-1234-2134-12345678',
        brand: 'blc-uk',
        cardNumber: '123',
      };

      await expect(repository.getMemberCards(mockQuery)).rejects.toThrow('DynamoDB error');
    });
  });

  describe('updateMemberCard', () => {
    const queryWithCardNo: MemberCardQueryPayload = {
      cardNumber: '123',
      uuid: '12345678-1234-1234-12345678',
      brand: 'blc-uk',
    };

    it('should update the card successfully', async () => {
      mockDynamoDB.on(UpdateCommand).resolves({});

      const payload: MemberCardUpdatePayload = {
        name_on_card: 'Mike',
        card_status: CardStatus.PHYSICAL_CARD,
        expiry_date: '2025-12-12T00:00:00Z',
        posted_date: '2024-12-12T00:00:00Z',
        purchase_time: '2024-12-12T00:00:00Z',
        payment_status: PaymentStatus.PAID_CARD,
        batch_number: '1',
      };

      await repository.updateMemberCard(queryWithCardNo, payload);

      expect(mockDynamoDB).toHaveReceivedCommandWith(UpdateCommand, {
        ConditionExpression: 'pk = :pk AND sk = :sk',
        TableName: 'TestTable',
        Key: {
          pk: `MEMBER#${queryWithCardNo.uuid}`,
          sk: `CARD#${queryWithCardNo.cardNumber}`,
        },
        UpdateExpression:
          'SET name_on_card = :name_on_card, card_status = :card_status, expiry_date = :expiry_date, posted_date = :posted_date, purchase_time = :purchase_time, payment_status = :payment_status, batch_number = :batch_number ',
        ExpressionAttributeValues: {
          ':name_on_card': 'Mike',
          ':card_status': 'PHYSICAL_CARD',
          ':expiry_date': '2025-12-12T00:00:00Z',
          ':posted_date': '2024-12-12T00:00:00Z',
          ':purchase_time': '2024-12-12T00:00:00Z',
          ':payment_status': 'PAID_CARD',
          ':batch_number': '1',
          ':pk': `MEMBER#${queryWithCardNo.uuid}`,
          ':sk': `CARD#${queryWithCardNo.cardNumber}`,
        },
      });
    });

    it('should throw an error when update fails', async () => {
      mockDynamoDB.on(UpdateCommand).rejects(new Error('DynamoDB error'));

      const payload: MemberCardUpdatePayload = {
        name_on_card: 'Mike',
        card_status: CardStatus.PHYSICAL_CARD,
        expiry_date: '2025-12-12T00:00:00Z',
        posted_date: '2024-12-12T00:00:00Z',
        purchase_time: '2024-12-12T00:00:00Z',
        payment_status: PaymentStatus.PAID_CARD,
        batch_number: '1',
      };

      await expect(repository.updateMemberCard(queryWithCardNo, payload)).rejects.toThrow(
        'DynamoDB error',
      );
    });
  });
});
