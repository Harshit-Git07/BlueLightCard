import { z } from 'zod';
import { eventSchema } from './event';
import { PAYMENTS_EVENT_SOURCE, PaymentsEventDetailType } from '../constants/payments';

// ================================== Events ===================================

export const PaymentObjectEventDetailSchema = z.object({
  currency: z.union([z.literal('gbp'), z.literal('aud')]),
  paymentIntentId: z.string(),
  created: z.number(),
  metadata: z.record(z.string(), z.string()),
  amount: z.number(),
  paymentMethodId: z.string().optional().or(z.string().nullable()),
  member: z.object({
    id: z.string(),
    brazeExternalId: z.string(),
    name: z.string().optional(),
  }).optional(),
});
export type PaymentObjectEventDetail = z.infer<typeof PaymentObjectEventDetailSchema>;

export const PaymentInitiatedEventSchema = eventSchema(
  PAYMENTS_EVENT_SOURCE,
  z.literal(PaymentsEventDetailType.PAYMENT_INITIATED),
  PaymentObjectEventDetailSchema,
);
export type PaymentInitiatedEvent = z.infer<typeof PaymentInitiatedEventSchema>;


export const PaymentSucceededEventSchema = eventSchema(
  PAYMENTS_EVENT_SOURCE,
  z.literal(PaymentsEventDetailType.PAYMENT_SUCCEEDED),
  PaymentObjectEventDetailSchema,
);
export type PaymentSucceededEvent = z.infer<typeof PaymentSucceededEventSchema>;

export const PaymentFailedEventSchema = eventSchema(
  PAYMENTS_EVENT_SOURCE,
  z.literal(PaymentsEventDetailType.PAYMENT_FAILED),
  PaymentObjectEventDetailSchema,
);
export type PaymentFailedEvent = z.infer<typeof PaymentFailedEventSchema>;



