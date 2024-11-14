import { Dispatch } from 'react';
import { useEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

// TODO: This is stubbed out until we make a real service layer call to fill this in
export const renewalEligibilityDetailsStub: EligibilityDetails = {
  flow: 'Renewal',
  currentScreen: 'Interstitial Screen',
  employmentStatus: 'Employed',
  organisation: 'NHS',
  employer: 'Abbey Hospitals',
  jobTitle: 'Nurse',
  emailVerification: 'test@nhs.com',
  address: {
    line1: 'Charnwood Edge Business Park',
    line2: 'Syston Road',
    city: 'Leicester',
    postcode: 'LE7 4UZ',
  },
};

type WithoutFlow = Omit<EligibilityDetails, 'flow'>;

export function useRenewalEligibilityDetails(
  initialState: WithoutFlow = renewalEligibilityDetailsStub
): [EligibilityDetails, Dispatch<EligibilityDetails>] {
  return useEligibilityDetails({
    ...initialState,
    flow: 'Renewal',
  });
}
