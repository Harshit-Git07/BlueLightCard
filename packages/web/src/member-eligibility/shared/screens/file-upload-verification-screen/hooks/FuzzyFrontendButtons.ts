import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { FuzzyFrontendButtonProps } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { UploadedDocuments } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function useFuzzyFrontendButtons(
  eligibilityDetailsState: EligibilityDetailsState
): FuzzyFrontendButtonProps[] {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  const uploadedDocuments: UploadedDocuments = [
    { documentId: 'documentId-1', fileName: 'fileName-1' },
  ];

  return useMemo(() => {
    if (eligibilityDetails.flow === 'Sign Up') {
      return [
        {
          onClick: () => {
            setEligibilityDetailsState({
              ...eligibilityDetails,
              currentScreen: 'Delivery Address Screen',
              fileVerification: uploadedDocuments,
            });
          },
          text: 'Go to "Delivery Address" screen',
        },
      ];
    }

    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Payment Screen',
            fileVerification: uploadedDocuments,
          });
        },
        text: 'Go to "Payment" screen',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState, uploadedDocuments]);
}
