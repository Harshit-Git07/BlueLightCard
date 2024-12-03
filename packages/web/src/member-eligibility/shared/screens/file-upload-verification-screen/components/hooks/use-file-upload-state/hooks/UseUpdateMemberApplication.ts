import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { createServiceLayerApplication } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/hooks/service-layer/CreateServiceLayerApplication';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import {
  updateServiceLayerApplication,
  UpdateServiceLayerApplicationRequest,
} from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/components/hooks/use-file-upload-state/hooks/service-layer/UpdateServiceLayerApplication';

type Callback = (updates?: UpdateServiceLayerApplicationRequest) => Promise<void>;

// TODO: Need to verify if we even need to do this or if it will be bundled in when an ID is uploaded
export function useUpdateMemberApplication(
  eligibilityDetailsState: EligibilityDetailsState
): Callback {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return useCallback(
    async (updates = {}) => {
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

        await updateServiceLayerApplication(applicationId, eligibilityDetails, updates);
        setEligibilityDetails({
          ...eligibilityDetails,
          member: {
            ...eligibilityDetails.member,
            application: {
              ...eligibilityDetails.member.application,
              id: applicationId,
            },
          },
        });
      } catch (error) {
        console.error('Failed to update member application', error);
      }
    },
    [eligibilityDetails, setEligibilityDetails]
  );
}

async function getApplicationId(
  eligibilityDetails: EligibilityDetails
): Promise<string | undefined> {
  if (eligibilityDetails.member?.application?.id) return eligibilityDetails.member.application.id;

  return await createServiceLayerApplication(eligibilityDetails);
}
