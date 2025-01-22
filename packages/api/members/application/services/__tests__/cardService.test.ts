import { CardService } from '../../services/cardService';
import { CardRepository } from '../../repositories/cardRepository';
import { CardModel, UpdateCardModel } from '@blc-mono/shared/models/members/cardModel';
import { v4 as uuidv4 } from 'uuid';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import { ProfileService } from '@blc-mono/members/application/services/profileService';
import { ProfileModel } from '@blc-mono/shared/models/members/profileModel';

jest.mock('../../repositories/cardRepository');

describe('CardService', () => {
  const memberId = uuidv4();
  const cardNumber = 'BLC123456789';
  const card: CardModel = {
    cardNumber: cardNumber,
    cardStatus: CardStatus.PHYSICAL_CARD,
    createdDate: '2023-01-01T00:00:00.000Z',
    nameOnCard: 'John Doe',
    purchaseDate: '2023-01-01T00:00:00.000Z',
    memberId,
    expiryDate: '2024-01-01',
  };
  const updateCard: UpdateCardModel = {
    cardStatus: CardStatus.PHYSICAL_CARD,
  };
  let cardService: CardService;
  let repositoryMock: jest.Mocked<CardRepository>;

  beforeEach(() => {
    repositoryMock = new CardRepository() as jest.Mocked<CardRepository>;
    cardService = new CardService(repositoryMock);
  });

  describe('getCards', () => {
    it('should throw error if fetching cards fails', async () => {
      repositoryMock.getCards.mockRejectedValue(new Error('Fetch error'));
      await expect(cardService.getCards(memberId)).rejects.toThrow('Fetch error');
    });

    it('should fetch cards successfully', async () => {
      repositoryMock.getCards.mockResolvedValue([card]);
      const result = await cardService.getCards(memberId);
      expect(result).toEqual([card]);
    });
  });

  describe('getCard', () => {
    it('should throw error if fetching card fails', async () => {
      repositoryMock.getCard.mockRejectedValue(new Error('Fetch error'));
      await expect(cardService.getCard(memberId, cardNumber)).rejects.toThrow('Fetch error');
    });

    it('should fetch card successfully', async () => {
      repositoryMock.getCard.mockResolvedValue(card);
      const result = await cardService.getCard(memberId, cardNumber);
      expect(result).toEqual(card);
    });
  });

  describe('updateCard', () => {
    it('should throw error if updating card fails', async () => {
      repositoryMock.upsertCard.mockRejectedValue(new Error('Update error'));
      await expect(cardService.updateCard(memberId, cardNumber, updateCard)).rejects.toThrow(
        'Update error',
      );
    });

    it('should update card successfully', async () => {
      await cardService.updateCard(memberId, cardNumber, updateCard);
      expect(repositoryMock.upsertCard).toHaveBeenCalledWith({
        memberId,
        cardNumber,
        card: updateCard,
        isInsert: false,
      });
    });
  });

  describe('processPrintedCard', () => {
    it('should throw error if update card fails', async () => {
      repositoryMock.upsertCard.mockRejectedValue(new Error('Fetch error'));
      await expect(
        cardService.processPrintedCard(
          memberId,
          cardNumber,
          '2023-01-01T00:00:00.000Z',
          '2023-01-02T00:00:00.000Z',
        ),
      ).rejects.toThrow('Fetch error');
    });

    it('should process printed cards successfully', async () => {
      const profile: ProfileModel = {
        memberId,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        email: 'john.doe@example.com',
        applications: [],
        cards: [],
      };
      ProfileService.prototype.getProfile = jest.fn().mockResolvedValue(profile);

      await cardService.processPrintedCard(
        memberId,
        cardNumber,
        '2023-01-01T00:00:00.000Z',
        '2023-01-02T00:00:00.000Z',
      );

      expect(repositoryMock.upsertCard).toHaveBeenCalled();
    });
  });
});
