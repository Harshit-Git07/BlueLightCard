import { CardStatus, CardStatusNumeric } from './../../../core/src/types/cardStatus.enum';

export function getCardStatus(status: Number): string {
    switch (status) {
      case CardStatusNumeric.two:
        return CardStatus.AWAITING_ID_APPROVAL;
      case CardStatusNumeric.three:
        return CardStatus.ID_APPROVED;
      case CardStatusNumeric.four:
        return CardStatus.ADDED_TO_BATCH;
      case CardStatusNumeric.five:
        return CardStatus.USER_BATCHED;
      case CardStatusNumeric.six:
        return CardStatus.PHYSICAL_CARD;
      case CardStatusNumeric.seven:
        return CardStatus.AWAITING_ACTIVATION;
      case CardStatusNumeric.eight:
        return CardStatus.CARD_LOST;
      case CardStatusNumeric.nine:
        return CardStatus.CARD_EXPIRED_BY_ADMIN;
      case CardStatusNumeric.ten:
        return CardStatus.CARD_EXPIRED;
      case CardStatusNumeric.eleven:
        return CardStatus.DECLINED;
      case CardStatusNumeric.twelve:
        return CardStatus.PENDING_REFUND;
      case CardStatusNumeric.thirteen:
        return CardStatus.REFUNDED;
      default:
        return CardStatus.AWAITING_ID;
    }
  }

  export function getCardStatusNumeric(status: String): Number {
    switch (status) {
      case CardStatus.AWAITING_ID_APPROVAL:
        return CardStatusNumeric.two;
      case CardStatus.ID_APPROVED:
        return CardStatusNumeric.three;
      case CardStatus.ADDED_TO_BATCH:
        return CardStatusNumeric.four;
      case CardStatus.USER_BATCHED:
        return CardStatusNumeric.five;
      case CardStatus.PHYSICAL_CARD:
        return CardStatusNumeric.six;
      case CardStatus.AWAITING_ACTIVATION:
        return CardStatusNumeric.seven;
      case CardStatus.CARD_LOST:
        return CardStatusNumeric.eight;
      case CardStatus.CARD_EXPIRED_BY_ADMIN:
        return CardStatusNumeric.nine;
      case CardStatus.CARD_EXPIRED:
        return CardStatusNumeric.ten;
      case CardStatus.DECLINED:
        return CardStatusNumeric.eleven;
      case CardStatus.PENDING_REFUND:
        return CardStatusNumeric.twelve;
      case CardStatus.REFUNDED:
        return CardStatusNumeric.thirteen;
      default:
        return CardStatusNumeric.fourteen;
    }
  }

  export function getPCardStatus(status: String): Boolean {
    if (status === CardStatus.CARD_LOST || status === CardStatus.CARD_EXPIRED_BY_ADMIN || status === CardStatus.DECLINED || status === CardStatus.REFUNDED)  {
      return true;
    } else if (status === CardStatus.AWAITING_ID || status === CardStatus.AWAITING_ID_APPROVAL || status == CardStatus.ID_APPROVED 
      || status === CardStatus.ADDED_TO_BATCH || status === CardStatus.USER_BATCHED || status === CardStatus.AWAITING_ACTIVATION) {
      return false;
    }

    return true;
  }

  export function getCardAction(status: String, datePosted: String) {
    let date = new Date();
    let postedDate = new Date(Number(datePosted)*1000);
    let start = new Date(Number(datePosted)*1000).setDate(postedDate.getDate() + 14);
    let end = new Date(Number(datePosted)*1000).setDate(postedDate.getDate() + 90);

    if (status === CardStatus.PHYSICAL_CARD || status === CardStatus.AWAITING_ACTIVATION || status === CardStatus.DECLINED || status === CardStatus.REFUNDED)  {
      if ((date >= new Date(start)) && (date <= new Date(end))) { 
        return 'reprint';
      } 
      if (Date.now() > end*1000) {
        return 'lost';
      }
    }
    return '';
  }
