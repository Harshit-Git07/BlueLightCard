/* eslint-disable @typescript-eslint/no-explicit-any */
import DesktopDynamicSheet from '.';
import { render } from '@testing-library/react';

const props = {
  children: <div>Testing component children</div>,
  showCloseButton: true,
  outsideClickClose: true,
  containerClassName: '',
  width: '24rem',
};

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<DesktopDynamicSheet {...props} />);
  });

  it('should render component with close button', () => {
    const { container } = render(<DesktopDynamicSheet {...props} />);
    const closeButton = container.querySelector('div > div > div:nth-child(2) > div:nth-child(1)');
    expect(closeButton).toBeTruthy();
  });

  it('should render component correctly with children', () => {
    const { getByText } = render(<DesktopDynamicSheet {...props} />);
    expect(getByText(/testing component children/i)).toBeTruthy();
  });
});
