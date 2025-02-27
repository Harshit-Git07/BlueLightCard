import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { updateServiceLayerApplication } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/UpdateServiceLayerApplication';
import { updateServiceLayerProfile } from '@/root/src/member-eligibility/shared/hooks/use-update-member-profile/service-layer/UpdateServiceLayerProfile';
import { mapToEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/MapToEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useGetMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-member-profile/UseGetMemberProfile';

type Callback = (eligibilityDetailsOverrides?: EligibilityDetails) => Promise<void>;

export function useUpdateMemberProfile(eligibilityDetailsState: EligibilityDetailsState): Callback {
  const [eligibilityDetailsFromState, setEligibilityDetails] = eligibilityDetailsState;

  const getMemberProfile = useGetMemberProfile();

  return useCallback(
    async (eligibilityDetailsOverrides) => {
      try {
        const eligibilityDetails = eligibilityDetailsOverrides ?? eligibilityDetailsFromState;

        if (!eligibilityDetails.member?.id) {
          console.error('Cannot update member application as cannot find member id on state');
          return;
        }

        const applicationId = eligibilityDetails.member.application?.id;
        if (!applicationId) {
          console.error('Cannot update member application as could not get latest application id');
          return;
        }

        // Need to update the profile first as service layer expects the org / employer to be on the profile for trusted domain checks
        await updateServiceLayerProfile(eligibilityDetails);
        await updateServiceLayerApplication(applicationId, eligibilityDetails);

        const updatedProfile = await getMemberProfile();
        if (!updatedProfile) return;

        setEligibilityDetails({
          ...eligibilityDetails,
          ...(await mapToEligibilityDetails(updatedProfile)),
        });
      } catch (error) {
        console.error('Failed to update member application', error);

        if (eligibilityDetailsOverrides) {
          setEligibilityDetails(eligibilityDetailsOverrides);
        }

        throw error;
      }
    },
    [eligibilityDetailsFromState, getMemberProfile, setEligibilityDetails]
  );
}
