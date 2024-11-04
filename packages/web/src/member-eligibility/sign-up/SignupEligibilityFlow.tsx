import React, { FC, useMemo } from 'react';
import { JobDetailsScreen } from '@/root/src/member-eligibility/sign-up/screens/job-details-screen/JobDetailsScreen';
import { EmploymentStatusScreen } from '@/root/src/member-eligibility/sign-up/screens/employment-status-screen/EmploymentStatusScreen';
import { WorkEmailVerificationScreen } from '@/root/src/member-eligibility/sign-up/screens/work-email-verification-screen/WorkEmailVerificationScreen';
import { WorkEmailRetryScreen } from '@/root/src/member-eligibility/sign-up/screens/work-email-retry-screen/WorkEmailRetryScreen';
import { FileUploadVerificationScreen } from '@/root/src/member-eligibility/sign-up/screens/file-upload-verification-screen/FileUploadVerificationScreen';
import { SuccessScreen } from '@/root/src/member-eligibility/sign-up/screens/success-screen/SuccessScreen';
import { PaymentScreen } from '@/root/src/member-eligibility/sign-up/screens/payment-screen/PaymentScreen';
import { EligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';
import { useEligibilityDetails } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/UseEligibilityDetails';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { VerificationMethodScreen } from '@/root/src/member-eligibility/sign-up/screens/verification-method-screen/VerificationMethodScreen';
import { DeliveryAddressScreen } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/DeliveryAddressScreen';
import { InterstitialScreen } from './screens/intersitial-screen/InterstitialScreen';

interface Props {
  initialState?: EligibilityDetails;
}

export const SignupEligibilityFlow: FC<Props> = ({ initialState }) => {
  const eligibilityDetailsState = useEligibilityDetails(initialState);

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
      return <InterstitialScreen {...props} />;
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
      return <SuccessScreen {...props} />;
    default:
      throw Error(`Unimplemented step ${currentScreen}`);
  }
};
