import { ChangeEvent, FC, PropsWithChildren } from 'react';
import { PaymentIntent, Stripe, StripeElements, StripeElementType } from '@stripe/stripe-js';
import { useStripeClient } from '@/root/src/member-eligibility/shared/screens/payment-screen/providers/Stripe';
import {
  isSuccessResult,
  useClientSecret,
} from '@/root/src/member-eligibility/shared/screens/payment-screen/hooks/UseClientSecret';
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { PaymentIntentResult } from '@stripe/stripe-js/dist/stripe-js/stripe';

const useClientSecretMock = jest.mocked(useClientSecret);
const isSuccessResultMock = jest.mocked(isSuccessResult);
const useStripeClientMock = jest.mocked(useStripeClient);
const useStripeMock = jest.mocked(useStripe);
const useElementsMock = jest.mocked(useElements);

const onChange = jest.fn();
const confirmPaymentMock = jest.fn();

const ElementsMock: FC<PropsWithChildren> = ({ children }) => <div>{children}</div>;
const MockedInputBuilder = (elementName: string) => {
  const MockedInput: FC = () => {
    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange({
        empty: !e.currentTarget.value,
        elementType: elementName as StripeElementType,
        complete: false,
        error: undefined,
      });
    };

    return <input data-testid={elementName} onChange={onInputChange} />;
  };

  return MockedInput;
};

const stripeStub = {
  elements: jest.fn(),
  confirmPayment: confirmPaymentMock,
} as unknown as Stripe;

export function mockStripe(): void {
  useClientSecretMock.mockReturnValue({
    clientSecret: 'client-secret-stub',
  });
  isSuccessResultMock.mockReturnValue(true);

  useStripeClientMock.mockReturnValue(stripeStub);
  useStripeMock.mockReturnValue(stripeStub);
  useElementsMock.mockReturnValue({} as unknown as StripeElements);

  const confirmPaymentResult: PaymentIntentResult = {
    error: undefined,
    paymentIntent: {} as unknown as PaymentIntent,
  };
  confirmPaymentMock.mockResolvedValue(confirmPaymentResult);

  jest.mocked(Elements).mockImplementation(ElementsMock);
  jest.mocked(CardNumberElement).mockImplementation(MockedInputBuilder('card-number'));
  jest.mocked(CardExpiryElement).mockImplementation(MockedInputBuilder('card-expiry'));
  jest.mocked(CardCvcElement).mockImplementation(MockedInputBuilder('card-cvc'));
}
