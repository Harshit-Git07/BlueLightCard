import { Logger } from '@aws-lambda-powertools/logger';
import { MemberCardRepository } from '../../repositories/memberCardRepository';
import { MemberCardService } from '../memberCardService';
import { z } from 'zod';
import { MemberCardUpdatePayload, MemberCardQueryPayload } from '../../types/memberCardTypes';
import { CardStatus } from 'application/enums/CardStatus';
import { PaymentStatus } from 'application/enums/PaymentStatus';

// Mock the dependencies
jest.mock('../../repositories/memberCardRepository');
jest.mock('@aws-lambda-powertools/logger');

describe('MemberCardService', () => {
  let service: MemberCardService;
  let mockRepository: jest.MockedObject<MemberCardRepository>;
  let mockLogger: jest.MockedObject<Logger>;

  beforeEach(() => {
    mockRepository = {
      getMemberCards: jest.fn(),
      updateMemberCard: jest.fn(),
      createMemberCard: jest.fn(),
    } as unknown as jest.MockedObject<MemberCardRepository>;

    mockLogger = {
      warn: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.MockedObject<Logger>;

    service = new MemberCardService(mockRepository, mockLogger);
  });

  describe('getMemberCards', () => {
    const queryWithCardNo: MemberCardQueryPayload = {
      cardNumber: '123',
      uuid: '12345678-1234-1234-12345678',
      brand: 'blc-uk',
    };

    const queryWithoutCardNo: MemberCardQueryPayload = {
      cardNumber: '',
      uuid: '12345678-1234-1234-12345678',
      brand: 'blc-uk',
    };

    it('should return a single card using a card number', async () => {
      const mockCard = [
        {
          uuid: `${queryWithoutCardNo.uuid}`,
          cardNumber: `123`,
          card_status: CardStatus.PHYSICAL_CARD,
          expiry_date: '12/12/2025',
          name_on_card: 'Mike',
          posted_date: null,
          purchase_time: null,
          payment_status: null,
          batch_number: null,
        },
      ];

      mockRepository.getMemberCards.mockResolvedValue(mockCard);

      const result = await service.getMemberCards(queryWithCardNo);

      expect(result).toEqual(mockCard);
      expect(mockRepository.getMemberCards).toHaveBeenCalledWith(queryWithCardNo);
    });

    it('should return multiple cards for a single member without specifying a card number', async () => {
      const mockCards = [
        {
          uuid: `${queryWithoutCardNo.uuid}`,
          cardNumber: `123`,
          card_status: CardStatus.PHYSICAL_CARD,
          expiry_date: '12/12/2025',
          name_on_card: 'Mike',
          posted_date: null,
          purchase_time: null,
          payment_status: null,
          batch_number: null,
        },
        {
          uuid: `${queryWithoutCardNo.uuid}`,
          cardNumber: `456`,
          card_status: CardStatus.CARD_EXPIRED,
          expiry_date: '12/12/2020',
          name_on_card: 'Jo',
          posted_date: null,
          purchase_time: null,
          payment_status: null,
          batch_number: null,
        },
      ];

      mockRepository.getMemberCards.mockResolvedValue(mockCards);

      const result = await service.getMemberCards(queryWithoutCardNo);

      expect(result).toEqual(mockCards);
      expect(mockRepository.getMemberCards).toHaveBeenCalledWith(queryWithoutCardNo);
    });
  });

  describe('updateMemberCard', () => {
    const queryWithCardNo: MemberCardQueryPayload = {
      cardNumber: '123',
      uuid: '12345678-1234-1234-12345678',
      brand: 'blc-uk',
    };

    it('should update card with valid data', async () => {
      const payload: MemberCardUpdatePayload = {
        name_on_card: 'Mike',
        card_status: CardStatus.PHYSICAL_CARD,
        expiry_date: '2025-12-12T00:00:00Z',
        posted_date: '2024-12-12T00:00:00Z',
        purchase_time: '2024-12-12T00:00:00Z',
        payment_status: PaymentStatus.PAID_CARD,
        batch_number: '1',
      };

      await service.updateMemberCard(queryWithCardNo, payload);

      expect(mockRepository.updateMemberCard).toHaveBeenCalledWith(queryWithCardNo, payload, false);
    });

    it('should throw an error if data is invalid', async () => {
      const invalidPayload = {
        name_on_card: 'Jo',
        card_status: CardStatus.PHYSICAL_CARD,
        expiry_date: 'invalid-date',
        posted_date: '2024-12-12T00:00:00Z',
        purchase_time: '08:00:00Z',
        payment_status: PaymentStatus.PAID_CARD,
        batch_number: '1',
      };

      await expect(
        service.updateMemberCard(queryWithCardNo, invalidPayload as MemberCardUpdatePayload),
      ).rejects.toThrow(z.ZodError);
    });
  });
});
