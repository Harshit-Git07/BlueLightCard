export function getCardStatus(status: Number): string {
    switch (status) {
      case 2:
        return 'AWAITING_ID_APPROVAL';
      case 3:
        return 'ID_APPROVED';
      case 4:
        return 'ADDED_TO_BATCH';
      case 5:
        return 'USER_BATCHED';
      case 6:
        return 'PHYSICAL_CARD';
      case 8:
        return 'CARD_LOST';
      case 9:
        return 'CARD_EXPIRED_BY_ADMIN';
      case 10:
        return 'CARD_EXPIRED';
      case 11:
        return 'DECLINED';
      case 12:
        return 'PENDING_REFUND';
      case 13:
        return 'REFUNDED';
      default:
        return 'AWAITING_ID';
    }
  }