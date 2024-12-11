import TextInput from './';
import { TextInputProps } from './types';
import { colours } from '../../tailwind/theme';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockOnChange = jest.fn();
const mockOnKeyDown = jest.fn();

const setup = (partialProps?: Partial<TextInputProps>) => {
  const defaultProps: TextInputProps = {
    id: 'test-input',
    name: 'test',
    isValid: undefined,
    isDisabled: false,
    value: '',
    isRequired: false,
    onChange: mockOnChange,
    onKeyDown: mockOnKeyDown,
    placeholder: 'Enter text',
    label: 'Test Label',
    tooltip: 'Helpful tooltip',
    description: 'Field description',
    validationMessage: 'Validation message',
  };

  return render(<TextInput {...defaultProps} {...partialProps} />);
};

describe('TextInput component', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the label when provided', () => {
    setup();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('does not render the label when not provided', () => {
    setup({ label: undefined });
    expect(screen.queryByText('Test Label')).not.toBeInTheDocument();
  });

  it('renders the tooltip and description when provided', () => {
    setup();
    expect(screen.getByText('Helpful tooltip')).toBeInTheDocument();
    expect(screen.getByText('Field description')).toBeInTheDocument();
  });

  it('renders the floating placeholder', () => {
    setup();
    expect(screen.getByText('Enter text')).toBeInTheDocument();
  });

  it('renders the validation message when provided', () => {
    setup();
    expect(screen.getByText('Validation message')).toBeInTheDocument();
  });

  it('applies disabled styles and attributes when isDisabled is true', () => {
    setup({ isDisabled: true });
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass(colours.backgroundSurfaceContainer);
  });

  it('applies aria-invalid when isValid is false', () => {
    setup({ isValid: false });
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not apply aria-invalid when isValid is true', () => {
    setup({ isValid: true });
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('applies aria-required when isRequired is true', () => {
    setup({ isRequired: true });
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  it('triggers onChange when input value changes', () => {
    setup();
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('triggers onKeyDown when a key is pressed', () => {
    setup();
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(mockOnKeyDown).toHaveBeenCalled();
  });

  it('toggles focus state when input gains and loses focus', async () => {
    setup();
    const input = screen.getByRole('textbox');

    userEvent.click(input);
    await waitFor(() => {
      expect(input).toHaveFocus();
    });

    userEvent.tab();
    await waitFor(() => {
      expect(input).not.toHaveFocus();
    });
  });

  it('uses the correct aria-describedby when descriptive components are provided', () => {
    setup();
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute(
      'aria-describedby',
      'test-input-tooltip test-input-description test-input-placeholder test-input-validation-message',
    );
  });

  it('does not set aria-describedby when all descriptive components are absent', () => {
    setup({
      tooltip: undefined,
      description: undefined,
      validationMessage: undefined,
      label: undefined,
      placeholder: undefined,
    });
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', '');
  });
});
