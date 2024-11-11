import React, { FC, useCallback } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EmploymentStatus } from '@/root/src/member-eligibility/sign-up/hooks/use-eligibility-details/types/EligibilityDetails';

export const EmploymentStatusScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const onEmploymentStatusSelect = useCallback(
    (employmentStatus: EmploymentStatus) => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
        employmentStatus,
      });
    },
    [eligibilityDetails, setEligibilityDetails]
  );

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Interstitial Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody className="gap-[24px]">
        <EligibilityHeading
          title="Verify Eligibility"
          subtitle="Provide details about your employment status and job role"
          numberOfCompletedSteps={0}
        />

        <div className="flex flex-col gap-[16px] w-full">
          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>EMPLOYMENT STATUS</p>

          <ListSelector title="Employed" onClick={() => onEmploymentStatusSelect('Employed')} />

          <ListSelector title="Retired" onClick={() => onEmploymentStatusSelect('Retired')} />

          <ListSelector title="Volunteer" onClick={() => onEmploymentStatusSelect('Volunteer')} />
        </div>

        <Button
          className="w-fit self-start"
          variant={ThemeVariant.Secondary}
          size="Large"
          onClick={onBack}
        >
          Back
        </Button>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
