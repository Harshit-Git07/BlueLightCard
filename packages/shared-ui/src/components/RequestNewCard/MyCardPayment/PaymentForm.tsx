import { FC, useEffect, useMemo, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import {
  Stripe,
  StripeElements,
  StripePaymentElementChangeEvent,
  StripePaymentElementOptions,
} from '@stripe/stripe-js';

interface Props {
  onFormLoaded: (stripe: Stripe, elements: StripeElements) => void;
  onFormChange: (isFilled: boolean) => void;
}

// load stripe and render the actual payment Element
const PaymentForm: FC<Props> = ({ onFormLoaded, onFormChange }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (stripe && elements) {
      setIsLoaded(true);
      onFormLoaded(stripe, elements);
    }
  }, [stripe, elements, onFormLoaded]);

  const onChange = (event: StripePaymentElementChangeEvent) => {
    onFormChange(event.complete);
  };

  const paymentElementOptions: StripePaymentElementOptions = useMemo(() => {
    return {
      wallets: {
        googlePay: 'auto',
        applePay: 'auto',
      },
    };
  }, []);

  return (
    <>{isLoaded ? <PaymentElement options={paymentElementOptions} onChange={onChange} /> : null}</>
  );
};

export default PaymentForm;
