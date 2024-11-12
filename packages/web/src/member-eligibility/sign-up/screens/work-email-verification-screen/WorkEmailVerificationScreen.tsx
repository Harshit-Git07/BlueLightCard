import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { ListSelectorState } from '@bluelightcard/shared-ui/components/ListSelector/types';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { useOnWorkEmailChange } from '@/root/src/member-eligibility/sign-up/screens/work-email-verification-screen/hooks/UseOnWorkEmailChange';
import { useOnSendVerificationLink } from '@/root/src/member-eligibility/sign-up/screens/work-email-verification-screen/hooks/UseOnSendVerificationLink';
import { useReturnToVerificationScreen } from '@/root/src/member-eligibility/sign-up/screens/work-email-verification-screen/hooks/UseOnReturnToVerificationScreen';

export const WorkEmailVerificationScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;
  const { onWorkEmailChange } = useOnWorkEmailChange(eligibilityDetailsState);
  const sendVerificationLink = useOnSendVerificationLink(eligibilityDetailsState);
  const returnToVerificationScreen = useReturnToVerificationScreen(eligibilityDetailsState);
  //TODO: This value of this boolean needs to be set by the logic of the API when verifying the email address - functionality/usage will remain the same
  const emailHasBeenVerified = eligibilityDetails?.emailVerification;

  return (
    <EligibilityScreen data-testid="work-email-verification-screen">
      <EligibilityBody>
        <EligibilityHeading
          title="Verify Eligibility"
          subtitle="Enter your work email address to verify your eligibility"
          numberOfCompletedSteps={3}
        />
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[12px]">
            <p className={` ${fonts.bodySemiBold} ${colours.textOnSurface}`}>VERIFICATION METHOD</p>

            <ListSelector
              title="Work Email"
              state={ListSelectorState.Selected}
              onClick={returnToVerificationScreen}
            />
          </div>

          <TextInput
            className={'w-full'}
            placeholder={'Enter work email address'}
            onChange={onWorkEmailChange}
            value={eligibilityDetails?.emailVerification ?? undefined}
          />
        </div>

        <Button
          className="w-full"
          variant={ThemeVariant.Primary}
          disabled={!emailHasBeenVerified}
          size="Large"
          onClick={sendVerificationLink}
          data-testid="send-verification-link-button"
        >
          Send verification link
        </Button>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
