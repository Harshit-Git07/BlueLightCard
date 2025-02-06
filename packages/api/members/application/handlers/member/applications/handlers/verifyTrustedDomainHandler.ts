import { APIGatewayProxyEvent, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { isBlcUkBrand, isDdsUkBrand } from '@blc-mono/core/utils/checkBrand';

export function isVerifyTrustedDomainHandlerEvent(event: APIGatewayProxyEvent): boolean {
  if (
    !event.pathParameters?.memberId ||
    !event.pathParameters.applicationId ||
    !event.pathParameters.trustedDomainVerificationUid
  )
    return false;
  if (event.httpMethod !== 'GET') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/verifyTrustedDomain/${event.pathParameters.trustedDomainVerificationUid}`
  );
}

export async function verifyTrustedDomainHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyStructuredResultV2> {
  const { memberId, applicationId, trustedDomainVerificationUid } = event.pathParameters || {};

  if (!memberId || !applicationId || !trustedDomainVerificationUid) {
    throw new ValidationError(
      'Member ID, Application ID and TrustedDomainVerificationUid are required',
    );
  }

  const application = await applicationService().getApplication(memberId, applicationId);

  if (!application) {
    throw new ValidationError('Application not found');
  }

  if (
    !application.trustedDomainVerificationUid ||
    application.trustedDomainVerificationUid !== trustedDomainVerificationUid
  ) {
    throw new ValidationError('trustedDomainVerifiedUid does not match the application');
  }

  application.trustedDomainValidated = true;
  await applicationService().updateApplication(memberId, applicationId, application);

  return {
    statusCode: 302,
    headers: {
      Location: returnHomeUrl(),
      'content-type': 'text/html',
    },
  };
}

function returnHomeUrl(): string {
  if (isBlcUkBrand()) {
    return 'https://www.bluelightcard.co.uk/';
  }
  if (isDdsUkBrand()) {
    return 'https://www.defencediscountservice.co.uk/';
  }
  return 'https://www.bluelightcard.com.au/';
}
