import { logger } from '../middleware';
import { CardModel } from '../models/cardModel';
import { CardRepository } from '../repositories/cardRepository';

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

  async getCard(memberId: string, cardNumber: string): Promise<CardModel> {
    try {
      logger.debug({ message: 'Fetching card', memberId, cardNumber });
      return await this.repository.getCard(memberId, cardNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching card', error });
      throw error;
    }
  }

  async updateCard(memberId: string, card: CardModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating card', memberId, card });
      await this.repository.upsertCard({
        memberId,
        card,
        isInsert: false,
      });
    } catch (error) {
      logger.error({ message: 'Error updating card', error });
      throw error;
    }
  }
}
