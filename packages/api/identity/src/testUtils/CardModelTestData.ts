import { CardStatus } from '../../../core/src/types/cardStatus.enum';
import { CardModel } from '../models/card';

export function aCardModel(cardStatus: CardStatus = CardStatus.ADDED_TO_BATCH): CardModel {
  return {
    cardId: '1',
    cardStatus: cardStatus,
    expires: '',
    cardPrefix: undefined,
    datePosted: null,
  };
}
