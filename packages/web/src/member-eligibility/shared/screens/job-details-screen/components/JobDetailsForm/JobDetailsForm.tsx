import React, { FC } from 'react';
import { NormalJobDetails } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/NormalJobDetails/NormalJobDetails';
import { SelfEmployedJobDetails } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/SelfEmployedJobDetails/SelfEmployedJobDetails';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  isNextButtonDisabled: boolean;
}

export const JobDetailsForm: FC<Props> = ({ eligibilityDetailsState, isNextButtonDisabled }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const isAus = useIsAusBrand();
  const isHealthcareAlliedHealth =
    isAus && eligibilityDetails.organisation?.label === 'Healthcare Allied Health';

  if (isHealthcareAlliedHealth) {
    return <SelfEmployedJobDetails eligibilityDetailsState={eligibilityDetailsState} />;
  }

  return (
    <NormalJobDetails
      eligibilityDetailsState={eligibilityDetailsState}
      isNextButtonDisabled={isNextButtonDisabled}
    />
  );
};
