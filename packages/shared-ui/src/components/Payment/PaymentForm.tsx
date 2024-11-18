import { FC, FormEvent, useMemo, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Button from '../Button-V2';
import { ThemeVariant } from '../../types';
import { colours } from '../../tailwind/theme';

interface Props {
  className?: string;
  onBackButtonClicked?: () => void;
  onPaymentResult: (result: StripePaymentResult) => void;
  redirectUrl?: string;
}

export interface StripePaymentResult {
  success: boolean;
  errorMessage?: string;
}

const PaymentForm: FC<Props> = ({
  className = '',
  onBackButtonClicked,
  onPaymentResult,
  redirectUrl,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setPaymentLoading(true);

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
      redirect: 'if_required',
    });

    const errorMessage = result.error?.message;
    if (result.error) {
      setPaymentLoading(false);
      setErrorMessage(errorMessage);
    }

    onPaymentResult({ success: !result.error, errorMessage });
  };

  const buttonsDisabled = useMemo(() => {
    return paymentLoading || !stripe;
  }, [paymentLoading, stripe]);

  return (
    <form className={className} onSubmit={handleSubmit}>
      <PaymentElement />

      {errorMessage && <p className={`${colours.textError} mt-[6px]`}>{errorMessage}</p>}

      <div className="flex flex-row gap-2 mt-[24px]">
        {onBackButtonClicked && (
          <Button
            disabled={buttonsDisabled}
            onClick={onBackButtonClicked}
            size="Large"
            variant={ThemeVariant.Secondary}
          >
            Back
          </Button>
        )}

        <Button
          className="w-full"
          disabled={buttonsDisabled}
          type="submit"
          size="Large"
          variant={ThemeVariant.Primary}
          data-testid="payment-form-submit-button"
        >
          Pay and finish
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
