import { Elements } from '@stripe/react-stripe-js';
import PaymentForm, {
  StripePaymentResult,
} from '@bluelightcard/shared-ui/components/Payment/PaymentForm';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { getStripeClient } from '@/root/src/member-eligibility/shared/screens/payment-screen/providers/Stripe';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

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

  const [stripeInitialisationError, setStripeInitialisationError] = useState<string | undefined>(
    undefined
  );

  const stripeClient = useMemo(async (): Promise<Stripe | null> => {
    try {
      const stripeClient = await getStripeClient;
      setStripeInitialisationError(undefined);
      return stripeClient;
    } catch (error) {
      console.error('Failed to initalise stripe client', error);

      if (error instanceof Error) {
        setStripeInitialisationError(error.message);
        return null;
      }

      setStripeInitialisationError('Unknown error');
      return null;
    }
  }, []);

  const onPaymentResult = useCallback(
    (result: StripePaymentResult) => {
      if (!result.success) {
        // TODO: Should we handle this? The payment component already shows an error
        return;
      }

      setEligibilityDetails({
        ...eligibilityDetails,
        currentScreen: 'Success Screen',
      });
    },
    [eligibilityDetails, setEligibilityDetails]
  );

  return (
    <>
      {stripeInitialisationError && (
        <div data-testid="strip-payment-component-error">Payment provider failed to initialise</div>
      )}

      {!stripeInitialisationError && (
        <Elements stripe={stripeClient} options={{ clientSecret }}>
          <PaymentForm onPaymentResult={onPaymentResult} onBackButtonClicked={onBack} />
        </Elements>
      )}
    </>
  );
};
