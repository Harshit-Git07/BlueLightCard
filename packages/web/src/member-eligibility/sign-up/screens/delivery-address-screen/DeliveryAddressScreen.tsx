import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '../../../shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseFuzzyFrontendButtons';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/components/EligibilityHeading';
import { ManualAddressForm } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/ManualAddressForm';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

export const DeliveryAddressScreen: FC<VerifyEligibilityScreenProps> = ({
  eligibilityDetailsState,
}) => {
  const fuzzyFrontEndButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  return (
    <EligibilityScreen data-testid="delivery-address-screen">
      <EligibilityBody>
        <EligibilityHeading
          title="Delivery Address"
          subtitle="Tell us where you would like your card delivered."
          numberOfCompletedSteps={4}
        />

        <ManualAddressForm eligibilityDetailsState={eligibilityDetailsState} />
      </EligibilityBody>
      <FuzzyFrontendButtons buttons={fuzzyFrontEndButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
