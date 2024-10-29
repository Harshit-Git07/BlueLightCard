# Payments

This service manages payments and exposes a number of endpoints intended to be used by other services only (no front end clients).

It uses Stripe as the payment provider

It uses IAM to protect the rest endpoints so the caller needs `execute-api:Invoke` permisson and needs to sign the request in order to call payment endpoints

## Database

The database is an eventstore built on DynamoDb, it stores all payment events keyed by by a composite key containing `memberId` and `eventType#eventId`.

There is also a secondary index which is made up of `eventType` and `objectId` (object id being the id of the Stripe entity such a Payment Intent)

This means that the following access patterns are supported:

- Get all payments for a member
- Get all payment events by a specific event type for a member
- Get a spefific payment event for a member
- Get all payment events by a specific event type and object Id

### Stripe Integration

We are using Stripe's Eventbridge integration to receive Stripe events into the system directly onto EventBridge.

There is an event bus for each Stripe account (BLC UK, BLC Australia and Defence Discount Service). You can find the mapping in `packages/api/payments/infrastructure/config/config.ts`

for reference https://docs.stripe.com/event-destinations/eventbridge
