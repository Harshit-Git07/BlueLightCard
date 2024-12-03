import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '../../../shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseFuzzyFrontendButtons';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { ManualAddressForm } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/ManualAddressForm';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useAddressIsValid } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseAddressIsValid';
import { useOnAddressSubmitted } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseOnAddressSubmitted';
import { useOnBack } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseOnBack';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';

export const DeliveryAddressScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  useLogAnalyticsPageView(eligibilityDetails);

  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);
  const isValid = useAddressIsValid(eligibilityDetailsState);

  const handleNext = useOnAddressSubmitted(eligibilityDetailsState);
  const handleBack = useOnBack(eligibilityDetailsState);

  return (
    <EligibilityScreen data-testid="delivery-address-screen">
      <EligibilityBody>
        <EligibilityHeading
          title="Delivery Address"
          subtitle="Tell us where you would like your card delivered."
          numberOfCompletedSteps={4}
        />

        <ManualAddressForm eligibilityDetailsState={eligibilityDetailsState} />

        <div className="flex flex-row items-center justify-between w-full gap-[8px]">
          <Button variant={ThemeVariant.Secondary} size="Large" onClick={handleBack}>
            Back
          </Button>

          <Button size="Large" className="flex-1" onClick={handleNext} disabled={!isValid}>
            Next
          </Button>
        </div>
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
