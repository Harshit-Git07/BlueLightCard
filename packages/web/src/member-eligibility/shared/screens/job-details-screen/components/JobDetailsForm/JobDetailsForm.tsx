import React, { FC } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { SelfEmployedJobDetails } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/self-employed-job-details/SelfEmployedJobDetails';
import { NormalJobDetails } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/normal-job-details/NormalJobDetails';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const JobDetailsForm: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const isAus = useIsAusBrand();
  const isHealthcareAlliedHealth =
    isAus && eligibilityDetails.organisation?.label === 'Healthcare Allied Health';

  if (isHealthcareAlliedHealth) {
    return <SelfEmployedJobDetails eligibilityDetailsState={eligibilityDetailsState} />;
  }

  return <NormalJobDetails eligibilityDetailsState={eligibilityDetailsState} />;
};
