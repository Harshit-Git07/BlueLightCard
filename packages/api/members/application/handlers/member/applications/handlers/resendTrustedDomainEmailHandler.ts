import { APIGatewayProxyEvent } from 'aws-lambda';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { profileService } from '@blc-mono/members/application/services/profileService';
import { EmailService } from '@blc-mono/members/application/services/email/emailService';

const service = new EmailService();

export function isResendTrustedDomainEmailEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'POST') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/resendTrustedDomainEmail`
  );
}

export async function resendTrustedDomainEmailHandler(event: APIGatewayProxyEvent): Promise<void> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  const application = await applicationService().getApplication(memberId, applicationId);
  if (!application.trustedDomainEmail) {
    throw new ValidationError('Trusted Domain not found - cannot resend email');
  }

  const profile = await profileService().getProfile(memberId);
  const baseUrl = getApiGatewayBaseUrl(event);

  await service.sendTrustedDomainEmail(profile, baseUrl);
}

function getApiGatewayBaseUrl(event: APIGatewayProxyEvent): string {
  const { domainName, stage } = event.requestContext;
  return `https://${domainName}/${stage}`;
}
