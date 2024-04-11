import { render, screen } from '@testing-library/react';
import Search, { Props } from './';

describe('Button', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      value: '',
      onChange: () => {},
    };
  });

  describe('smoke', () => {
    it('should render component without error', () => {
      render(<Search {...props} />);

      expect(screen.getByLabelText('Search')).toBeTruthy();
    });
  });
});
