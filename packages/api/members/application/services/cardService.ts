import {
  AwaitingBatchingCardModel,
  BatchedCardModel,
  CardModel,
  CreateCardModel,
  UpdateCardModel,
} from '@blc-mono/shared/models/members/cardModel';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';
import {
  CardRepository,
  UpsertCardOptions,
} from '@blc-mono/members/application/repositories/cardRepository';
import { logger } from '@blc-mono/members/application/handlers/shared/middleware/middleware';

let cardServiceSingleton: CardService;

export class CardService {
  constructor(private readonly cardRepository = new CardRepository()) {}

  async getCards(memberId: string): Promise<CardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards', memberId });
      return await this.cardRepository.getCards(memberId);
    } catch (error) {
      logger.error({ message: 'Error fetching cards', error });
      throw error;
    }
  }

  async getCardsInBatch(batchNumber: string): Promise<BatchedCardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards in batch', batchNumber });
      return await this.cardRepository.getCardsInBatch(batchNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching cards', error });
      throw error;
    }
  }

  async getCardsAwaitingBatching(): Promise<AwaitingBatchingCardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards awaiting batching' });
      return await this.cardRepository.getCardsAwaitingBatching();
    } catch (error) {
      logger.error({ message: 'Error fetching cards awaiting batching', error });
      throw error;
    }
  }

  async getCardsWithStatus(cardStatus: CardStatus): Promise<CardModel[]> {
    try {
      logger.debug({ message: 'Fetching cards' });
      return await this.cardRepository.getCardsWithStatus(cardStatus);
    } catch (error) {
      logger.error({ message: 'Error fetching cards with status', error });
      throw error;
    }
  }

  async getCard(memberId: string, cardNumber: string): Promise<CardModel> {
    try {
      logger.debug({ message: 'Fetching card', memberId, cardNumber });
      return await this.cardRepository.getCard(memberId, cardNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching card', error });
      throw error;
    }
  }

  async getCardById(cardNumber: string): Promise<CardModel> {
    try {
      logger.debug({ message: 'Fetching card by id', cardNumber });
      return await this.cardRepository.getCardById(cardNumber);
    } catch (error) {
      logger.error({ message: 'Error fetching card by id', error });
      throw error;
    }
  }

  async updateCard(memberId: string, cardNumber: string, card: UpdateCardModel): Promise<void> {
    try {
      logger.debug({ message: 'Updating card', memberId, card });
      await this.cardRepository.upsertCard({
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
      await this.cardRepository.upsertCard(upsertCardOptions);
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
