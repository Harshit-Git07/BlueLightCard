import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { updateServiceLayerApplication } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/UpdateServiceLayerApplication';
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

      const applicationId = eligibilityDetails.member.application?.id;
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
