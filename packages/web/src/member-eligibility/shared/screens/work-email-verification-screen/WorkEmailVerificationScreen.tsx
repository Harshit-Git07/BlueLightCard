import React, { FC, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { useOnWorkEmailChanged } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/hooks/UseOnWorkEmailChanged';
import { useOnSendVerificationLink } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/hooks/UseOnSendVerificationLink';
import { useOnBack } from '@/root/src/member-eligibility/shared/screens/work-email-verification-screen/hooks/UseOnReturnToVerificationScreen';
import { defaultScreenTitle } from '@/root/src/member-eligibility/shared/constants/TitlesAndSubtitles';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';

export const WorkEmailVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  useLogAnalyticsPageView(eligibilityDetails);

  const [emailThatCausedError, setEmailThatCausedError] = useState<string | undefined>(undefined);

  const onBack = useOnBack(eligibilityDetailsState);
  const onWorkEmailChanged = useOnWorkEmailChanged(eligibilityDetailsState);
  const sendVerificationLink = useOnSendVerificationLink(eligibilityDetailsState);

  const onNext = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (event) => {
      event.preventDefault();

      (async () => {
        try {
          await sendVerificationLink();
          setEmailThatCausedError(undefined);
        } catch (error) {
          console.log(
            `Email address '${eligibilityDetails.emailVerification}' is not a trusted domain`
          );
          setEmailThatCausedError(eligibilityDetails.emailVerification);
        }
      })();
    },
    [eligibilityDetails.emailVerification, sendVerificationLink]
  );

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 3;
      case 'Renewal':
        return 4;
    }
  }, [eligibilityDetails.flow]);

  const canSendVerificationEmail = useMemo(() => {
    const emailVerification = eligibilityDetails.emailVerification;
    if (!emailVerification) return false;

    if (emailThatCausedError === emailVerification) return false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailVerification);
  }, [eligibilityDetails.emailVerification, emailThatCausedError]);

  return (
    <EligibilityScreen data-testid="work-email-verification-screen">
      <EligibilityBody>
        <EligibilityHeading
          title={defaultScreenTitle(eligibilityDetails.flow)}
          subtitle="Enter your work email address to verify your eligibility"
          numberOfCompletedSteps={numberOfCompletedSteps}
        />

        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[12px]">
            <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>VERIFICATION METHOD</p>

            <ListSelector
              data-testid="verification-method"
              title="Work Email"
              state={ListSelectorState.Selected}
              onClick={onBack}
            />
          </div>

          <TextInput
            className="w-full"
            placeholder="Enter work email address"
            onChange={onWorkEmailChanged}
            message={!canSendVerificationEmail ? 'Please enter a valid email address' : undefined}
            isValid={canSendVerificationEmail}
            value={eligibilityDetails?.emailVerification ?? undefined}
          />
        </div>

        <Button
          className="w-full"
          size="Large"
          variant={ThemeVariant.Primary}
          disabled={!canSendVerificationEmail}
          onClick={onNext}
          data-testid="send-verification-link-button"
        >
          Send verification link
        </Button>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
