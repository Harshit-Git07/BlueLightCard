import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/handlers/shared/middleware/middleware';
import {
  initiatePaymentHandler,
  isInitiatePaymentEvent,
} from '@blc-mono/members/application/handlers/admin/payment/handlers/initiatePaymentHandler';
import {
  completePaymentHandler,
  isCompletePaymentEvent,
} from '@blc-mono/members/application/handlers/admin/payment/handlers/completePaymentHandler';
import {
  isRefundPaymentEvent,
  refundPaymentHandler,
} from '@blc-mono/members/application/handlers/admin/payment/handlers/refundPaymentHandler';
import {
  isPaymentHistoryEvent,
  paymentHistoryHandler,
} from '@blc-mono/members/application/handlers/admin/payment/handlers/paymentHistoryHandler';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isInitiatePaymentEvent(event)) {
    return initiatePaymentHandler(event);
  }

  if (isCompletePaymentEvent(event)) {
    return completePaymentHandler(event);
  }

  if (isRefundPaymentEvent(event)) {
    return refundPaymentHandler(event);
  }

  if (isPaymentHistoryEvent(event)) {
    return paymentHistoryHandler(event);
  }
};

export const handler = middleware(unwrappedHandler);
