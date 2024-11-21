import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RenewalAccountDetailsScreen } from './RenewalAccountDetailsScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

jest.mock('./hooks/UseAccountDetailsIsValid', () => ({
  useAccountDetailsValid: () => true,
}));

const mockSetEligibilityDetails = jest.fn();

const renderRenewalAccountDetailsScreen = (customEligibilityDetails = {}) => {
  jest.clearAllMocks();
  const defaultState: EligibilityDetailsState = [
    {
      currentScreen: 'Renewal Account Details Screen',
      flow: 'Renewal',
      member: {
        firstName: 'John',
        surname: 'Doe',
        dob: '1990-01-01',
      },
      ...customEligibilityDetails,
    },
    mockSetEligibilityDetails,
  ];
  return render(<RenewalAccountDetailsScreen eligibilityDetailsState={defaultState} />);
};

describe('given initial render', () => {
  beforeEach(() => {
    renderRenewalAccountDetailsScreen();
  });

  it('should render main heading and subtitle', () => {
    expect(screen.getByText('Review Account Details')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Make sure your name and date of birth are correct. Tell us where to send your new card.'
      )
    ).toBeInTheDocument();
  });

  it('should render section headers', () => {
    expect(screen.getByText('ABOUT YOU')).toBeInTheDocument();
    expect(screen.getByText('ADDRESS')).toBeInTheDocument();
  });

  it('should render section descriptions', () => {
    expect(
      screen.getByText(
        "If you've changed your name since your last membership, make sure it matches the ID you'll provide in the next step."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText('Tell us where you would like your card delivered.')
    ).toBeInTheDocument();
  });

  it('should render both buttons', () => {
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  describe('when back button was clicked', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Back'));
    });

    it('should navigate to Interstitial Screen', () => {
      expect(mockSetEligibilityDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          currentScreen: 'Interstitial Screen',
        })
      );
    });
  });

  describe('when continue button was clicked', () => {
    beforeEach(() => {
      fireEvent.click(screen.getByText('Continue'));
    });

    it('should navigate to Job Details Screen', () => {
      expect(mockSetEligibilityDetails).toHaveBeenCalledWith(
        expect.objectContaining({
          currentScreen: 'Job Details Screen',
        })
      );
    });
  });
});
