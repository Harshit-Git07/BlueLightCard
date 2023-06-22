import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputRadioButton from '../../InputRadioButton/InputRadioButton';
import { InputRadioButtonProps } from '../../InputRadioButton/types';

describe('InputRadioButton component', () => {
  let props: InputRadioButtonProps;

  beforeEach(() => {
    props = {
      name: 'Option 1',
      required: true,
      value: 'val1',
      selectedByDefault: false,
      onClick: () => {},
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputRadioButton {...props} />);

      const inputRadioButton = screen.getByRole('radio', { name: /Option 1/i });

      expect(inputRadioButton).toBeTruthy();
    });
  });
});
