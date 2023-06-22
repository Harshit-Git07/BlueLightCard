import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputRadioButtons from '../../InputRadioButtons/InputRadioButtons';
import { InputRadioButtonsProps } from '../../InputRadioButtons/Types';

describe('InputRadioButtons component', () => {
  let props: InputRadioButtonsProps;

  beforeEach(() => {
    props = {
      inputValues: [
        {
          name: 'Employed',
          value: 'employed',
          selectedByDefault: true,
        },
        {
          name: 'Retired',
          value: 'retired',
          selectedByDefault: false,
        },
        {
          name: 'Volunteer',
          value: 'volunteer',
          selectedByDefault: false,
        },
      ],
    };
  });

  describe('smoke test', () => {
    it('should render component without error', () => {
      render(<InputRadioButtons {...props} />);

      const inputRadioButton = screen.getByRole('radio', { name: 'Employed' });

      expect(inputRadioButton).toBeTruthy();
    });
  });
});
