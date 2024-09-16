import { describe, expect, test } from '@jest/globals';

import { hasActiveCard } from '../cardStatusCalculator';
import { CardModel } from '../../models/card';
import { aCardModel } from '../../testUtils/CardModelTestData';
import { CardStatus } from '../../../../core/src/types/cardStatus.enum';

describe('hasActiveCard', () => {
  test('should return true when the latest card has cardStatus=PHYSICAL_CARD', () => {
    const cards: CardModel[] = [aCardModel(CardStatus.PHYSICAL_CARD)];
    expect(hasActiveCard(cards)).toBe(true);
  });

  test('should return true when the latest card has cardStatus=ADDED_TO_BATCH', () => {
    const cards: CardModel[] = [aCardModel(CardStatus.ADDED_TO_BATCH)];
    expect(hasActiveCard(cards)).toBe(true);
  });

  test('should return true when the latest card has cardStatus=USER_BATCHED', () => {
    const cards: CardModel[] = [aCardModel(CardStatus.USER_BATCHED)];
    expect(hasActiveCard(cards)).toBe(true);
  });

  test('should return false when there are no cards', () => {
    expect(hasActiveCard([])).toBe(false);
  });

  test('should return false when the latest card has cardStatus=CARD_EXPIRED', () => {
    const cards: CardModel[] = [aCardModel(CardStatus.CARD_EXPIRED)];
    expect(hasActiveCard(cards)).toBe(false);
  });

  test('should return false when the latest card has cardStatus=AWAITING_ID_APPROVAL', () => {
    const cards: CardModel[] = [aCardModel(CardStatus.AWAITING_ID_APPROVAL)];
    expect(hasActiveCard(cards)).toBe(false);
  });

  test('should return false when the latest card has cardStatus=ID_APPROVED and the previous card has cardStatus=CARD_EXPIRED and the expiry date is more than 30 days ago', () => {
    const latestCard = aCardModel(CardStatus.ID_APPROVED);
    latestCard.cardId = '10';
    const previousCard = aCardModel(CardStatus.CARD_EXPIRED);
    previousCard.cardId = '5';
    previousCard.expires = new Date().setDate(new Date().getDate() - 31).toString();

    const cards: CardModel[] = [latestCard, previousCard];
    expect(hasActiveCard(cards)).toBe(false);
  });

  test('should return false when the latest card has cardStatus=AWAITING_ID_APPROVAL and the previous card has cardStatus=CARD_EXPIRED and the expiry date is more than 30 days ago', () => {
    const latestCard = aCardModel(CardStatus.AWAITING_ID_APPROVAL);
    latestCard.cardId = '10';
    const previousCard = aCardModel(CardStatus.CARD_EXPIRED);
    previousCard.cardId = '5';
    previousCard.expires = new Date().setDate(new Date().getDate() - 31).toString();

    const cards: CardModel[] = [latestCard, previousCard];
    expect(hasActiveCard(cards)).toBe(false);
  });

  test('should return true when the latest card has cardStatus=ID_APPROVED and the previous card has cardStatus=CARD_EXPIRED and the expiry date is within 30 days', () => {
    const latestCard = aCardModel(CardStatus.ID_APPROVED);
    latestCard.cardId = '10';
    const previousCard = aCardModel(CardStatus.CARD_EXPIRED);
    previousCard.cardId = '5';
    previousCard.expires = new Date().setDate(new Date().getDate() - 29).toString();

    const cards: CardModel[] = [latestCard, previousCard];
    expect(hasActiveCard(cards)).toBe(true);
  });

  test('should return true when the latest card has cardStatus=AWAITING_ID_APPROVAL and the previous card has cardStatus=CARD_EXPIRED and the expiry date is within 30 days', () => {
    const latestCard = aCardModel(CardStatus.AWAITING_ID_APPROVAL);
    latestCard.cardId = '10';
    const previousCard = aCardModel(CardStatus.CARD_EXPIRED);
    previousCard.cardId = '5';
    previousCard.expires = new Date().setDate(new Date().getDate() - 29).toString();

    const cards: CardModel[] = [latestCard, previousCard];
    expect(hasActiveCard(cards)).toBe(true);
  });
});
