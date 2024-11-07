import React, { FC, useCallback } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';

export const EmploymentStatusScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const onEmploymentStatusSelect = useCallback(
    (employmentStatus: string) => {
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
      <EligibilityBody className="px-[18px]">
        <div className="flex flex-col gap-6">
          <EligibilityHeading
            title={'Verify Eligibility'}
            subtitle={'Provide details about your employment status and job role'}
            numberOfCompletedSteps={0}
          />

          <div className="flex flex-col gap-4">
            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>EMPLOYMENT STATUS</p>

            <ListSelector title="Employed" onClick={() => onEmploymentStatusSelect('Employed')} />
            <ListSelector title="Retired" onClick={() => onEmploymentStatusSelect('Retired')} />
            <ListSelector title="Volunteer" onClick={() => onEmploymentStatusSelect('Volunteer')} />
          </div>
          <div>
            <Button variant={ThemeVariant.Secondary} className="max-h-10" onClick={onBack}>
              Back
            </Button>
          </div>
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};

export default EmploymentStatusScreen;
