/* eslint-disable @typescript-eslint/no-explicit-any */
import DynamicSheet from '.';
import { render } from '@testing-library/react';
import { PlatformVariant } from '../../types';

const props = {
  platform: PlatformVariant.Mobile,
  showCloseButton: true,
  containerClassName: '',
  height: '90%',
};

describe('smoke test', () => {
  it('should render component without error', () => {
    render(<DynamicSheet {...props} />);
  });

  it('should render component with close button', () => {
    const { container } = render(<DynamicSheet {...props} />);
    const closeButton = container.querySelector('div > div > div:nth-child(2) > div:nth-child(1)');
    expect(closeButton).toBeTruthy();
  });
});
