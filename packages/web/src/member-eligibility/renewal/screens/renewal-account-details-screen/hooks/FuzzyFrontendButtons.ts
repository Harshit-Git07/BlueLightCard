import { useMemo } from 'react';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import {
  ausAddressStub,
  ukAddressStub,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/testing/AddressStubs';

const stubAddress: EligibilityDetailsAddress =
  BRAND === BRANDS.BLC_AU ? ausAddressStub : ukAddressStub;

export function useFuzzyFrontendButtons(
  eligibilityDetailsState: EligibilityDetailsState
): FuzzyFrontendButtonProps[] {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Job Details Screen',
            address: stubAddress,
          });
        },
        text: 'Go to "Job Details" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);
}
