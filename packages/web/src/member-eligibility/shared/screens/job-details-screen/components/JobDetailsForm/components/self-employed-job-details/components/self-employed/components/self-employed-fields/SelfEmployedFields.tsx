import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useOnEmployerChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/self-employed-job-details/components/self-employed/components/self-employed-fields/hooks/UseOnEmployerChange';
import { useOnAbnChange } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/self-employed-job-details/components/self-employed/components/self-employed-fields/hooks/UseOnAbnChange';
import { useJobTitleField } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/shared/hooks/UseJobTitleField';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SelfEmployedFields: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const onEmployerChange = useOnEmployerChange(eligibilityDetailsState);

  const onAbnChange = useOnAbnChange(eligibilityDetailsState);

  const { onJobTitleFieldChanged, isValidJobTitle } = useJobTitleField(eligibilityDetailsState);

  if (eligibilityDetails.jobDetailsAus?.isSelfEmployed === undefined) {
    return null;
  }

  if (eligibilityDetails.jobDetailsAus?.isSelfEmployed) {
    return (
      <div className="flex flex-col w-full gap-[16px]">
        <TextInput
          data-testid="abn-input"
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
        data-testid="employer-input"
        placeholder="Employer"
        onChange={onEmployerChange}
        value={eligibilityDetails.jobDetailsAus?.employerAus}
      />

      <TextInput
        data-testid="job-title"
        placeholder="Enter job title"
        onChange={onJobTitleFieldChanged}
        value={eligibilityDetails.jobTitle}
        message={!isValidJobTitle ? 'Please enter a valid job title' : undefined}
        isValid={isValidJobTitle}
      />
    </div>
  );
};
