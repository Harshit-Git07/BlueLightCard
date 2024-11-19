import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DeliveryAddressScreen } from './DeliveryAddressScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

const mockSetEligibilityDetails = jest.fn();

const renderDeliveryAddressScreen = (customEligibilityDetails = {}) => {
  jest.clearAllMocks();
  const customState: EligibilityDetailsState = [
    {
      flow: 'Sign Up',
      currentScreen: 'Delivery Address Screen',
      ...customEligibilityDetails,
    },
    mockSetEligibilityDetails,
  ];
  return render(<DeliveryAddressScreen eligibilityDetailsState={customState} />);
};

describe('DeliveryAddressScreen', () => {
  it('should render with correct initial state', () => {
    renderDeliveryAddressScreen();

    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    expect(
      screen.getByText('Tell us where you would like your card delivered.')
    ).toBeInTheDocument();
  });

  it('should render with the correct number of completed steps', () => {
    renderDeliveryAddressScreen();

    const heading = screen.getByTestId('delivery-address-screen');
    expect(heading).toBeInTheDocument();
  });
});
