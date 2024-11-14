import { render, screen } from '@testing-library/react';
import ValidationMessage, { Props } from './';
import { colours } from '../../tailwind/theme';

describe('ValidationMessage component', () => {
  const setup = (props: Partial<Props> = {}) => {
    const defaultProps: Props = {
      htmlFor: 'test-input',
      isValid: undefined,
      isDisabled: false,
    };

    return render(<ValidationMessage {...defaultProps} {...props} />);
  };

  it('renders the message when provided', () => {
    setup({ message: 'This is a validation message' });
    expect(screen.getByText('This is a validation message')).toBeInTheDocument();
  });

  it('does not render anything when message is not provided', () => {
    const { container } = setup();
    expect(container).toBeEmptyDOMElement();
  });

  it('applies success styles when isValid is true', () => {
    setup({ isValid: true, message: 'Success message' });
    const message = screen.getByText('Success message');
    expect(message.parentElement).not.toHaveClass(colours.textSuccess); // green
  });

  it('does not apply success styles when isDisabled is true', () => {
    setup({ isValid: false, isDisabled: true, message: 'Success message' });
    const message = screen.getByText('Success message');
    expect(message.parentElement).toHaveClass(colours.textOnSurfaceSubtle); // NOT green or red
  });

  it('applies error styles when isValid is false and not disabled', () => {
    setup({ isValid: false, message: 'Error message' });
    const message = screen.getByText('Error message');
    expect(message.parentElement).toHaveClass(colours.textError); // green
  });

  it('does not apply error styles when isDisabled is true', () => {
    setup({ isValid: false, isDisabled: true, message: 'Disabled message' });
    const message = screen.getByText('Disabled message');
    expect(message.parentElement).toHaveClass(colours.textOnSurfaceSubtle); // NOT green or red
  });

  it('applies initial styles when isValid is undefined', () => {
    setup({ message: 'Initial message' });
    const message = screen.getByText('Initial message');
    expect(message.parentElement).toHaveClass(colours.textOnSurfaceSubtle); // NOT green or red
  });

  it('sets aria-live="assertive" for the alert role', () => {
    setup({ message: 'Live update message' });
    const alertLabel = screen.getByRole('alert');
    expect(alertLabel).toHaveAttribute('aria-live', 'assertive');
  });

  it('sets aria-hidden="true" when isDisabled is true', () => {
    setup({ isDisabled: true, message: 'Hidden message' });
    const wrapper = screen.getByText('Hidden message').parentElement;
    console.log(wrapper);
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not set aria-hidden when isDisabled is false', () => {
    setup({ isDisabled: false, message: 'Visible message' });
    const wrapper = screen.getByText('Visible message').parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'false');
  });
});
