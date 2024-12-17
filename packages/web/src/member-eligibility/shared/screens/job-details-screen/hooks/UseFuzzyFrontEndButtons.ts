import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { IdRequirementDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

const promoCodeStub = 'test promo code';
const idRequirementsStub: IdRequirementDetails[] = [
  {
    title: 'Work Email',
    description: '',
    guidelines: 'Please provide your work email',
    type: 'email',
    required: false,
  },
  {
    title: 'Payslip',
    description: '',
    guidelines: 'Please upload your payslip',
    type: 'file upload',
    required: false,
  },
  {
    title: 'Work ID Card',
    description: '',
    guidelines: 'Please upload your work ID',
    type: 'file upload',
    required: false,
  },
  {
    title: 'NHS Smart Card',
    description: '',
    guidelines: 'Please upload your NHS Smart Card',
    type: 'file upload',
    required: false,
  },
];

const multiIdRequirementsStub: IdRequirementDetails[] = [
  {
    title: 'Payslip',
    description: '',
    guidelines: 'Please upload your payslip',
    type: 'file upload',
    required: true,
  },
  {
    title: 'Work ID Card',
    description: '',
    guidelines: 'Please upload your work ID',
    type: 'file upload',
    required: false,
  },
  {
    title: 'NHS Smart Card',
    description: '',
    guidelines: 'Please upload your NHS Smart Card',
    type: 'file upload',
    required: false,
  },
];

export function useFuzzyFrontendButtons(eligibilityDetailsState: EligibilityDetailsState) {
  const [eligibilityDetails, setEligibilityDetailsState] = eligibilityDetailsState;

  return useMemo(() => {
    return [
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Verification Method Screen',
            currentIdRequirementDetails: idRequirementsStub,
          });
        },
        text: "Can't skip verification",
      },
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen: 'Verification Method Screen',
            currentIdRequirementDetails: multiIdRequirementsStub,
          });
        },
        text: 'Require multiple IDs',
      },
      {
        onClick: () => {
          setEligibilityDetailsState({
            ...eligibilityDetails,
            currentScreen:
              eligibilityDetails.flow === 'Sign Up' ? 'Delivery Address Screen' : 'Payment Screen',
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
            currentScreen:
              eligibilityDetails.flow === 'Sign Up' ? 'Delivery Address Screen' : 'Success Screen',
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
