import { FC, useMemo } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe, StripeElements, StripeElementsOptions } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';
import { useClientSecret } from '../../../hooks/useClientSecret';
import { useStripeClient } from '../../../hooks/useStripeClient';

interface Props {
  onFormLoaded: (stripe: Stripe, elements: StripeElements) => void;
  onFormChange: (isFilled: boolean) => void;
  className?: string;
}

const MyCardStripePayment: FC<Props> = ({ onFormLoaded, onFormChange, className }) => {
  const stripeClient = useStripeClient();
  const getClientSecretResult = useClientSecret();

  const clientSecret = useMemo(() => {
    const result = getClientSecretResult as { clientSecret: string | undefined } | undefined;
    return result?.clientSecret ?? undefined;
  }, [getClientSecretResult]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#001B80',
        colorText: '#202125',
        colorDanger: '#D41121',
      },
    },
  };

  if (!stripeClient || !clientSecret) return null;

  return (
    <div className={`${className} w-[calc(100%-4px)]`}>
      <div className="mt-[20px]">
        <Elements stripe={stripeClient} options={options}>
          <PaymentForm onFormLoaded={onFormLoaded} onFormChange={onFormChange} />
        </Elements>
      </div>
    </div>
  );
};

export default MyCardStripePayment;
