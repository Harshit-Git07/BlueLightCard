import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { getBrandFromEnv } from '@blc-mono/core/utils/checkBrand';

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
): Promise<APIGatewayProxyResult> {
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
    throw new ValidationError(
      'trusted domain verification id does not match what is stored on the application',
    );
  }

  application.trustedDomainValidated = true;
  await applicationService().updateApplication(memberId, applicationId, application);

  return {
    statusCode: 302,
    headers: {
      Location: returnHomeUrl(),
      'content-type': 'text/html',
    },
    body: '',
  };
}

function returnHomeUrl(): string {
  switch (getBrandFromEnv()) {
    case 'BLC_UK':
      return 'https://www.bluelightcard.co.uk/';
    case 'BLC_AU':
      return 'https://www.bluelightcard.com.au/';
    case 'DDS_UK':
      return 'https://www.defencediscountservice.co.uk/';
  }
}
