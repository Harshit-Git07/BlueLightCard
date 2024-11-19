import React, { FC, useCallback, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { ThemeVariant } from '@bluelightcard/shared-ui/index';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import ListSelector from '@bluelightcard/shared-ui/components/ListSelector';
import { colours, fonts } from '@bluelightcard/shared-ui/tailwind/theme';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { useVerificationMethods } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/useVerificationMethods';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/verification-method-screen/hooks/FuzzyFrontendButtons';

export const VerificationMethodScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);
  const verificationMethods = useVerificationMethods(eligibilityDetailsState);

  const numberOfCompletedSteps = useMemo(() => {
    switch (eligibilityDetails.flow) {
      case 'Sign Up':
        return 2;
      case 'Renewal':
        return 3;
    }
  }, [eligibilityDetails.flow]);

  const onBack = useCallback(() => {
    if (eligibilityDetails.flow === 'Renewal' && !eligibilityDetails.accountDetailsChanged) {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Renewal Account Details Screen',
      });
      return;
    }

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
          numberOfCompletedSteps={numberOfCompletedSteps}
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

      <FuzzyFrontendButtons buttons={fuzzyFrontendButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
