import { CardModel } from '@blc-mono/shared/models/members/cardModel';
import { DynamoRow } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { cardKey, memberKey } from '@blc-mono/members/application/repositories/repository';
import { CardStatus } from '@blc-mono/shared/models/members/enums/CardStatus';

export type CardModelForDynamo = CardModel & DynamoRow;

export const cards: CardModelForDynamo[] = [
  // willsmith+newuser@bluelightcard.co.uk
  buildCard({
    memberId: '4f0153b7-e2e9-11ef-bead-506b8df2a7a7',
    cardNumber: '1',
    cardStatus: CardStatus.CARD_EXPIRED,
  }),
];

interface CardModelBuilder
  extends Partial<
    Omit<CardModelForDynamo, 'pk' | 'sk' | 'memberId' | 'cardNumber' | 'cardStatus'>
  > {
  memberId: string;
  cardNumber: string;
  cardStatus: CardStatus;
}

function buildCard({
  memberId,
  cardNumber,
  cardStatus,
  nameOnCard = 'John Doe',
  createdDate = '2023-08-11T06:01:00.636Z',
  postedDate = '2023-08-11T06:01:00.636Z',
  expiryDate = '2029-11-30T13:00:24.000Z',
  ...card
}: CardModelBuilder): CardModelForDynamo {
  return {
    ...card,
    pk: memberKey(memberId),
    memberId,
    sk: cardKey(cardNumber),
    cardNumber,
    cardStatus,
    nameOnCard,
    createdDate,
    postedDate,
    expiryDate,
  };
}
