import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputRadioButtons from '../../InputRadioButtons/InputRadioButtons';
import { InputRadioButtonsProps } from '../../InputRadioButtons/types';

describe('InputRadioButtons component', () => {
  let props: InputRadioButtonsProps;

  beforeEach(() => {
    props = {
      id: 'employment',
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
    });
  });

  describe('component rendering', () => {
    it('should output text inside of the pill buttons', () => {
      render(<InputRadioButtons {...props} />);

      const inputRadioEmployed = screen.getByRole('radio', { name: 'Employed' });
      const inputRadioRetired = screen.getByRole('radio', { name: 'Retired' });
      const inputRadioVolunteer = screen.getByRole('radio', { name: 'Volunteer' });

      expect(inputRadioEmployed).toBeTruthy();
      expect(inputRadioRetired).toBeTruthy();
      expect(inputRadioVolunteer).toBeTruthy();
    });
  });

  describe('component functionality', () => {
    it('should invoke onChange callback with updated selected values', async () => {
      const onChangeMockFn = jest.fn();
      props.onChange = onChangeMockFn;

      render(<InputRadioButtons {...props} />);

      const radioButton = screen.getByRole('radio', { name: 'Retired' });
      fireEvent.click(radioButton);

      expect(radioButton).toBeChecked();
    });
  });
});
