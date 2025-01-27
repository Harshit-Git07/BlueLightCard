import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

type Request = UpdateApplicationModel;

export async function updateServiceLayerApplication(
  applicationId: string,
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  try {
    if (!eligibilityDetails.member?.id) {
      console.error('No member id available so cannot update application');
      return undefined;
    }

    const request: Request = {
      promoCode: eligibilityDetails.promoCode,
      verificationMethod: undefined, // TODO: This is defined as a string in the OpenAPI spec
      address1: eligibilityDetails.address?.line1,
      address2: eligibilityDetails.address?.line2,
      city: eligibilityDetails.address?.city,
      postcode: eligibilityDetails.address?.postcode,
      trustedDomainEmail: eligibilityDetails.emailVerification,
      documents: eligibilityDetails.fileVerification?.map((file) => file.documentId),
    };

    return await fetchWithAuth(
      `${serviceLayerUrl}/members/${eligibilityDetails.member.id}/applications/${applicationId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    console.error('Failed to create member application', error);
    return undefined;
  }
}
