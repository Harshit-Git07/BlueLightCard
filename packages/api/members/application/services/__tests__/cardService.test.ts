import { CardService } from '../../services/cardService';
import { CardRepository } from '../../repositories/cardRepository';
import { logger } from '../../middleware';
import { CardModel } from '../../models/cardModel';
import { v4 as uuidv4 } from 'uuid';
import { CardStatus } from '../../models/enums/CardStatus';

jest.mock('../../repositories/cardRepository');
jest.mock('sst/node/table', () => ({
  Table: jest.fn(),
}));

describe('CardService', () => {
  const memberId = uuidv4();
  const cardNumber = uuidv4();
  const card: CardModel = {
    memberId,
    cardNumber,
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
      await expect(cardService.updateCard(memberId, card)).rejects.toThrow('Update error');
    });

    it('should update card successfully', async () => {
      await cardService.updateCard(memberId, card);
      expect(repositoryMock.upsertCard).toHaveBeenCalledWith({
        memberId,
        card,
        isInsert: false,
      });
    });
  });
});
