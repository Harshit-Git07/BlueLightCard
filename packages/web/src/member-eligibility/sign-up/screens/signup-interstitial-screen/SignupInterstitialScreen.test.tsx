import { screen } from '@testing-library/react';
import { SignupInterstitialScreen } from './SignupInterstitialScreen';
import { useMedia } from 'react-use';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { renderWithMockedPlatformAdapter } from '@/root/src/member-eligibility/shared/testing/MockedPlatformAdaptor';

jest.mock('react-use');

const useMediaMock = jest.mocked(useMedia);

const eligibilityDetailsState: EligibilityDetailsState = [
  {
    flow: 'Sign Up',
    currentScreen: 'Interstitial Screen',
  },
  jest.fn(),
];

describe('given the layout is rendered on a desktop or tablet', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(false);

    renderWithMockedPlatformAdapter(
      <SignupInterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />
    );
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('signup-interstitial-screen');
    expect(interstitialScreen).toBeTruthy();
  });
});

describe('given the layout is rendered on mobile', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(true);

    renderWithMockedPlatformAdapter(
      <SignupInterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />
    );
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('signup-interstitial-screen');
    expect(interstitialScreen).toBeTruthy();
  });
});
