// Events
export const PAYMENTS_EVENT_SOURCE = 'payments';
export enum PaymentsEventDetailType {
  // payment has been initiaited
  PAYMENT_INITIATED = 'paymentInitiated',

  // payment has succeeded
  PAYMENT_SUCCEEDED = 'paymentSucceeded',

  // payment has failed
  PAYMENT_FAILED = 'paymentFailed',
}
