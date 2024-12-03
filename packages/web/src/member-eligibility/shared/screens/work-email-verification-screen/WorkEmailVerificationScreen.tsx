import React, { FC, useMemo } from 'react';
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

  const onBack = useOnBack(eligibilityDetailsState);
  const onWorkEmailChanged = useOnWorkEmailChanged(eligibilityDetailsState);
  const sendVerificationLink = useOnSendVerificationLink(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 3;
      case 'Renewal':
        return 4;
    }
  }, [eligibilityDetails.flow]);

  //TODO: This value of this boolean needs to be set by the logic of the API when verifying the email address - functionality/usage will remain the same
  const canSendVerificationEmail = useMemo(() => {
    const emailVerification = eligibilityDetails.emailVerification;
    if (!emailVerification) return false;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailVerification);
  }, [eligibilityDetails]);

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

            <ListSelector title="Work Email" state={ListSelectorState.Selected} onClick={onBack} />
          </div>

          <TextInput
            className="w-full"
            placeholder="Enter work email address"
            onChange={onWorkEmailChanged}
            value={eligibilityDetails?.emailVerification ?? undefined}
          />
        </div>

        <Button
          className="w-full"
          size="Large"
          variant={ThemeVariant.Primary}
          disabled={!canSendVerificationEmail}
          onClick={sendVerificationLink}
          data-testid="send-verification-link-button"
        >
          Send verification link
        </Button>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
