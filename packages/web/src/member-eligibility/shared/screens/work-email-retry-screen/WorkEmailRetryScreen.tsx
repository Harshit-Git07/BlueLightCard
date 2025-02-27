import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useCountDownInSeconds } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/hooks/useCountDownInSeconds';
import { useFuzzyFrontendButtons } from './hooks/UseFuzzyFrontEndButtons';
import { useOnEditEmail } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/hooks/UseOnEditEmail';
import { defaultScreenTitle } from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { workEmailRetryEvents } from '@/root/src/member-eligibility/shared/screens/work-email-retry-screen/amplitude-events/WorkEmailRetryEvents';
import { fetchWithAuth } from '@/root/src/member-eligibility/shared/utils/FetchWithAuth';
import { serviceLayerUrl } from '@/root/src/member-eligibility/constants/ServiceLayerUrl';

export const WorkEmailRetryScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const { formattedTime, countDownFinished, restartTimer } = useCountDownInSeconds(30);
  const editEmail = useOnEditEmail(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 4;
      case 'Renewal':
        return 5;
    }
  }, [eligibilityDetails.flow]);

  const resendVerificationEmail = useCallback(async () => {
    logAnalyticsEvent(workEmailRetryEvents.onResendClicked(eligibilityDetails));

    await fetchWithAuth(
      `${serviceLayerUrl}/members/${eligibilityDetails.member?.id}/applications/${eligibilityDetails.member?.application?.id}/resendTrustedDomainEmail`,
      {
        method: 'POST',
      }
    );

    restartTimer();
  }, [eligibilityDetails, logAnalyticsEvent, restartTimer]);

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  const isEmailResendButtonDisabled = !countDownFinished;

  return (
    <EligibilityScreen data-testid="work-email-retry-screen">
      <EligibilityBody>
        <EligibilityHeading
          className="gap-[24px]"
          numberOfCompletedSteps={numberOfCompletedSteps}
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle="Enter your work email address to verify your eligibility"
        />

        <p className={`${fonts.body} ${colours.textOnSurface}`}>
          We’ve sent an email to <b>{eligibilityDetails.emailVerification}</b> with a link to
          confirm your eligibility.{' '}
          <button
            data-testid="edit-email-button"
            className={`${fonts.body} ${colours.textPrimary} underline cursor-pointer bg-transparent border-none`}
            aria-label="Edit email"
            type="button"
            onClick={editEmail}
          >
            Edit Email
          </button>
        </p>

        <p className={`${fonts.body} ${colours.textOnSurfaceSubtle} w-full`}>
          Didn’t get an email? Please check your junk folder or resend it.
        </p>

        <Button
          className="w-full"
          size="Large"
          variant={ThemeVariant.Primary}
          disabled={isEmailResendButtonDisabled}
          onClick={resendVerificationEmail}
        >
          {isEmailResendButtonDisabled ? `Resend link in ${formattedTime}` : 'Resend email'}
        </Button>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
