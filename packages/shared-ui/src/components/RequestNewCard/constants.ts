import { PaymentStatus } from '@blc-mono/shared/models/members/enums/PaymentStatus';

export const completedPaymentStatuses: Array<PaymentStatus> = [
  PaymentStatus.PAID_CARD,
  PaymentStatus.PAID_PAYPAL,
  PaymentStatus.PAID_PROMO_CODE,
  PaymentStatus.PAID_CHEQUE,
  PaymentStatus.PAID_ADMIN,
];
