import React, { FC, useCallback } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/sign-up/screens/shared/components/body/EligibilityBody';
import { ThemeVariant } from '@bluelightcard/shared-ui/index';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EligibilityHeading } from '@/root/src/member-eligibility/sign-up/screens/shared/components/screen/components/EligibilityHeading';
import { useVerificationMethods } from '@/root/src/member-eligibility/sign-up/screens/verification-method-screen/hooks/useVerificationMethods';

export const VerificationMethodScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const verificationMethods = useVerificationMethods(eligibilityDetailsState);

  const onBack = useCallback(() => {
    setEligibilityDetails({
      ...eligibilityDetails,
      currentScreen: 'Job Details Screen',
    });
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen>
      <EligibilityBody>
        <EligibilityHeading
          title="Verify Eligibility"
          subtitle="Verify your eligibility by providing a valid ID"
          numberOfCompletedSteps={2}
        />

        <div className="flex flex-col gap-[8px]">
          <p className={`${fonts.bodySemiBold} ${colours.textOnSurface}`}>
            CHOOSE VERIFICATION METHOD
          </p>

          {verificationMethods.map((method) => (
            <ListSelector key={method.title} {...method} />
          ))}
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
