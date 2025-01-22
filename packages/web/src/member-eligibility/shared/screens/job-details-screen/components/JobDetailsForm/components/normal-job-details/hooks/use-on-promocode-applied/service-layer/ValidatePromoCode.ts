import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { components } from '@bluelightcard/shared-ui/generated/MembersApi';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';

type Response = components['schemas']['PromoCodeResponseModel'];

export async function validatePromoCode(
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

    const promoCode = eligibilityDetails.promoCode;
    if (!promoCode) {
      console.error('No promo code provided so cannot validate the promo code');
      return undefined;
    }

    return await fetchWithAuth(
      `${serviceLayerUrl}/members/${memberId}/applications/${applicationId}/code/validate/${promoCode}`,
      {
        method: 'POST',
      }
    );
  } catch (error) {
    console.error('Failed to validate promo code', error);
    return undefined;
  }
}
