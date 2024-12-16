import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

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
            currentScreen: 'Renewal Account Details Screen',
          });
        },
        text: 'Full flow',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Employment Status Screen',
          });
        },
        text: 'Skip straight to employment details',
      },
      {
        onClick: () => {
          setEligibilityDetails({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
          });
        },
        text: 'Skip straight to payment',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);
}
