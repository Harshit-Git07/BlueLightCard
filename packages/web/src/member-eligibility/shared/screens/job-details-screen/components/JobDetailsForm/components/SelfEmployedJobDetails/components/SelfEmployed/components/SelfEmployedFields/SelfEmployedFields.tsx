import React, { ChangeEventHandler, FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useOnEmployerChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/SelfEmployedJobDetails/components/SelfEmployed/components/SelfEmployedFields/hooks/UseOnEmployerChange';
import { useOnAbnChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/SelfEmployedJobDetails/components/SelfEmployed/components/SelfEmployedFields/hooks/UseOnAbnChange';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  onJobTitleChange: ChangeEventHandler<HTMLInputElement>;
}

export const SelfEmployedFields: FC<Props> = ({ eligibilityDetailsState, onJobTitleChange }) => {
  const [eligibilityDetails] = eligibilityDetailsState;
  const onEmployerChange = useOnEmployerChange(eligibilityDetailsState);
  const onAbnChange = useOnAbnChange(eligibilityDetailsState);

  if (eligibilityDetails.jobDetailsAus?.isSelfEmployed === undefined) {
    return null;
  }

  if (eligibilityDetails.jobDetailsAus?.isSelfEmployed) {
    return (
      <div className="flex flex-col w-full gap-[16px]">
        <TextInput
          placeholder="ABN"
          onChange={onAbnChange}
          value={eligibilityDetails.jobDetailsAus?.australianBusinessNumber}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full gap-[16px]">
      <TextInput
        placeholder="Employer"
        onChange={onEmployerChange}
        value={eligibilityDetails.jobDetailsAus?.employerAus}
      />

      <TextInput
        placeholder="Job title"
        onChange={onJobTitleChange}
        value={eligibilityDetails.jobTitle}
      />
    </div>
  );
};
