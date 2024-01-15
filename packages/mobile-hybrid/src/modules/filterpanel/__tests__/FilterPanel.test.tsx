import FilterPanel from '../index';
import { render } from '@testing-library/react';

describe('FilterPanel component', () => {
  describe('Smoke test', () => {
    it('should render component without error', () => {
      render(<FilterPanel />);
    });
  });
});
