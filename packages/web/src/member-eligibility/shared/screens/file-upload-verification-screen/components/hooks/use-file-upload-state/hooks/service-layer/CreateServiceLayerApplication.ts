import { serviceLayerUrl } from '@/root/src/member-eligibility/shared/constants/ServiceLayerUrl';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

interface Request {
  memberId: string;
  eligibilityStatus: string;
  applicationReason: 'SIGNUP' | 'RENEWAL';
}

export async function createServiceLayerApplication(
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  try {
    if (!eligibilityDetails.member?.id) {
      console.error('No member id available so cannot create application');
      return undefined;
    }

    const request: Request = {
      memberId: eligibilityDetails.member.id,
      eligibilityStatus: 'unknown', // TODO: This is defined as a `string` on the OpenAPI spec
      applicationReason: eligibilityDetails.flow === 'Sign Up' ? 'SIGNUP' : 'RENEWAL',
    };
    const result = await fetch(
      `${serviceLayerUrl}/members/${eligibilityDetails.member.id}/applications`,
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!result.ok) {
      console.error('Failed to create member application for unknown reason', result.body);
      return undefined;
    }
  } catch (error) {
    console.error('Failed to create member application', error);
    return undefined;
  }
}
