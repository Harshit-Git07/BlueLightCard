import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import {
  ausAddressStub,
  ukAddressStub,
} from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/utils/AddressTestUtils';

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
