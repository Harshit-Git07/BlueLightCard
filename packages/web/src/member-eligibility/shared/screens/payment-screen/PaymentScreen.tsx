import React, { FC, useMemo } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import LoadingSpinner from '@bluelightcard/shared-ui/components/LoadingSpinner';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';
import { EligibilityHeading } from '@/root/src/member-eligibility/shared/screens/shared/components/heading/EligibilityHeading';
import { StripePaymentComponent } from '@/root/src/member-eligibility/shared/screens/payment-screen/components/StripePaymentComponent';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useFuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/payment-screen/hooks/UseFuzzyFrontendButtons';
import { FuzzyFrontendButtons } from '@/root/src/member-eligibility/shared/screens/shared/components/fuzzy-frontend/components/fuzzy-frontend-buttons/FuzzyFrontendButtons';

import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { useLogAnalyticsPageView } from '@/root/src/member-eligibility/shared/hooks/use-ampltude-event-log/UseAmplitudePageLog';
import { paymentEvents } from '@/root/src/member-eligibility/shared/screens/payment-screen/ampltitude-events/PaymentEvents';
import {
  isSuccessResult,
  useClientSecret,
} from '@bluelightcard/shared-ui/components/Payment/useClientSecret';

export const PaymentScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  const logAnalyticsEvent = useLogAmplitudeEvent();
  useLogAnalyticsPageView(eligibilityDetails);

  const getClientSecretResult = useClientSecret();

  const clientSecret = useMemo(() => {
    if (isSuccessResult(getClientSecretResult)) {
      return getClientSecretResult.clientSecret;
    }

    return undefined;
  }, [getClientSecretResult]);

  const clientSecretResultError = useMemo(() => {
    if (isSuccessResult(getClientSecretResult)) return undefined;

    return getClientSecretResult?.error;
  }, [getClientSecretResult]);

  const showLoadingSpinner = useMemo(() => {
    return getClientSecretResult === undefined;
  }, [getClientSecretResult]);

  const subtitle = useMemo(() => {
    const currencySymbol = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? '';
    const price = process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? '';

    return `Unlock two years of exclusive access for just ${currencySymbol}${price}`;
  }, []);

  const onBack = useMemo(() => {
    logAnalyticsEvent(paymentEvents.onBackCLicked(eligibilityDetails));
    if (eligibilityDetails.flow === 'Sign Up') {
      return () => {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'Delivery Address Screen',
        });
      };
    }

    if (eligibilityDetails.fileVerification === undefined) return undefined;

    return () => {
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'File Upload Verification Screen',
      });
    };
  }, [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]);

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

              <Button onClick={onBack} size="Large" variant={ThemeVariant.Secondary}>
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
