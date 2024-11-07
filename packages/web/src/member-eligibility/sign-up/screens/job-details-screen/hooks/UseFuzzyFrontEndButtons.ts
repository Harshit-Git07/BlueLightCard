import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

const promoCodeStub = 'test promo code';

export function useFuzzyFrontendButtons(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Verification Method Screen',
          });
        },
        text: "Can't skip verification",
      },
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Verification Method Screen',
            requireMultipleIds: true,
          });
        },
        text: 'Require multiple IDs',
      },
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Delivery Address Screen',
            promoCode: eligibilityDetails.promoCode ?? promoCodeStub,
            canSkipIdVerification: true,
          });
        },
        text: 'Skip verification',
      },
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Delivery Address Screen',
            promoCode: eligibilityDetails.promoCode ?? promoCodeStub,
            canSkipIdVerification: true,
            canSkipPayment: true,
          });
        },
        text: 'Skip verification and payment',
      },
    ];
  }, [eligibilityDetails, setEligibilityDetailsState]);
}
