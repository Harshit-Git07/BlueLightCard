import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import { DeliveryAddressScreen } from './DeliveryAddressScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { renderWithMockedPlatformAdapter } from '@/root/src/member-eligibility/shared/testing/MockedPlatformAdaptor';

const mockSetEligibilityDetails = jest.fn();

describe('DeliveryAddressScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const customState: EligibilityDetailsState = [
      {
        flow: 'Sign Up',
        currentScreen: 'Delivery Address Screen',
      },
      mockSetEligibilityDetails,
    ];
    renderWithMockedPlatformAdapter(
      <DeliveryAddressScreen eligibilityDetailsState={customState} />
    );
  });

  it('should render with correct initial state', () => {
    expect(screen.getByText('Delivery Address')).toBeInTheDocument();
    expect(
      screen.getByText('Tell us where you would like your card delivered.')
    ).toBeInTheDocument();
  });

  it('should render with the correct number of completed steps', () => {
    const heading = screen.getByTestId('delivery-address-screen');
    expect(heading).toBeInTheDocument();
  });
});
