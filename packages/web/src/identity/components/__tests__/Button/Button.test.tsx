import Button from '../../Button/Button';
import { ButtonProps } from '@/components/Button/types';
import { render, screen } from '@testing-library/react';

describe('Button component', () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {};
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Button {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });
});
