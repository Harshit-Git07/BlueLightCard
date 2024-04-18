/* eslint-disable @typescript-eslint/no-explicit-any */
import LoadingSpinner from '.';
import { render } from '@testing-library/react';

const props = {
  containerClassName: '',
  spinnerClassName: '',
};

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<LoadingSpinner {...props} />);
  });

  it('should render component correctly', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('div > div > svg > path')).toBeTruthy();
  });
});
