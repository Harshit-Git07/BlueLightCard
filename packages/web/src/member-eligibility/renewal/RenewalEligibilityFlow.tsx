import React, { FC, useMemo } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useRenewalEligibilityDetails } from '@/root/src/member-eligibility/renewal/hooks/use-renewal-eligibility-details/UseRenewalEligibilityDetails';
import { RenewalInterstitialScreen } from '@/root/src/member-eligibility/renewal/screens/renewal-interstitial-screen/RenewalInterstitialScreen';
import { RenewalAccountDetailsScreen } from './screens/renewal-account-details-screen/RenewalAccountDetailsScreen';
import { EmploymentStatusScreen } from '@/root/src/member-eligibility/shared/screens/employment-status-screen/EmploymentStatusScreen';
import { JobDetailsScreen } from '@/root/src/member-eligibility/shared/screens/job-details-screen/JobDetailsScreen';
import { VerificationMethodScreen } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/VerificationMethodScreen';
import { WorkEmailVerificationScreen } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/WorkEmailVerificationScreen';
import { WorkEmailRetryScreen } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/WorkEmailRetryScreen';
import { FileUploadVerificationScreen } from '@/root/src/member-eligibility/shared/screens/file-upload-verification-screen/FileUploadVerificationScreen';
import { SuccessScreen } from '@/root/src/member-eligibility/shared/screens/success-screen/SuccessScreen';
import { PaymentScreenFuzzyFrontend } from '@/root/src/member-eligibility/shared/screens/payment-screen/PaymentScreenFuzzyFrontend';

interface Props {
  initialState?: EligibilityDetails;
}

export const RenewalEligibilityFlow: FC<Props> = ({ initialState }) => {
  const eligibilityDetailsState = useRenewalEligibilityDetails(initialState);

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
      return <RenewalInterstitialScreen {...props} />;
    case 'Renewal Account Details Screen':
      return <RenewalAccountDetailsScreen {...props} />;
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
    case 'Payment Screen':
      return <PaymentScreenFuzzyFrontend {...props} />;
    case 'Success Screen':
      return <SuccessScreen {...props} />;
    default:
      throw Error(`Unimplemented step ${currentScreen}`);
  }
};
