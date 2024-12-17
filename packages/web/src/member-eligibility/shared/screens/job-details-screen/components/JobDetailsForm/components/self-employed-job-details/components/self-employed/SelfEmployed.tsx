import React, { FC } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import Checkbox from '@bluelightcard/shared-ui/components/Checkbox';
import { SelfEmployedFields } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/components/self-employed-job-details/components/self-employed/components/self-employed-fields/SelfEmployedFields';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const SelfEmployed: FC<Props> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return (
    <div className="flex flex-col w-full gap-[12px]">
      <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>ARE YOU SELF EMPLOYED?</p>

      <div className="flex w-full gap-[16px]">
        <div className="flex-1">
          <Checkbox
            isDisabled={false}
            checkboxText="Yes"
            variant="withBorder"
            isChecked={eligibilityDetails.jobDetailsAus?.isSelfEmployed}
            onChange={() => {
              setEligibilityDetails({
                ...eligibilityDetails,
                jobTitle: '',
                jobDetailsAus: {
                  isSelfEmployed: true,
                  employerAus: '',
                  australianBusinessNumber: '',
                },
              });
            }}
          />
        </div>

        <div className="flex-1">
          <Checkbox
            isDisabled={false}
            checkboxText="No"
            variant="withBorder"
            isChecked={eligibilityDetails.jobDetailsAus?.isSelfEmployed === false}
            onChange={() => {
              setEligibilityDetails({
                ...eligibilityDetails,
                jobDetailsAus: {
                  isSelfEmployed: false,
                  employerAus: '',
                  australianBusinessNumber: '',
                },
              });
            }}
          />
        </div>
      </div>

      <SelfEmployedFields eligibilityDetailsState={eligibilityDetailsState} />
    </div>
  );
};
