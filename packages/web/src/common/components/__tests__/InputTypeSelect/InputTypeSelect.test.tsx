import InputTypeSelect from '@/components/InputTypeSelect/InputTypeSelect';
import { InputTypeSelectProps } from '@/components/InputTypeSelect/types';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('InputSelectField component', () => {
  let props: InputTypeSelectProps;

  beforeEach(() => {
    props = {
      options: [
        {
          label: 'Option One',
          id: '1',
        },
        {
          label: 'Option Two',
          id: '2',
        },
      ],
      placeholder: 'Select Option',
      onSelect: jest.fn(),
    };
  });

  describe('smoke test', () => {
    it('should render the component correctly', () => {
      render(<InputTypeSelect {...props} />);
    });
  });

  describe('component rendering', () => {
    it('should render the placeholder', () => {
      render(<InputTypeSelect {...props} />);
      const placeholderElement = screen.getByText('Select Option');

      expect(placeholderElement).toBeVisible();
    });

    it('should render the select field with correct text', () => {
      const { getByText } = render(
        <InputTypeSelect
          options={props.options}
          placeholder={'Select option'}
          onSelect={jest.fn()}
        />
      );
      const placeholderElement = screen.getByText('Select option');
      fireEvent.click(placeholderElement);

      props.options.forEach((option) => {
        const optionElement = getByText(option.label);
        expect(optionElement).toBeInTheDocument();
      });
    });

    it('fireEvent with the click on an element of the dropdown', () => {
      const mockOnSelect = jest.fn();
      render(
        <InputTypeSelect
          options={props.options}
          placeholder="Select option"
          onSelect={mockOnSelect}
        />
      );

      const placeholderElement = screen.getByText('Select option');
      fireEvent.click(placeholderElement);

      const optionElement = screen.getByText('Option One');
      expect(optionElement).toBeVisible();

      fireEvent.click(optionElement);

      expect(mockOnSelect).toHaveBeenCalled();
      expect(screen.getByText('Option One')).toBeInTheDocument();
    });
  });
});
