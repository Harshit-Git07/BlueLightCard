import { APIGatewayProxyEvent } from 'aws-lambda';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { applicationService } from '@blc-mono/members/application/services/applicationService';
import { verifyMemberHasAccessToProfile } from '@blc-mono/members/application/handlers/member/memberAuthorization';

export function isUploadDocumentEvent(event: APIGatewayProxyEvent): boolean {
  if (!event.pathParameters?.memberId || !event.pathParameters.applicationId) return false;
  if (event.httpMethod !== 'POST') return false;

  return (
    event.path ===
    `/members/${event.pathParameters.memberId}/applications/${event.pathParameters.applicationId}/uploadDocument`
  );
}

export async function uploadDocumentHandler(
  event: APIGatewayProxyEvent,
): Promise<DocumentUploadLocation> {
  const { memberId, applicationId } = event.pathParameters || {};
  if (!memberId || !applicationId) {
    throw new ValidationError('Member ID and Application ID are required');
  }

  verifyMemberHasAccessToProfile(event, memberId);
  return await applicationService().generateDocumentUploadUrl(memberId, applicationId);
}
