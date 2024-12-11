import { render, screen, fireEvent } from '@testing-library/react';
import DropdownListItem from './';
import { DropdownListItemProps, DropdownOptions } from '../../types';

describe('DropdownListItem', () => {
  const mockOnSelected = jest.fn();
  const mockOnOptionKeyDown = jest.fn();

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

  const defaultProps: DropdownListItemProps = {
    option: options[0],
    index: 0,
    selectedOption: options[0],
    disabled: false,
    onSelected: mockOnSelected,
    onOptionKeyDown: mockOnOptionKeyDown,
  };

  const setup = (props?: Partial<DropdownListItemProps>) => {
    jest.resetAllMocks();
    render(<DropdownListItem {...defaultProps} {...props} />);
  };

  it('renders with the correct role and attributes', () => {
    setup();

    const item = screen.getByRole('option');
    expect(item).toBeInTheDocument();
    expect(item).toHaveAttribute('aria-disabled', 'false');
    expect(item).toHaveAttribute('aria-selected', 'true');
    expect(item).toHaveAttribute('tabindex', '1');
  });

  it('applies correct styles when selected', () => {
    setup();

    const item = screen.getByRole('option');
    expect(item).toHaveClass('border-b-dropDownItem-bg-colour');
  });

  it('does not apply selected styles when not selected', () => {
    setup({ selectedOption: options[1] });

    const item = screen.getByRole('option');
    expect(item).not.toHaveClass('border-b-dropDownItem-bg-colour');
  });

  it('applies hover and focus styles', () => {
    setup();

    const item = screen.getByRole('option');
    fireEvent.focus(item);
    expect(item).toHaveClass('focus:text-dropDownItem-text-active-colour');

    fireEvent.mouseOver(item);
    expect(item).toHaveClass('hover:bg-dropDownItem-bg-hover-colour');
  });

  it('calls onSelected when clicked', () => {
    setup();

    const item = screen.getByRole('option');
    fireEvent.click(item);

    expect(mockOnSelected).toHaveBeenCalledTimes(1);
    expect(mockOnSelected).toHaveBeenCalledWith(defaultProps.option);
  });

  it('calls onOptionKeyDown when a key is pressed', () => {
    setup();

    const item = screen.getByRole('option');
    fireEvent.keyDown(item, { key: 'Enter', code: 'Enter' });

    expect(mockOnOptionKeyDown).toHaveBeenCalledTimes(1);
    expect(mockOnOptionKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ key: 'Enter', code: 'Enter' }),
      defaultProps.option,
    );
  });

  it('renders disabled state correctly', () => {
    setup({ disabled: true });

    const item = screen.getByRole('option');
    expect(item).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(item);
    expect(mockOnSelected).not.toHaveBeenCalled();
  });
});
