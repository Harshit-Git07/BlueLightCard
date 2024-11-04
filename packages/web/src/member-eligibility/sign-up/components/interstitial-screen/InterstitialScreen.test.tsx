import { render, screen } from '@testing-library/react';
import InterstitialScreen from './InterstitialScreen';
import { useMedia } from 'react-use';

jest.mock('react-use');

const useMediaMock = jest.mocked(useMedia);

describe('given the layout is rendered on a desktop or tablet', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(false);
    render(<InterstitialScreen />);
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('InterstitialScreen');
    expect(interstitialScreen).toBeTruthy();
  });
});

describe('given the layout is rendered on mobile', () => {
  beforeEach(() => {
    useMediaMock.mockReturnValue(true);
    render(<InterstitialScreen />);
  });

  it('then it renders successfully', () => {
    const interstitialScreen = screen.getByTestId('InterstitialScreen');
    expect(interstitialScreen).toBeTruthy();
  });
});
