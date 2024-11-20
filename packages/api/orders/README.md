# Orders

This is the service that will be responsible for checkout from web and client. it will accept a list of products, calculate the price and initiate the payment via the payment service.

Currently this is a very thin service with hard coded prices as membership is the only thing we want to take payment for, for now.

The idea is that once we have more requirements around taking payments, we will add that logic in here

## Payment emails

This service listens to payment events found in `packages/api/core/src/schemas/payments.ts` and sends payment successful emails to customers via braze
