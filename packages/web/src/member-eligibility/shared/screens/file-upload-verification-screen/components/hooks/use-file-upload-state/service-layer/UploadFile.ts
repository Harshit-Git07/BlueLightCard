import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { refreshIdTokenIfRequired } from '@/utils/refreshIdTokenIfRequired';

export async function uploadFileToServiceLayer(
  eligibilityDetails: EligibilityDetails,
  file: File
): Promise<void> {
  const presignedUrl = await getPresignedUrl(eligibilityDetails);
  if (!presignedUrl) {
    throw new Error('Failed to upload file to service layer as getting the pre-signed url failed');
  }

  await uploadFileTo(presignedUrl, file);
}

async function getPresignedUrl(
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  if (!eligibilityDetails.member?.id) {
    throw new Error('No member id available so cannot get presigned url to upload file to');
  }
  if (!eligibilityDetails.member?.application?.id) {
    throw new Error('No application id available so cannot get presigned url to upload file to');
  }

  const idToken = await refreshIdTokenIfRequired();
  const result = await fetch(
    `${serviceLayerUrl}/members/${eligibilityDetails.member?.id}/applications/${eligibilityDetails.member.application.id}/uploadDocument`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );

  if (!result.ok || !result.body) {
    console.error('Failed to get pre-signed url for unknown reason', result.body);
    throw new Error('Failed to get pre-signed url for unknown reason');
  }

  return JSON.parse(await result.text()).preSignedUrl;
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
