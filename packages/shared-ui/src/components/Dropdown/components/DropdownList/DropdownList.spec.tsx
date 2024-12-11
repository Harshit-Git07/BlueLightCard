import { render, screen, fireEvent } from '@testing-library/react';
import DropdownList from './';
import DropdownListItem from '../DropdownListItem';
import { DropdownListProps, DropdownOption, DropdownOptions } from '../../types';
import { createRef } from 'react';

const mockOnSelected = jest.fn();
const mockOnOptionKeyDown = jest.fn();

jest.mock('../DropdownListItem', () =>
  jest.fn(
    ({
      option,
      index,
      onSelected,
      onOptionKeyDown,
    }: {
      option: DropdownOption;
      index: number;
      onSelected: jest.Mock;
      onOptionKeyDown: jest.Mock;
    }) => (
      <div
        role="option"
        data-testid={`dropdown-list-item-${index}`}
        onClick={() => onSelected(option)}
        onKeyDown={(event) => onOptionKeyDown(event, option)}
      >
        {option.label}
      </div>
    ),
  ),
);

describe('DropdownList', () => {
  const mockListboxRef = createRef<HTMLDivElement>();

  const options: DropdownOptions = [
    {
      id: '1',
      label: 'Option One',
    },
    {
      id: '2',
      label: 'Option Two',
    },
    {
      id: '3',
      label: 'Option Three',
    },
  ];

  const defaultProps: DropdownListProps = {
    className: 'custom-class',
    listboxRef: mockListboxRef,
    dropdownId: 'test-dropdown',
    options: options,
    maxItemsShown: 5,
    disabled: false,
    selectedOption: options[1],
    onSelected: mockOnSelected,
    onOptionKeyDown: mockOnOptionKeyDown,
  };

  const setup = (props?: Partial<DropdownListProps>) => {
    return render(<DropdownList {...defaultProps} {...props} />);
  };

  it('renders the listbox with correct attributes', () => {
    setup();

    const listbox = screen.getByTestId('dropdownList');
    expect(listbox).toBeInTheDocument();
    expect(listbox).toHaveAttribute('role', 'listbox');
    expect(listbox).toHaveAttribute('tabindex', '0');
    expect(listbox).toHaveAttribute('id', `dropdown-listbox-${defaultProps.dropdownId}`);
    expect(listbox).toHaveClass('custom-class');
  });

  it('applies correct styles based on maxItemsShown', () => {
    setup({ maxItemsShown: 6 });

    const listbox = screen.getByTestId('dropdownList');
    expect(listbox).toHaveStyle('height: 288px');
  });

  it('renders all options as DropdownListItem components', () => {
    setup();

    defaultProps.options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('renders "No results found" when options are empty', () => {
    setup({ options: [] });

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('does not render "No results found" when options are present', () => {
    setup();

    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('renders correct properties for each DropdownListItem', () => {
    setup();

    defaultProps.options.forEach((option, index) => {
      expect(DropdownListItem).toHaveBeenCalledWith(
        expect.objectContaining({
          option,
          index,
          selectedOption: defaultProps.selectedOption,
          disabled: defaultProps.disabled,
          onSelected: defaultProps.onSelected,
          onOptionKeyDown: defaultProps.onOptionKeyDown,
        }),
        expect.anything(),
      );
    });
  });

  it('calls onOptionKeyDown when a key is pressed on the listbox items', () => {
    setup();

    const optionIndex = 0; // First option
    const option1 = defaultProps.options[optionIndex];
    const optionElement = screen.getByTestId(`dropdown-list-item-${optionIndex}`);
    fireEvent.keyDown(optionElement, { key: 'Enter', code: 'Enter' });

    expect(option1).toBe(options[0]);
    expect(mockOnOptionKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnOptionKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'Enter',
        code: 'Enter',
      }),
      option1,
    );
  });

  it('calls onSelected when an option is clicked', () => {
    setup();

    const optionIndex = 1; // Second option
    const option2 = defaultProps.options[optionIndex];
    const optionElement = screen.getByTestId(`dropdown-list-item-${optionIndex}`);

    fireEvent.click(optionElement);

    expect(option2).toBe(options[1]);
    expect(mockOnSelected).toHaveBeenCalledWith(option2);
  });
});
