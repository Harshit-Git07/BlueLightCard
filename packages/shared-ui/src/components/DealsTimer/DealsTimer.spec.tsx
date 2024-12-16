import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import DealsTimer from './';
import { DealsTimerProps } from './types';

jest.mock('moment', () => {
  const originalMoment = jest.requireActual('moment');
  const mockedMoment: any = jest.fn((date: string) =>
    date ? originalMoment(date) : originalMoment('2024-10-15T00:00:00.000Z'),
  );
  mockedMoment.duration = jest.fn((difference: number) => originalMoment.duration(difference));
  return mockedMoment;
});

describe('Deals timer component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  const defaultProps: DealsTimerProps = {
    expiry: '2024-10-15T00:00:00.000Z',
  };

  const result = render(<DealsTimer {...defaultProps} />);

  it('should render component without error', () => {
    expect(result).toBeTruthy();
  });

  it('should display "This deal has expired" when expiry date in the past', async () => {
    render(<DealsTimer expiry="2023-09-30T00:00:00.000Z" />);
    act(() => {
      jest.advanceTimersByTime(6000);
    });
    expect(screen.getByText(/this deal has expired/i)).toBeInTheDocument();
  });
});
