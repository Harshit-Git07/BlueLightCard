import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EmploymentStatus } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/components/EligibilityHeading';

export const EmploymentStatusScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 0;
      case 'Renewal':
        return 1;
    }
  }, [eligibilityDetails.flow]);

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
    if (eligibilityDetails.flow === 'Sign Up') {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Interstitial Screen',
      });
      return;
    }

    if (eligibilityDetails.skipAccountDetails) {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Interstitial Screen',
      });
      return;
    }

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Renewal Account Details Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody className="gap-[24px]">
        <EligibilityHeading
          title="Verify Eligibility"
          subtitle="Provide details about your employment status and job role"
          numberOfCompletedSteps={numberOfCompletedSteps}
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
