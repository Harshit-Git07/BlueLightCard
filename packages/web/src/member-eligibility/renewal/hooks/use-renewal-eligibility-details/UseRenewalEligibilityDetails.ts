import {
  EligibilityDetailsState,
  useEligibilityDetails,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
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
    id: '43a3ef4f-3c18-41a5-8d0f-8343eca9b6f5',
    label: 'Police',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
  employer: {
    id: '06cfa39f-e87d-463a-a954-ef1e3f5f176d',
    label: 'The Port of Tilbury',
    requiresJobTitle: true,
    requiresJobReference: false,
  },
  jobTitle: 'Officer',
  member: {
    firstName: 'John',
    surname: 'Doe',
    dob: new Date('1980-01-01'),
  },
};

export function useRenewalEligibilityDetails(
  initialState: EligibilityDetailsWithoutFlow = renewalEligibilityDetailsStub
): EligibilityDetailsState {
  return useEligibilityDetails({
    ...initialState,
    flow: 'Renewal',
  });
}
