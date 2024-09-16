import { CardStatus } from '../../../core/src/types/cardStatus.enum';
import { CardModel } from 'src/models/card';

export function hasActiveCard(cards: CardModel[]): boolean {
  if (cards.length === 0) return false;

  // Sort cards by cardId descending
  cards.sort((card, nextCard) => Number(nextCard.cardId) - Number(card.cardId));

  const latestCard = cards[0];
  const previousCard = cards.length > 1 ? cards[1] : null;

  // Condition 1: Active Card Status
  const activeStatuses: CardStatus[] = [
    CardStatus.PHYSICAL_CARD,
    CardStatus.ADDED_TO_BATCH,
    CardStatus.USER_BATCHED,
  ];
  if (activeStatuses.includes(latestCard.cardStatus as CardStatus)) {
    return true;
  }

  // Condition 2: Renewal in Progress
  if (
    latestCard.cardStatus === CardStatus.AWAITING_ID_APPROVAL ||
    latestCard.cardStatus === CardStatus.ID_APPROVED
  ) {
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
