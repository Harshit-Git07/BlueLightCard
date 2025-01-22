import { middleware } from '@blc-mono/members/application/middleware';
import { CardService } from '@blc-mono/members/application/services/cardService';
import { AwaitingBatchingCardModel } from '@blc-mono/shared/models/members/cardModel';

const service = new CardService();

const unwrappedHandler = async (): Promise<AwaitingBatchingCardModel[]> => {
  return await service.getCardsAwaitingBatching();
};

export const handler = middleware(unwrappedHandler);
