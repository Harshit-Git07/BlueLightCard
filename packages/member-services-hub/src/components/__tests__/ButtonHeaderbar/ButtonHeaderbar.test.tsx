import ButtonHeaderbar from '../../ButtonHeaderbar/ButtonHeaderbar';
import { ButtonHeaderbarProps } from '../../ButtonHeaderbar/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('button header bar component', () => {
  let props: ButtonHeaderbarProps;

  beforeEach(() => {
    props = {
      id: 'ButtonHeaderBar',
      show: true,
      buttonText: 'buttonText',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<ButtonHeaderbar {...props} />);
      const Button = screen.getAllByRole('button')[0];
      expect(Button).toBeTruthy();
    });
  });
});
