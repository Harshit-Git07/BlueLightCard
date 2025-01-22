import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';
import { PromoCodeResponseModel } from '@blc-mono/shared/models/members/promoCodeModel';
import { UpdateApplicationModel } from '@blc-mono/shared/models/members/applicationModel';

type Response = PromoCodeResponseModel;
type Request = UpdateApplicationModel;

export async function applyPromoCode(
  eligibilityDetails: EligibilityDetails
): Promise<Response | undefined> {
  try {
    const memberId = eligibilityDetails.member?.id;
    if (!memberId) {
      console.error('No member id available so cannot validate the promo code');
      return undefined;
    }

    const applicationId = eligibilityDetails.member?.application?.id;
    if (!applicationId) {
      console.error('No application id available so cannot validate the promo code');
      return undefined;
    }

    const request: Request = {
      promoCode: eligibilityDetails.promoCode,
      promoCodeApplied: true,
    };

    return await fetchWithAuth(
      `${serviceLayerUrl}/members/${memberId}/applications/${applicationId}/code/apply`,
      {
        method: 'PUT',
        body: JSON.stringify(request),
      }
    );
  } catch (error) {
    console.error('Failed to validate promo code', error);
    return undefined;
  }
}
