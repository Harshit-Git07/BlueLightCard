import InputTextField from '@/components/InputTextField/InputTextField';
import { InputTextFieldProps } from '@/components/InputTextField/types';
import { render, screen } from '@testing-library/react';

describe('InputTextField component', () => {
  let props: InputTextFieldProps;

  beforeEach(() => {
    props = {
      placeholder: 'Input text field placeholder',
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputTextField {...props} />);

      const inputTextField = screen.getByRole('input');

      expect(inputTextField).toBeTruthy();
    });
  });
});
