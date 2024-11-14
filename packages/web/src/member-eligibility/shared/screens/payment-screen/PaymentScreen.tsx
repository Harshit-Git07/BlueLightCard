import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { VerifyEligibilityScreenProps } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@bluelightcard/shared-ui/components/Payment/PaymentForm';
import { Typography, usePlatformAdapter } from '@bluelightcard/shared-ui/index';
import ProgressBar from '@bluelightcard/shared-ui/components/ProgressBar';
import LoadingSpinner from '@bluelightcard/shared-ui/components/LoadingSpinner';
import { EligibilityScreen } from '@/root/src/member-eligibility/shared/screens/shared/components/screen/EligibilityScreen';
import { EligibilityBody } from '@/root/src/member-eligibility/shared/screens/shared/components/body/EligibilityBody';

interface Result {
  success: boolean;
  errorMessage?: string;
}

//should we load this from somewhere else?
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? '');

//We need unique idempotency key so that we do not create duplicate payment intents.
// It makes sense for this to be application id if such a thing exists as that is unique to each application per user
// anything we pass down in the metadata will go into Stripe so think what makes sense to be in stripe for back office users
const applicationId = 'application-id';
const idempotencyKey = applicationId;

export const PaymentScreen: FC<VerifyEligibilityScreenProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;
  const [clientSecret, setClientSecret] = useState('');

  const platformAdapter = usePlatformAdapter();

  useEffect(() => {
    platformAdapter
      .invokeV5Api('/orders/checkout', {
        method: 'POST',
        body: JSON.stringify({
          items: [
            {
              productId: 'membership',
              quantity: 1,
              metadata: { applicationId },
            },
          ],
          idempotencyKey,
          source: 'web',
        }),
      })
      .then((result) => setClientSecret(JSON.parse(result.data).clientSecret))
      .catch(console.error);
  }, [platformAdapter]);

  const onPaymentResult = useCallback(
    (result: Result) => {
      if (result.success) {
        setEligibilityDetails({
          ...eligibilityDetails,
          currentScreen: 'Success Screen',
        });
      } else {
        //what to do in case of failure, payment component already displays the error message on the page
      }
    },
    [eligibilityDetails, setEligibilityDetails]
  );

  const onBack = useMemo(() => {
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
  }, [eligibilityDetails, setEligibilityDetails]);

  return (
    <EligibilityScreen data-testid="job-details-screen">
      <EligibilityBody className="px-[18px]">
        <div className="flex flex-col items-start">
          <Typography variant="title-large" className="text-left md:text-nowrap">
            Payment
          </Typography>

          <Typography variant="body" className="mt-[4px] text-left md:text-nowrap">
            {`Unlock two years of exclusive access for just ${
              process.env.NEXT_PUBLIC_CURRENCY_SYMBOL ?? ''
            }${process.env.NEXT_PUBLIC_MEMBERSHIP_PRICE ?? ''}`}
          </Typography>

          <ProgressBar
            totalNumberOfSteps={3}
            numberOfCompletedSteps={1}
            className="mb-[24px] mt-[16px]"
          />

          <div className="w-full">
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm onBackButtonClicked={onBack} onPaymentResult={onPaymentResult} />
              </Elements>
            ) : (
              <LoadingSpinner
                containerClassName="w-full"
                spinnerClassName="text-[1.5em] text-palette-primary dark:text-palette-secondary"
              />
            )}
          </div>
        </div>
      </EligibilityBody>
    </EligibilityScreen>
  );
};
