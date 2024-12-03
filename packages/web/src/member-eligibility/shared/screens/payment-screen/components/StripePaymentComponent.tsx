import { Elements } from '@stripe/react-stripe-js';
import PaymentForm, {
  StripePaymentResult,
} from '@bluelightcard/shared-ui/components/Payment/PaymentForm';
import React, { FC, useCallback } from 'react';
import { useStripeClient } from '@/root/src/member-eligibility/shared/screens/payment-screen/providers/Stripe';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useLogAmplitudeEvent } from '@/root/src/member-eligibility/shared/utils/LogAmplitudeEvent';
import { paymentEvents } from '@/root/src/member-eligibility/shared/screens/payment-screen/ampltitude-events/PaymentEvents';

interface Props {
  eligibilityDetailsState: EligibilityDetailsState;
  clientSecret: string;
  onBack?: () => void;
}

export const StripePaymentComponent: FC<Props> = ({
  eligibilityDetailsState,
  clientSecret,
  onBack,
}) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const logAnalyticsEvent = useLogAmplitudeEvent();
  const stripeClient = useStripeClient();

  const onPaymentResult = useCallback(
    (result: StripePaymentResult) => {
      if (!result.success) {
        // TODO: Should we handle this? The payment component already shows an error
        return;
      }
      logAnalyticsEvent(paymentEvents.onPayClicked(eligibilityDetails));
      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Success Screen',
      });
    },
    [eligibilityDetails, logAnalyticsEvent, setEligibilityDetails]
  );

  if (!stripeClient) return null;

  return (
    <Elements stripe={stripeClient} options={{ clientSecret }}>
      <PaymentForm onPaymentResult={onPaymentResult} onBackButtonClicked={onBack} />
    </Elements>
  );
};
