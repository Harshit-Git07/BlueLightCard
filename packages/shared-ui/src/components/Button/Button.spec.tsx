import { render, screen } from '@testing-library/react';
import Button, { Props } from './';

describe('Button', () => {
  let props: Props;

  beforeEach(() => {
    props = {
      onClick: jest.fn(),
    };
  });

  describe('smoke', () => {
    it('should render component without error', () => {
      render(<Button {...props}>Button</Button>);

      expect(screen.getByRole('button')).toBeTruthy();
    });
  });
});
