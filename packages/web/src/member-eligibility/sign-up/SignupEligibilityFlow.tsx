import React, { FC, useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { DeliveryAddressScreen } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/DeliveryAddressScreen';
import { SignupInterstitialScreen } from '@/root/src/member-eligibility/sign-up/screens/signup-interstitial-screen/SignupInterstitialScreen';
import { EmploymentStatusScreen } from '@/root/src/member-eligibility/shared/screens/employment-status-screen/EmploymentStatusScreen';
import { JobDetailsScreen } from '@/root/src/member-eligibility/shared/screens/job-details-screen/JobDetailsScreen';
import { VerificationMethodScreen } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/VerificationMethodScreen';
import { WorkEmailVerificationScreen } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/WorkEmailVerificationScreen';
import { WorkEmailRetryScreen } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/WorkEmailRetryScreen';
import { FileUploadVerificationScreen } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/FileUploadVerificationScreen';
import { SuccessScreen } from '@/root/src/member-eligibility/shared/screens/success-screen/SuccessScreen';
import { useSignupEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-signup-eligibility-details/UseSignupEligibilityDetails';
import { PaymentScreen } from '@/root/src/member-eligibility/shared/screens/payment-screen/PaymentScreen';

interface Props {
  initialState?: EligibilityDetails;
}

export const SignupEligibilityFlow: FC<Props> = ({ initialState }) => {
  const eligibilityDetailsState = useSignupEligibilityDetails(initialState);

  const currentScreen = useMemo(() => {
    const [eligibilityDetails] = eligibilityDetailsState;

    return eligibilityDetails.currentScreen;
  }, [eligibilityDetailsState]);

  const props: VerifyEligibilityScreenProps = useMemo(() => {
    return {
      eligibilityDetailsState: eligibilityDetailsState,
    };
  }, [eligibilityDetailsState]);

  switch (currentScreen) {
    case 'Interstitial Screen':
      return <SignupInterstitialScreen {...props} />;
    case 'Employment Status Screen':
      return <EmploymentStatusScreen {...props} />;
    case 'Job Details Screen':
      return <JobDetailsScreen {...props} />;
    case 'Verification Method Screen':
      return <VerificationMethodScreen {...props} />;
    case 'Work Email Verification Screen':
      return <WorkEmailVerificationScreen {...props} />;
    case 'Work Email Retry Screen':
      return <WorkEmailRetryScreen {...props} />;
    case 'File Upload Verification Screen':
      return <FileUploadVerificationScreen {...props} />;
    case 'Delivery Address Screen':
      return <DeliveryAddressScreen {...props} />;
    case 'Payment Screen':
      return <PaymentScreen {...props} />;
    case 'Success Screen':
      return <SuccessScreen initialState={eligibilityDetailsState[0]} />;
    default:
      throw Error(`Unimplemented step ${currentScreen}`);
  }
};
