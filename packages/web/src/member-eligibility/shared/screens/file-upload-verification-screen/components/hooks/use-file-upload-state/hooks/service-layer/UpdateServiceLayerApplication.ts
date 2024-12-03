import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export interface UpdateServiceLayerApplicationRequest {
  eligibilityStatus?: string;
  promoCode?: Record<string, any>; // TODO: What is this object?
  verificationMethod?: string;
  address1?: string;
  address2?: string;
  country?: string;
  city?: string;
  postcode?: string;
}

export async function updateServiceLayerApplication(
  applicationId: string,
  eligibilityDetails: EligibilityDetails,
  updates: UpdateServiceLayerApplicationRequest
): Promise<string | undefined> {
  try {
    if (!eligibilityDetails.member?.id) {
      console.error('No member id available so cannot update application');
      return undefined;
    }

    const request: UpdateServiceLayerApplicationRequest = {
      eligibilityStatus: 'unknown', // TODO: This is defined as a `string` on the OpenAPI spec
      promoCode: {}, // TODO: This is defined as an object in OpenAPI spec
      verificationMethod: undefined, // TODO: This is defined as a string in the OpenAPI spec
      address1: eligibilityDetails.address?.line1,
      address2: eligibilityDetails.address?.line2,
      city: eligibilityDetails.address?.city,
      postcode: eligibilityDetails.address?.postcode,
      ...updates,
    };
    const result = await fetch(
      `${serviceLayerUrl}/members/${eligibilityDetails.member.id}/applications/${applicationId}`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );

    if (!result.ok) {
      console.error('Failed to update member application for unknown reason', result.body);
      return undefined;
    }
  } catch (error) {
    console.error('Failed to create member application', error);
    return undefined;
  }
}
