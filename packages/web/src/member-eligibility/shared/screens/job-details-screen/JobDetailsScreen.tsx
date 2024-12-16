import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useIsNextButtonDisabled } from './hooks/UseIsButtonDisabled';
import { useFuzzyFrontendButtons } from './hooks/UseFuzzyFrontEndButtons';
import {
  employmentDetailsSubTitle,
  defaultScreenTitle,
} from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { jobDetailsEvents } from '@/root/src/member-eligibility/shared/screens/job-details-screen/amplitude-events/JobDetailsEvents';
import { useOnNext } from '@/root/src/member-eligibility/shared/screens/job-details-screen/hooks/UseOnNext';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { JobDetailsForm } from '@/root/src/member-eligibility/shared/screens/job-details-screen/components/JobDetailsForm/JobDetailsForm';

export const JobDetailsScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const isNextButtonDisabled = useIsNextButtonDisabled(eligibilityDetails);
  const isRenewalFlow = eligibilityDetails.flow === 'Renewal';

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);
  const onNext = useOnNext(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 1;
      case 'Renewal':
        return 2;
    }
  }, [eligibilityDetails.flow]);

  const onBack = useCallback(() => {
    logAnalyticsEvent(jobDetailsEvents.onBackClicked(eligibilityDetails));

    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Employment Status Screen',
    });
  }, [logAnalyticsEvent, eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen data-testid="job-details-screen">
      <EligibilityBody>
        <EligibilityHeading
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle={employmentDetailsSubTitle(eligibilityDetails.flow)}
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col items-start w-full gap-[12px]">
          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>EMPLOYMENT STATUS</p>

          <div className="flex flex-col gap-[16px] w-full">
            <ListSelector
              data-testid="employment-status"
              title={eligibilityDetails.employmentStatus}
              state={ListSelectorState.Selected}
              onClick={onBack}
            />

            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>JOB DETAILS</p>
          </div>

          <JobDetailsForm
            eligibilityDetailsState={eligibilityDetailsState}
            isNextButtonDisabled={isNextButtonDisabled}
          />
        </div>

        <div className="flex w-full gap-[8px]">
          {isRenewalFlow && (
            <Button
              data-testid="back-button"
              className="w-1/5"
              size="Large"
              variant={ThemeVariant.Secondary}
              onClick={() => {
                logAnalyticsEvent(jobDetailsEvents.onBackClicked(eligibilityDetails));
                setEligibilityDetails({
                  ...eligibilityDetails,
                  currentScreen: 'Renewal Account Details Screen',
                });
              }}
            >
              Back
            </Button>
          )}

          <Button
            data-testid="job-details-next-button"
            className={isRenewalFlow ? 'w-4/5 ml-auto' : 'w-full'}
            size="Large"
            disabled={isNextButtonDisabled}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
