import { useMemo } from 'react';
import { BRAND } from '@/global-vars';
import { BRANDS } from '@/types/brands.enum';
import { EligibilityDetailsAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import {
  ausAddressStub,
  ukAddressStub,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/testing/AddressStubs';

const stubAddress: EligibilityDetailsAddress =
  BRAND === BRANDS.BLC_AU ? ausAddressStub : ukAddressStub;

export function useFuzzyFrontendButtons(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo<FuzzyFrontendButtonProps[]>(() => {
    if (eligibilityDetails.canSkipPayment) {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Success Screen',
              address: stubAddress,
            });
          },
          text: 'Go to "Success" screen',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
            address: stubAddress,
          });
        },
        text: 'Go to "Payment" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
