import '@testing-library/jest-dom';
import { fireEvent, screen } from '@testing-library/react';
import { RenewalAccountDetailsScreen } from './RenewalAccountDetailsScreen';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useAccountDetailsValid } from '@/root/src/member-eligibility/renewal/screens/renewal-account-details-screen/hooks/UseAccountDetailsIsValid';
import { renderWithMockedPlatformAdapter } from '@/root/src/member-eligibility/shared/testing/MockedPlatformAdaptor';

jest.mock('./hooks/UseAccountDetailsIsValid');

const mockSetEligibilityDetails = jest.fn();

const useAccountDetailsValidMock = jest.mocked(useAccountDetailsValid);

beforeEach(() => {
  useAccountDetailsValidMock.mockReturnValue(true);
});

describe('given initial render', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const defaultState: EligibilityDetailsState = [
      {
        currentScreen: 'Renewal Account Details Screen',
        flow: 'Renewal',
        member: {
          firstName: 'John',
          surname: 'Doe',
          dob: new Date('1980-01-01'),
        },
      },
      mockSetEligibilityDetails,
    ];
    renderWithMockedPlatformAdapter(
      <RenewalAccountDetailsScreen eligibilityDetailsState={defaultState} />
    );
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

  describe('when back button is clicked', () => {
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

  describe('when continue button is clicked', () => {
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
