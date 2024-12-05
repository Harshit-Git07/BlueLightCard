import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useMemo } from 'react';

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
            currentScreen: 'Success Screen',
          });
        },
        text: 'Finish!',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);
}
