import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';
import { DocumentUploadLocation } from '@blc-mono/shared/models/members/documentUpload';

export async function uploadFileToServiceLayer(
  eligibilityDetails: EligibilityDetails,
  file: File
): Promise<string> {
  const result = await getDocumentToUploadDetails(eligibilityDetails);

  await uploadFileTo(result.preSignedUrl, file);
  return result.documentId;
}

async function getDocumentToUploadDetails(
  eligibilityDetails: EligibilityDetails
): Promise<DocumentUploadLocation> {
  if (!eligibilityDetails.member?.id) {
    throw new Error('No member id available so cannot get presigned url to upload file to');
  }
  if (!eligibilityDetails.member?.application?.id) {
    throw new Error('No application id available so cannot get presigned url to upload file to');
  }

  const result: DocumentUploadLocation = await fetchWithAuth(
    `${serviceLayerUrl}/members/${eligibilityDetails.member?.id}/applications/${eligibilityDetails.member.application.id}/uploadDocument`,
    {
      method: 'POST',
    }
  );
  if (!result) {
    throw new Error('Failed to upload file');
  }

  return result;
}

async function uploadFileTo(presignedUrl: string, file: File): Promise<void> {
  const result = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
  });

  if (!result.ok) {
    console.error('Failed to upload file to pre-signed url for unknown reason', result.body);
    throw new Error('Failed to upload file to pre-signed url for unknown reason');
  }
}
