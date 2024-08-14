import { act, render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { spinner } from '../../store';
import SpinnerContainer from '@/modules/Spinner/components/SpinnerContainer';
import userEvent from '@testing-library/user-event';

jest.mock('next/image', () => {
  const NextImageMock = () => <></>;
  return NextImageMock;
});

describe('Spinner', () => {
  it('should show the spinner when "loading" is true', () => {
    whenTheSpinnerIsRenderedWithLoadingState(true);

    const spinnerComponent = screen.queryByRole('progressbar');
    expect(spinnerComponent).toBeTruthy();
  });

  it('should not show the spinner when "loading" is false', () => {
    whenTheSpinnerIsRenderedWithLoadingState(false);

    const spinnerComponent = screen.queryByRole('progressbar');
    expect(spinnerComponent).toBeFalsy();
  });

  describe('Timeout', () => {
    const { location, localStorage } = window;

    beforeEach(() => {
      userEvent.setup({ delay: null });
      jest.useFakeTimers();

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { reload: jest.fn() },
      });
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: location,
      });
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: { localStorage },
      });

      jest.useRealTimers();
      jest.resetAllMocks();
    });

    it('should display first message after first timeout', () => {
      jest.mocked(window.localStorage.getItem).mockImplementation(() => '1');
      whenTheSpinnerIsRenderedWithLoadingState(true);
      andTimeoutHasPassed();

      const message = screen.queryByText(
        'Hang tight! The page is just taking a little longer to load due to high demand. Thanks for your patience.',
      );
      const spinnerComponent = screen.queryByRole('progressbar');

      expect(message).toBeTruthy();
      expect(spinnerComponent).toBeTruthy();
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should display final message after final timeout and hide spinner', () => {
      jest.mocked(window.localStorage.getItem).mockImplementation(() => '2');
      whenTheSpinnerIsRenderedWithLoadingState(true);
      andTimeoutHasPassed();

      const message = screen.queryByText(
        'Oops! It looks this will still take us a little bit longer, we suggest you try again later.',
      );
      const spinnerComponent = screen.queryByRole('progressbar');

      expect(message).toBeTruthy();
      expect(spinnerComponent).toBeFalsy();
      expect(window.location.reload).not.toHaveBeenCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalled();
    });

    it('should not refresh the page on timeout when is spinner is not showing', () => {
      whenTheSpinnerIsRenderedWithLoadingState(false);
      andTimeoutHasPassed();

      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });
});

const whenTheSpinnerIsRenderedWithLoadingState = (value: boolean) => {
  return render(
    <JotaiTestProvider initialValues={[[spinner, value]]}>
      <SpinnerContainer />
    </JotaiTestProvider>,
  );
};

const andTimeoutHasPassed = () => {
  act(() => {
    jest.runAllTimers();
  });
};
