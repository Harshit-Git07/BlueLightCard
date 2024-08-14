/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react';
import SpinnerPresenter, { Props } from '../../components/SpinnerPresenter';

jest.mock('next/image', () => {
  const NextImageMock = () => <img src="/fake.png" alt="Fake" />;
  return NextImageMock;
});

describe('Spinner presenter', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      displayTimeoutMessage: null,
      maxedRetries: false,
    };
  });

  describe('rendering', () => {
    it('should render timeout message', () => {
      const timeoutMessageString = 'Timeout message';
      props.displayTimeoutMessage = timeoutMessageString;

      render(<SpinnerPresenter {...props} />);

      expect(screen.getByText(timeoutMessageString)).toBeTruthy();
    });

    it('should NOT render timeout message if not set', () => {
      props.displayTimeoutMessage = null;

      const { container } = render(<SpinnerPresenter {...props} />);

      expect(container.querySelector('p')).toBeFalsy();
    });

    it('should render maintenance graphic if max retries true', () => {
      props.maxedRetries = true;

      render(<SpinnerPresenter {...props} />);

      expect(screen.getByRole('img')).toBeTruthy();
    });

    it('should NOT render maintenance graphic if max retries false', () => {
      props.maxedRetries = false;

      render(<SpinnerPresenter {...props} />);

      expect(screen.queryByRole('img')).toBeFalsy();
    });
  });
});
