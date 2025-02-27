import React, { FC } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import LoadingSpinner from '@bluelightcard/shared-ui/components/LoadingSpinner';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import {
  isSuccessResult,
  useClientSecret,
} from '@/root/src/member-eligibility/shared/screens/payment-screen/hooks/UseClientSecret';
import { StripePaymentComponent } from '@/root/src/member-eligibility/shared/screens/payment-screen/components/StripePaymentComponent';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/payment-screen/hooks/UseFuzzyFrontendButtons';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { paymentEvents } from '@/root/src/member-eligibility/shared/screens/payment-screen/ampltitude-events/PaymentEvents';
import { computeValue } from '@/root/src/member-eligibility/shared/utils/ComputeValue';

export const PaymentScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const getClientSecretResult = useClientSecret();

  const clientSecret = computeValue(() => {
    if (isSuccessResult(getClientSecretResult)) {
      return getClientSecretResult.clientSecret;
    }

    return undefined;
  });

  const clientSecretResultError = computeValue(() => {
    if (isSuccessResult(getClientSecretResult)) return undefined;

    return getClientSecretResult?.error;
  });

  const showLoadingSpinner = computeValue(() => {
    return getClientSecretResult === undefined;
  });

  const subtitle = computeValue(() => {
    const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? '';
    const price = process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? '';

    return `Unlock two years of exclusive access for just ${currencySymbol}${price}`;
  });

  const onBack = computeValue(() => {
    logAnalyticsEvent(paymentEvents.onBackCLicked(eligibilityDetails));

    if (eligibilityDetails.flow === 'Sign Up') {
      return () => {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'Delivery Address Screen',
        });
      };
    }

    if (eligibilityDetails.hasJumpedStraightToPayment) {
      return () => {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'Interstitial Screen',
        });
      };
    }

    return () => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Verification Method Screen',
      });
    };
  });

  const fuzzyFrontendButtons = useFuzzyFrontendButtons(eligibilityDetailsState);

  return (
    <EligibilityScreen data-testid="payment-screen">
      <EligibilityBody>
        <EligibilityHeading title="Payment" subtitle={subtitle} numberOfCompletedSteps={5} />

        <div className="flex flex-col items-stretech w-full">
          {showLoadingSpinner && (
            <LoadingSpinner
              containerClassName="w-full"
              spinnerClassName="text-[1.5em] text-palette-primary dark:text-palette-secondary"
            />
          )}

          {clientSecret && (
            <StripePaymentComponent
              eligibilityDetailsState={eligibilityDetailsState}
              clientSecret={clientSecret}
              onBack={onBack}
            />
          )}

          {clientSecretResultError && (
            <div className="flex flex-col gap-2">
              <div>{clientSecretResultError}</div>

              <Button
                data-testid="back-button"
                onClick={onBack}
                size="Large"
                variant={ThemeVariant.Secondary}
              >
                Back
              </Button>
            </div>
          )}
        </div>
      </EligibilityBody>

      <FuzzyFrontendButtons buttons={fuzzyFrontendButtons} putInFloatingDock />
    </EligibilityScreen>
  );
};
