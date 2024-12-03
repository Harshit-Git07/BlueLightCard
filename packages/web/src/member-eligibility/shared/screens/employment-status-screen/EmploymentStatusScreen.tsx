import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EmploymentStatus } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import {
  employmentDetailsSubTitle,
  defaultScreenTitle,
} from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { employmentStatusEvents } from '@/root/src/member-eligibility/shared/screens/employment-status-screen/amplitude-events/EmploymentStatusEvents';

export const EmploymentStatusScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

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
      if (eligibilityDetails.employmentStatus !== employmentStatus) {
        eligibilityDetails.organisation = undefined;
        eligibilityDetails.employer = undefined;
        eligibilityDetails.jobTitle = undefined;
      }

      logAnalyticsEvent(employmentStatusEvents.onForwardClicked(eligibilityDetails));

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Job Details Screen',
        employmentStatus,
      });
    },
    [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]
  );

  const onBack = useCallback(() => {
    logAnalyticsEvent(employmentStatusEvents.onBackClicked(eligibilityDetails));
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
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody>
        <EligibilityHeading
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle={employmentDetailsSubTitle(eligibilityDetails.flow)}
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col gap-[16px] w-full">
          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>EMPLOYMENT STATUS</p>

          <ListSelector title="Employed" onClick={() => onEmploymentStatusSelect('Employed')} />

          <ListSelector
            title="Retired or Bereaved"
            onClick={() => onEmploymentStatusSelect('Retired or Bereaved')}
          />

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
