import { act, render, screen } from '@testing-library/react';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { spinner } from '../../store';
import SpinnerContainer from '@/modules/Spinner/components/SpinnerContainer';
import userEvent from '@testing-library/user-event';

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
    const { location } = window;

    beforeEach(() => {
      userEvent.setup({ delay: null });
      jest.useFakeTimers();

      Object.defineProperty(window, 'location', {
        configurable: true,
        value: { reload: jest.fn() },
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        configurable: true,
        value: location,
      });

      jest.useRealTimers();
      jest.resetAllMocks();
    });

    // TODO: [HOTFIX_Spinner] Reactivate
    // it('should refresh the page on timeout when spinner is showing', () => {
    //   whenTheSpinnerIsRenderedWithLoadingState(true);
    //   andTimeoutHasPassed();

    //   expect(window.location.reload).toHaveBeenCalled();
    // });

    it('should not refresh the page on timeout when is spinner is not showing', () => {
      whenTheSpinnerIsRenderedWithLoadingState(false);
      andTimeoutHasPassed();

      expect(window.location.reload).not.toHaveBeenCalled();
    });
  });
});

const whenTheSpinnerIsRenderedWithLoadingState = (value: boolean) => {
  render(
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
