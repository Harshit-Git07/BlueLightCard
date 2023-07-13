import InputSelectField from '@/components/InputSelectField/InputSelectField';
import { InputSelectFieldProps } from '@/components/InputSelectField/types';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectField component', () => {
  let props: InputSelectFieldProps;

  beforeEach(() => {
    props = {
      options: [
        { value: 1, text: 'Option One' },
        { value: 2, text: 'Option Two' },
      ],
      defaultOption: 'Default Option',
    };
  });

  describe('smoke test', () => {
    it('should render the component correctly', () => {
      render(<InputSelectField {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should render the default option if provided', () => {
      render(<InputSelectField {...props} />);

      const inputSelectField = screen.getByDisplayValue('Default Option');

      expect(inputSelectField).toBeTruthy();
    });

    it('should render the select field with correct text', () => {
      const { getByLabelText, getByText } = render(<InputSelectField options={props.options} />);

      const selectElement = getByLabelText('drop-down selector');
      expect(selectElement).toBeInTheDocument();

      props.options.forEach((option) => {
        const optionElement = getByText(option.text);
        expect(optionElement).toBeInTheDocument();
      });
    });
  });

  describe('component functionality', () => {
    describe('component callbacks', () => {
      it('should invoke onChange callback with updated selected values', async () => {
        const onChangeMockFn = jest.fn();
        props.onChange = onChangeMockFn;

        render(<InputSelectField {...props} />);

        const selectElement = screen.getByLabelText('drop-down selector') as HTMLSelectElement;
        fireEvent.change(selectElement, { target: { value: '2' } });
        const selectedOptionValue = selectElement.options[selectElement.selectedIndex].value;

        expect(selectedOptionValue).toBe('2');
      });
    });
  });
});
