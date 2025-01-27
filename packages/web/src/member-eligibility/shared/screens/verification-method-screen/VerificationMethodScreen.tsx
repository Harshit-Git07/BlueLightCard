import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { ThemeVariant } from '@bluelightcard/shared-ui/index';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/FuzzyFrontendButtons';
import { faCircleBolt } from '@fortawesome/pro-solid-svg-icons';
import {
  defaultScreenTitle,
  verifyEligibilitySubTitle,
} from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { useVerificationMethods } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/use-verification-methods/UseVerificationMethods';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { verificationMethodEvents } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/amplitude-events/VerificationMethodEvents';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import Tag from '@bluelightcard/shared-ui/components/Tag';

export const VerificationMethodScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);
  const { primaryMethod, supportingMethods } = useVerificationMethods(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 2;
      case 'Renewal':
        return 3;
    }
  }, [eligibilityDetails.flow]);

  const onBack = useCallback(() => {
    logAnalyticsEvent(verificationMethodEvents.onClickedBack(eligibilityDetails));
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Job Details Screen',
    });
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

  return (
    <EligibilityScreen data-testid="verification-method-screen">
      <EligibilityBody>
        <EligibilityHeading
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle={verifyEligibilitySubTitle(eligibilityDetails.flow)}
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col gap-[32px]">
          {primaryMethod && (
            <div className="flex flex-col gap-[12px]">
              <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>
                {`Upload your ${primaryMethod.title?.toLowerCase()} and choose one supporting document`}
              </p>

              <ListSelector
                {...primaryMethod}
                showTrailingIcon={false}
                description=""
                tag={<Tag state="Info" infoMessage="Primary document" iconLeft={faCircleBolt} />}
              />
            </div>
          )}

          <div className="flex flex-col gap-[12px]">
            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>
              {primaryMethod ? 'CHOOSE A SUPPORTING DOCUMENT' : 'CHOOSE VERIFICATION METHOD'}
            </p>

            <div className="flex flex-col gap-[16px]">
              {supportingMethods.map((method) => (
                <ListSelector
                  key={method.title}
                  {...method}
                  tag={
                    method.title === 'Work Email' ? (
                      <Tag state="Success" infoMessage="Fast" iconLeft={faCircleBolt} />
                    ) : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <Button
          data-testid="back-button"
          className="w-fit self-start"
          variant={ThemeVariant.Secondary}
          size="Large"
          onClick={onBack}
        >
          Back
        </Button>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontendButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
