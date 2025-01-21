// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import MyCardStripePayment from './MyCardStripePayment';
// import { useClientSecret } from '../../Payment/useClientSecret';
// import { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
// import { useState } from 'react';
// import userEvent from '@testing-library/user-event';
// import { useStripeClient } from '../../Payment/useStripeClient';
// import { act } from 'react-test-renderer';
//
// const originalEnv = process.env;
//
// jest.mock('../../Payment/useClientSecret');
// const useClientSecretMock = jest.mocked(useClientSecret);
//
// const mockElement = () => ({
//   mount: jest.fn(),
//   destroy: jest.fn(),
//   on: jest.fn(),
//   update: jest.fn(),
// });
//
// const mockElements = () => {
//   const elements: { [key: string]: ReturnType<typeof mockElement> } = {};
//   return {
//     create: jest.fn((type) => {
//       elements[type] = mockElement();
//       return elements[type];
//     }),
//     getElement: jest.fn((type) => {
//       return elements[type] || null;
//     }),
//   };
// };
//
// const mockStripe = {
//   elements: jest.fn(() => mockElements()),
//   createToken: jest.fn(),
//   createSource: jest.fn(),
//   createPaymentMethod: jest.fn(),
//   confirmCardPayment: jest.fn(),
//   confirmPayment: jest.fn(),
//   confirmCardSetup: jest.fn(),
//   paymentRequest: jest.fn(),
//   _registerWrapper: jest.fn(),
// };
//
// jest.mock('../../Payment/useStripeClient');
// const useStripeClientMock = jest.mocked(useStripeClient);
//
// type MockCardNumberElementProps = {
//   onChange: (event: Partial<StripeCardNumberElementChangeEvent>) => unknown;
// };
// const MockCardNumberElement: React.FC<MockCardNumberElementProps> = ({ onChange }) => {
//   const [value, setValue] = useState('');
//   const changeHandler = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
//     // simulate the card number requirements ie 16 digits
//     if (!isNaN(Number(target.value))) {
//       setValue(target.value);
//
//       let complete = false;
//
//       if (target.value.length === 16) {
//         complete = true;
//       }
//
//       onChange({ complete });
//     }
//   };
//   return (
//     <input
//       data-testid="card-number-element"
//       onChange={changeHandler}
//       value={value}
//       id="cardNumber"
//     />
//   );
// };
//
// const onFormChange = jest.fn();
//
// const form = (
//   <div data-testid="payment-element">
//     <MockCardNumberElement onChange={onFormChange} />
//   </div>
// );
//
// jest.mock('@stripe/react-stripe-js', () => ({
//   PaymentElement: jest.fn(() => form),
//   useStripe: jest.fn(() => mockStripe),
//   useElements: jest.fn(() => ({})),
//   Elements: jest.fn(({ children }) => <div>{children}</div>),
// }));
//
// const onFormLoaded = jest.fn();
//
// const stripe = jest.requireActual('@stripe/react-stripe-js');
//
// describe('MyCardStripePayment', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//
//     process.env = {
//       ...originalEnv,
//       NEXT_PUBLIC_STRIPE_KEY:
//         'pk_test_51QACN4S9N5NHrlGYTj7qmy768u9A2lqFqL2AWQbOX3tbJhJO3tjDS74KuBcOwyiz6Dov35tox4aMi97bWX4Z2MCM00boCBdcYs',
//     };
//
//     useClientSecretMock.mockReturnValue({
//       // this is a key obtained by manually signing into the live site and use the idToken to call /orders/checkout endpoint
//       // putting into question the validity of these tests
//       clientSecret: 'pi_3QP5FUS9N5NHrlGY0bQa80cr_secret_eU2OXFoXnYqzCyw7JyJFB5Okt',
//     });
//
//     useStripeClientMock.mockReturnValue(stripe);
//   });
//
//   const user = userEvent.setup();
//
//   const withRender = () => {
//     const { getByTestId } = render(
//       <MyCardStripePayment onFormLoaded={onFormLoaded} onFormChange={onFormChange} />,
//     );
//
//     expect(getByTestId('payment-element')).toBeInTheDocument();
//
//     const cardNumberElt = getByTestId('card-number-element');
//     expect(cardNumberElt).toBeInTheDocument();
//
//     return {
//       cardNumberElt,
//     };
//   };
//
//   it('renders correctly', async () => {
//     withRender();
//
//     expect(onFormLoaded).toHaveBeenCalled();
//   });
//
//   it('should be complete when card number is filled properly', async () => {
//     const { cardNumberElt } = withRender();
//
//     await act(async () => {
//       user.click(cardNumberElt);
//       await user.type(cardNumberElt, '4242424242424242');
//     });
//
//     expect(onFormChange).toHaveBeenCalledWith({ complete: true });
//   });
//
//   it('should be incomplete when card number is not filled properly', async () => {
//     const { cardNumberElt } = withRender();
//
//     await act(async () => {
//       user.click(cardNumberElt);
//       await user.type(cardNumberElt, '111111');
//     });
//
//     expect(onFormChange).toHaveBeenCalledWith({ complete: false });
//   });
// });
