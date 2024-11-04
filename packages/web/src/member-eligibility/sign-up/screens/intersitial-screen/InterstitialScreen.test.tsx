import { render, screen } from '@testing-library/react';
import { InterstitialScreen } from './InterstitialScreen';
import { useMedia } from 'react-use';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/sign-up/screens/shared/types/VerifyEligibilityScreenProps';

jest.mock('react-use');

const useMediaMock = jest.mocked(useMedia);

const eligibilityDetailsState: EligibilityDetailsState = [
  {
    currentScreen: 'Interstitial Screen',
  },
  jest.fn(),
];

describe('given the layout is rendered on a desktop or tablet', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(false);
    render(<InterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />);
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('InterstitialScreen');
    expect(interstitialScreen).toBeTruthy();
  });
});

describe('given the layout is rendered on mobile', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(true);
    render(<InterstitialScreen eligibilityDetailsState={eligibilityDetailsState} />);
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('InterstitialScreen');
    expect(interstitialScreen).toBeTruthy();
  });
});
