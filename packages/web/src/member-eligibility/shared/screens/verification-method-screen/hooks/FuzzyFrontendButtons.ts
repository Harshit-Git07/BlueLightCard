import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

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
          });
        },
        text: 'Back',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetails]);
}
