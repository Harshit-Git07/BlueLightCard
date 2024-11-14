import { FC, FormEvent, useState } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Button from '../Button-V2';
import { ThemeVariant } from '../../types';
import { colours } from '../../tailwind/theme';

interface Result {
  success: boolean;
  errorMessage?: string;
}

interface PaymentFormProps {
  onBackButtonClicked?: () => void;
  containerClassName?: string;
  onPaymentResult: (result: Result) => void;
  redirectUrl?: string;
}

const PaymentForm: FC<PaymentFormProps> = ({
  onBackButtonClicked,
  containerClassName,
  onPaymentResult,
  redirectUrl,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPaymentLoading(true);

    if (!stripe || !elements) {
      return;
    }

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
      setErrorMessage(errorMessage ?? '');
    }

    onPaymentResult({ success: !result.error, errorMessage });
  };

  const buttonsDisabled = paymentLoading || !stripe;

  return (
    <form onSubmit={handleSubmit} className={containerClassName}>
      <PaymentElement />

      {errorMessage && <p className={`mt-[6px] ${colours.textError}`}>{errorMessage}</p>}

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
          disabled={buttonsDisabled}
          type="submit"
          size="Large"
          variant={ThemeVariant.Primary}
          className={'w-full'}
        >
          Pay and finish
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
