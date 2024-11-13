import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const mockStripe = {
  confirmPayment: jest.fn(),
};

jest.mock('@stripe/react-stripe-js', () => ({
  PaymentElement: jest.fn(() => <div data-testid="payment-element" />),
  useStripe: jest.fn(() => mockStripe),
  useElements: jest.fn(() => ({})),
  Elements: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('PaymentForm', () => {
  beforeEach(() => jest.clearAllMocks());
  it('calls submitted callback function on submission', async () => {
    const onBack = jest.fn();
    const onPaymentConfirmed = jest.fn();

    mockStripe.confirmPayment = jest.fn().mockResolvedValue({});

    const { getByTestId, getByRole } = render(
      <Elements stripe={null}>
        <PaymentForm onBackButtonClicked={onBack} onPaymentResult={onPaymentConfirmed} />
      </Elements>,
    );

    // Verify that the PaymentElement is rendered
    expect(getByTestId('payment-element')).toBeInTheDocument();

    // Simulate form submission
    fireEvent.submit(getByRole('button', { name: /pay/i }));

    await waitFor(() => {
      // Verify that confirmPayment was called
      expect(mockStripe.confirmPayment).toHaveBeenCalled();
      expect(onPaymentConfirmed).toHaveBeenCalled();
    });
  });

  it('calls submitted callback function with failed result', async () => {
    const onBack = jest.fn();
    const onPaymentConfirmed = jest.fn();

    mockStripe.confirmPayment = jest
      .fn()
      .mockResolvedValue({ error: { message: 'something went wrong' } });

    const { getByTestId, getByRole } = render(
      <Elements stripe={null}>
        <PaymentForm onBackButtonClicked={onBack} onPaymentResult={onPaymentConfirmed} />
      </Elements>,
    );

    // Verify that the PaymentElement is rendered
    expect(getByTestId('payment-element')).toBeInTheDocument();

    // Simulate form submission
    fireEvent.submit(getByRole('button', { name: /pay/i }));

    await waitFor(() => {
      // Verify that confirmPayment was called
      expect(mockStripe.confirmPayment).toHaveBeenCalled();
      expect(onPaymentConfirmed).toHaveBeenCalledWith({
        success: false,
        errorMessage: 'something went wrong',
      });
    });
  });

  it('calls back button callback function', async () => {
    const onBack = jest.fn();
    const onPaymentConfirmed = jest.fn();

    const { getByTestId, getByRole } = render(
      <Elements stripe={null}>
        <PaymentForm onBackButtonClicked={onBack} onPaymentResult={onPaymentConfirmed} />
      </Elements>,
    );

    // Verify that the PaymentElement is rendered
    expect(getByTestId('payment-element')).toBeInTheDocument();

    // Simulate form submission
    fireEvent.click(getByRole('button', { name: /back/i }));

    await waitFor(() => {
      // Verify that confirmPayment was called
      expect(mockStripe.confirmPayment).not.toHaveBeenCalled();
      expect(onBack).toHaveBeenCalled();
    });
  });
});
