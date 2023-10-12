import ButtonHeaderBar from '../../ButtonHeaderBar/ButtonHeaderBar';
import { ButtonHeaderBarProps } from '../../ButtonHeaderBar/types';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('button header bar component', () => {
  let props: ButtonHeaderBarProps;

  beforeEach(() => {
    props = {
      id: 'ButtonHeaderBar',
      show: true,
      buttonText: 'buttonText',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<ButtonHeaderBar {...props} />);
      const Button = screen.getAllByRole('button')[0];
      expect(Button).toBeTruthy();
    });
  });
});
