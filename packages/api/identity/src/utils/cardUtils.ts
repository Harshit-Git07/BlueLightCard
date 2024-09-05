import { CardModel } from '..//models/card';
import { CardStatus } from '../../../core/src/types/cardStatus.enum';

export function getOfferRedeemStatus(cards: CardModel[]): boolean {
  if (cards.length === 0) {
    return false;
  }

  // Sort cards by cardId descending
  cards.sort((card, nextCard) => Number(nextCard.cardId) - Number(card.cardId));

  const latestCard = cards[0];
  const previousCard = cards.length > 1 ? cards[1] : null;

  // Condition 1: Active Card Status or Renewal in Progress
  if (isActiveCard(latestCard) || isRenewalInProgress(latestCard, previousCard)) {
    return true;
  }

  return false;
}

function isActiveCard(latestCard: CardModel) {
  const activeStatuses: CardStatus[] = [CardStatus.PHYSICAL_CARD, CardStatus.ADDED_TO_BATCH, CardStatus.USER_BATCHED];
  return activeStatuses.includes(latestCard.cardStatus as CardStatus);
}

function isRenewalInProgress(latestCard: CardModel, previousCard: any) {
  if (latestCard.cardStatus === CardStatus.AWAITING_ID_APPROVAL || latestCard.cardStatus === CardStatus.ID_APPROVED) {
    if (previousCard && previousCard.cardStatus === CardStatus.CARD_EXPIRED) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      // Convert previousCard.expires from timestamp to Date
      const previousCardExpiryDate = new Date(Number(previousCard.expires));
      if (previousCardExpiryDate >= thirtyDaysAgo) {
        return true;
      }
    }
  }
  return false;
}
