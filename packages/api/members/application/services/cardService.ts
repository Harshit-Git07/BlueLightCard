import { logger } from '../middleware';
import { CardModel, UpdateCardModel } from '../models/cardModel';
import { CardRepository } from '../repositories/cardRepository';
import { CardStatus } from '@blc-mono/members/application/models/enums/CardStatus';

export class CardService {
  constructor(private readonly repository: CardRepository = new CardRepository()) {}

  async getCards(memberId: string): Promise<CardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards', memberId });
      return await this.repository.getCards(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching cards', error });
      throw error;
    }
  }

  async getCardsWithStatus(cardStatus: CardStatus): Promise<CardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards' });
      return await this.repository.getCardsWithStatus(cardStatus);
    } catch (error) {
      logger.error({ message: 'Error fetching cards with status', error });
      throw error;
    }
  }

  async getCard(memberId: string, cardNumber: string): Promise<CardModel> {
    try {
      logger.debug({ message: 'Fetching card', memberId, cardNumber });
      return await this.repository.getCard(memberId, cardNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching card', error });
      throw error;
    }
  }

  async getCardById(cardNumber: string): Promise<CardModel> {
    try {
      logger.debug({ message: 'Fetching card by id', cardNumber });
      return await this.repository.getCardById(cardNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching card by id', error });
      throw error;
    }
  }

  async updateCard(memberId: string, cardNumber: string, card: UpdateCardModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating card', memberId, card });
      await this.repository.upsertCard({
        memberId,
        cardNumber,
        card,
        isInsert: false,
      });
    } catch (error) {
      logger.error({ message: 'Error updating card', error });
      throw error;
    }
  }
}
