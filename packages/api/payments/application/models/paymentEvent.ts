import { z } from 'zod';

const paymentIntentEvents = z.object({
  eventId: z.string(),
  type: z.union([z.literal('paymentInitiated'), z.literal('paymentSucceeded'), z.literal('paymentFailed')]),
  currency: z.union([z.literal('gbp'), z.literal('aud')]),
  paymentIntentId: z.string(),
  created: z.number(),
  metadata: z.record(z.string(), z.string()),
  amount: z.number(),
  externalCustomerId: z.string().optional(),
  paymentMethodId: z.string().optional(),
});

const externalCustomerCreated = z.object({
  eventId: z.string(),
  type: z.literal('customerCreated'),
  created: z.number(),
  metadata: z.record(z.string(), z.string()),
  name: z.string(),
  externalCustomerId: z.string(),
  email: z.string().optional(),
});

const paymentEventUnions = z.union([paymentIntentEvents, externalCustomerCreated]);

export type PaymentEvent = z.infer<typeof paymentEventUnions>;
