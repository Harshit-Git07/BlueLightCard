// import { render } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from './PaymentForm';
// import { StripeCardNumberElementChangeEvent } from '@stripe/stripe-js';
// import { useState } from 'react';
// import userEvent from '@testing-library/user-event';
// import { act } from 'react-test-renderer';
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
// const onFormLoaded = jest.fn();
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
// const stripe = jest.requireActual('@stripe/react-stripe-js');
//
// describe('PaymentForm', () => {
//   beforeEach(() => jest.clearAllMocks());
//
//   const user = userEvent.setup();
//
//   const withRender = () => {
//     const { getByTestId } = render(
//       <Elements stripe={stripe}>
//         <PaymentForm onFormLoaded={onFormLoaded} onFormChange={onFormChange} />
//       </Elements>,
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
