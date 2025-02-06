import { APIGatewayProxyEvent } from 'aws-lambda';
import { middleware } from '@blc-mono/members/application/middleware';
import {
  applyPromoCodeHandler,
  isApplyPromoCodeEvent,
} from '@blc-mono/members/application/handlers/member/applications/handlers/applyPromoCodeHandler';
import {
  createApplicationHandler,
  isCreateApplicationEvent,
} from '@blc-mono/members/application/handlers/member/applications/handlers/createApplicationHandler';
import {
  getApplicationHandler,
  isGetApplicationEvent,
} from '@blc-mono/members/application/handlers/member/applications/handlers/getApplicationHandler';
import {
  getApplicationsHandler,
  isGetApplicationsEvent,
} from '@blc-mono/members/application/handlers/member/applications/handlers/getApplicationsHandler';
import {
  isUpdateApplicationEvent,
  updateApplicationHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/updateApplicationHandler';
import {
  isUploadDocumentEvent,
  uploadDocumentHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/uploadDocumentHandler';
import {
  isValidatePromoCodeEvent,
  validatePromoCodeHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/validatePromoCodeHandler';
import {
  isPaymentConfirmedHandler,
  paymentConfirmedHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/paymentConfirmedHandler';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import {
  isResendTrustedDomainEmailEvent,
  resendTrustedDomainEmailHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/resendTrustedDomainEmailHandler';
import {
  isVerifyTrustedDomainHandlerEvent,
  verifyTrustedDomainHandler,
} from '@blc-mono/members/application/handlers/member/applications/handlers/verifyTrustedDomainHandler';

const unwrappedHandler = async (event: APIGatewayProxyEvent): Promise<unknown> => {
  if (isApplyPromoCodeEvent(event)) {
    return await applyPromoCodeHandler(event);
  }

  if (isCreateApplicationEvent(event)) {
    return await createApplicationHandler(event);
  }

  if (isGetApplicationEvent(event)) {
    return await getApplicationHandler(event);
  }

  if (isGetApplicationsEvent(event)) {
    return await getApplicationsHandler(event);
  }

  if (isPaymentConfirmedHandler(event)) {
    return await paymentConfirmedHandler(event);
  }

  if (isUpdateApplicationEvent(event)) {
    return await updateApplicationHandler(event);
  }

  if (isUploadDocumentEvent(event)) {
    return await uploadDocumentHandler(event);
  }

  if (isValidatePromoCodeEvent(event)) {
    return await validatePromoCodeHandler(event);
  }

  if (isResendTrustedDomainEmailEvent(event)) {
    return await resendTrustedDomainEmailHandler(event);
  }

  if (isVerifyTrustedDomainHandlerEvent(event)) {
    return await verifyTrustedDomainHandler(event);
  }

  throw new ValidationError('Invalid route or event');
};

export const handler = middleware(unwrappedHandler);
