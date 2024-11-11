import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { useCountDownInSeconds } from '@/root/src/member-eligibility/sign-up/screens/work-email-retry-screen/hooks/UseCountDownInSecs';
import { useOnEditEmail } from '@/root/src/member-eligibility/sign-up/screens/work-email-retry-screen/hooks/UseOnEditEmail';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/work-email-retry-screen/hooks/UseFuzzyFrontEndButtons';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

export const WorkEmailRetryScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;
  const { formattedTime, countDownFinished, restartTimer } = useCountDownInSeconds(30);
  const isEmailResendButtonDisabled = !countDownFinished;
  const editEmail = useOnEditEmail(eligibilityDetailsState);

  //TODO These will be replaced by logic from APIs
  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  //TODO This will need to be updated to add with the logic to resend the email via API
  const reSendLink = () => {
    restartTimer();
  };

  return (
    <EligibilityScreen data-testid="work-email-retry-screen">
      <EligibilityBody>
        <EligibilityHeading
          className="gap-[24px]"
          numberOfCompletedSteps={4}
          title="Verify Eligibility"
          subtitle="Provide details about your employment status and job role"
        />
        <p className={`${fonts.body} ${colours.textOnSurface}`}>
          We’ve sent an email to <b>{eligibilityDetails.emailVerification}</b> with a link to
          confirm your eligibility.{' '}
          <button
            className={`${fonts.body} ${colours.textPrimary} underline cursor-pointer bg-transparent border-none`}
            aria-label="Edit email"
            type="button"
            onClick={editEmail}
          >
            Edit Email
          </button>
        </p>

        <p className={`w-full ${fonts.body} ${colours.textOnSurfaceSubtle}`}>
          Didn’t get an email? Please check your junk folder or resend it.
        </p>

        <Button
          className="w-full"
          variant={ThemeVariant.Primary}
          disabled={isEmailResendButtonDisabled}
          size="Large"
          onClick={reSendLink}
        >
          {isEmailResendButtonDisabled ? `Resend link in ${formattedTime}` : 'Resend email'}
        </Button>
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
