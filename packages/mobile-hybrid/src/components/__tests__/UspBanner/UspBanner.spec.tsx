import USPBanner from '@/components/UspBanner/UspBanner';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('UspBanner component', () => {
  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<USPBanner />);
    });
  });
});
