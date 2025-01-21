import { ApplicationSchema } from '../../components/CardVerificationAlerts/types';

export const completedPaymentStatuses: Array<ApplicationSchema['paymentStatus']> = [
  'PAID_CARD',
  'PAID_PAYPAL',
  'PAID_PROMO_CODE',
  'PAID_CHEQUE',
  'PAID_ADMIN',
];
