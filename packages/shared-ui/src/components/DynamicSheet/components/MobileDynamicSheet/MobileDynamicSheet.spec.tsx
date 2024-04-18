/* eslint-disable @typescript-eslint/no-explicit-any */
import MobileDynamicSheet from '.';
import { render } from '@testing-library/react';

const props = {
  children: <div>Testing component children</div>,
  showCloseButton: true,
  outsideClickClose: true,
  containerClassName: '',
  height: '90%',
};

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<MobileDynamicSheet {...props} />);
  });

  it('should render component with close button', () => {
    const { container } = render(<MobileDynamicSheet {...props} />);
    const closeButton = container.querySelector('div > div > div:nth-child(2) > div:nth-child(1)');
    expect(closeButton).toBeTruthy();
  });

  it('should render component correctly with children', () => {
    const { getByText } = render(<MobileDynamicSheet {...props} />);
    expect(getByText(/testing component children/i)).toBeTruthy();
  });
});
