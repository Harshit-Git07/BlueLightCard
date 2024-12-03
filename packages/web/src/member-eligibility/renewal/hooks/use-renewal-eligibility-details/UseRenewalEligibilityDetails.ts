import { Dispatch } from 'react';
import { useEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import {
  EligibilityDetails,
  EligibilityDetailsWithoutFlow,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

// TODO: This is stubbed out until we make a real service layer call to fill this in
export const renewalEligibilityDetailsStub: EligibilityDetails = {
  flow: 'Renewal',
  currentScreen: 'Interstitial Screen',
  employmentStatus: 'Employed',
  organisation: {
    id: 'eadc26a7-e2cf-4f5a-92ba-a298f15d396c',
    label: 'NHS',
  },
  employer: {
    id: '004d4e03-4843-4b9b-96fd-a86a859870bd',
    label: 'Bedford Hospital NHS Trust',
  },
  jobTitle: 'Nurse',
  member: {
    firstName: 'John',
    surname: 'Doe',
    dob: new Date('1980-01-01'),
  },
};

export function useRenewalEligibilityDetails(
  initialState: EligibilityDetailsWithoutFlow = renewalEligibilityDetailsStub
): [EligibilityDetails, Dispatch<EligibilityDetails>] {
  return useEligibilityDetails({
    ...initialState,
    flow: 'Renewal',
  });
}
