import { logger } from '../middleware';
import {
  AwaitingBatchingCardModel,
  BatchedCardModel,
  CardModel,
  CreateCardModel,
  UpdateCardModel,
} from '@blc-mono/shared/models/members/cardModel';
import { CardRepository, UpsertCardOptions } from '../repositories/cardRepository';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';

let cardServiceSingleton: CardService;

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

  async getCardsInBatch(batchNumber: string): Promise<BatchedCardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards in batch', batchNumber });
      return await this.repository.getCardsInBatch(batchNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching cards', error });
      throw error;
    }
  }

  async getCardsAwaitingBatching(): Promise<AwaitingBatchingCardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards awaiting batching' });
      return await this.repository.getCardsAwaitingBatching();
    } catch (error) {
      logger.error({ message: 'Error fetching cards awaiting batching', error });
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

  async createCard(memberId: string, cardNumber: string, card: CreateCardModel): Promise<void> {
    try {
      const createdDate = new Date();
      const expiryDate = new Date(createdDate.getFullYear() + 2, createdDate.getMonth() + 1, 0);

      const newCard: CardModel = {
        memberId: memberId,
        cardNumber: cardNumber,
        nameOnCard: card.nameOnCard,
        createdDate: createdDate.toISOString(),
        expiryDate: expiryDate.toISOString(),
        purchaseDate: card.purchaseDate,
        cardStatus: CardStatus.AWAITING_BATCHING,
        paymentStatus: card.paymentStatus,
      };
      const upsertCardOptions: UpsertCardOptions = {
        memberId: memberId,
        cardNumber: cardNumber,
        card: newCard,
        isInsert: true,
      };
      await this.repository.upsertCard(upsertCardOptions);
    } catch (error) {
      logger.error({ message: 'Error updating card', error });
      throw error;
    }
  }

  async processPrintedCard(
    memberId: string,
    cardNumber: string,
    timePrinted: string,
    timePosted: string,
  ): Promise<void> {
    await this.updateCard(memberId, cardNumber, {
      printedDate: timePrinted,
      postedDate: timePosted,
      cardStatus: CardStatus.PHYSICAL_CARD,
    });

    // TODO: delete application for card and any remaining ID files if present
    // TODO: email user with card_posted template
  }
}

export function cardService(): CardService {
  if (!cardServiceSingleton) {
    cardServiceSingleton = new CardService();
  }

  return cardServiceSingleton;
}
