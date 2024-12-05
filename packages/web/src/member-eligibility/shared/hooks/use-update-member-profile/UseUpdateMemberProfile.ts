import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { updateServiceLayerApplication } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/UpdateServiceLayerApplication';
import { createServiceLayerApplication } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/CreateServiceLayerApplication';
import { updateServiceLayerProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/UpdateServiceLayerProfile';

type Callback = () => Promise<void>;

export function useUpdateMemberProfile(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetails] = eligibilityDetailsState;

  return useCallback(async () => {
    try {
      if (!eligibilityDetails.member?.id) {
        console.error('Cannot update member application as cannot find member id on state');
        return;
      }

      const applicationId = await getApplicationId(eligibilityDetails);
      if (!applicationId) {
        console.error('Cannot update member application as could not get latest application id');
        return;
      }

      await updateServiceLayerApplication(applicationId, eligibilityDetails);
      await updateServiceLayerProfile(eligibilityDetails);
    } catch (error) {
      console.error('Failed to update member application', error);
    }
  }, [eligibilityDetails]);
}

async function getApplicationId(
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  if (eligibilityDetails.member?.application?.id) return eligibilityDetails.member.application.id;

  return await createServiceLayerApplication(eligibilityDetails);
}
