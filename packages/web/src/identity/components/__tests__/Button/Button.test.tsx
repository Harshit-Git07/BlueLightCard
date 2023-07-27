import { ThemeVariant } from '@/types/theme';
import Button from '../../Button/Button';
import { ButtonProps } from '../../Button/types';
import { render, screen } from '@testing-library/react';

describe('Button component', () => {
  let props: ButtonProps;

  beforeEach(() => {
    props = {
      id: 'button',
      children: 'Button',
      className: '',
      variant: ThemeVariant.Primary,
      onClick: jest.fn(),
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<Button {...props} />);

      const button = screen.getByRole('button');

      expect(button).toBeTruthy();
    });
  });
});
