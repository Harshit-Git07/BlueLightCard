import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PasswordInput, { Props } from './';

describe('PasswordInput Component', () => {
  const onChangeMock = jest.fn();
  const defaultProps: Props = {
    id: 'mocked-id',
    label: 'Password',
    onChange: onChangeMock,
    isValid: undefined,
    hideRequirements: false,
    value: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByLabelText('password-mocked-id')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <PasswordInput
        {...defaultProps}
        label="Custom Password"
        description="Enter your password"
        validationMessage="Password is invalid"
        tooltip="Password requirements"
        isDisabled={false}
      />,
    );

    const label = screen.getByText('Custom Password');
    const description = screen.getByText('Enter your password');

    expect(label).toBeInTheDocument();
    expect(description).toBeInTheDocument();

    // The validation message should not appear until the input is dirty.
    const validationMessage = screen.queryByText('Password is invalid');
    expect(validationMessage).not.toBeInTheDocument();
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    render(<PasswordInput {...defaultProps} />);

    const eyeButton = screen.getByLabelText('Show password');
    const input = screen.getByLabelText('password-mocked-id');

    expect(input).toHaveAttribute('type', 'password');

    await act(async () => {
      await userEvent.click(eyeButton);
    });

    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange on input change and sets dirty state', async () => {
    render(
      <PasswordInput {...defaultProps} isValid={false} validationMessage="Password is invalid" />,
    );

    const input = screen.getByLabelText('password-mocked-id');

    await act(async () => {
      await userEvent.type(input, 'password123');
    });

    expect(onChangeMock).toHaveBeenCalledTimes(11); // "password123" is 11 characters.

    expect(screen.getByText('Password is invalid')).toBeInTheDocument();
  });

  it('shows and hides validation rules on focus and blur', async () => {
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('password-mocked-id');

    expect(screen.queryByText('Your password must contain:')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.click(input);
    });
    expect(screen.getByText('Your password must contain:')).toBeInTheDocument();

    await act(async () => {
      await userEvent.tab();
    });
    expect(screen.queryByText('Your password must contain:')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.type(input, 'password123');
      await userEvent.tab();
    });
    expect(screen.queryByText('Your password must contain:')).not.toBeInTheDocument();
  });

  it('disables input and interactions when isDisabled is true', async () => {
    render(<PasswordInput {...defaultProps} isDisabled={true} />);

    const input = screen.getByLabelText('password-mocked-id');
    expect(input).toBeDisabled();

    const eyeButton = screen.getByLabelText('Show password');
    await act(async () => {
      await userEvent.click(eyeButton);
    });
    expect(input).toHaveAttribute('type', 'password');
  });

  it('does not render password requirements if hideRequirements is true', async () => {
    render(<PasswordInput {...defaultProps} hideRequirements={true} />);

    const input = screen.getByLabelText('password-mocked-id');
    await act(async () => {
      await userEvent.click(input);
    });

    expect(screen.queryByText('Your password must contain:')).not.toBeInTheDocument();
  });

  it('renders password requirements if hideRequirements is false', async () => {
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('password-mocked-id');
    await act(async () => {
      await userEvent.click(input);
    });

    expect(screen.getByText('Your password must contain:')).toBeInTheDocument();
  });

  it('sets aria-invalid to true when the password is invalid', () => {
    render(<PasswordInput {...defaultProps} isValid={false} />);
    const input = screen.getByLabelText('password-mocked-id');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-invalid to false when isValid is true', () => {
    render(<PasswordInput {...defaultProps} isValid={true} id="mock-id" />);
    const validInput = screen.getByLabelText('password-mock-id');
    expect(validInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('does not set aria-invalid when is isValid undefined', () => {
    render(<PasswordInput {...defaultProps} isValid={undefined} id="mock-id-2" />);
    const undefinedInput = screen.getByLabelText('password-mock-id-2');
    expect(undefinedInput).not.toHaveAttribute('aria-invalid');
  });

  it('applies aria-describedby when description is provided', () => {
    render(<PasswordInput {...defaultProps} description="This is a help message" />);
    const input = screen.getByLabelText('password-mocked-id');
    expect(input).toHaveAttribute('aria-describedby', 'description-mocked-id');
  });

  it('displays validation message with role alert and aria-live', async () => {
    render(
      <PasswordInput {...defaultProps} isValid={false} validationMessage="Password is invalid" />,
    );

    const input = screen.getByLabelText('password-mocked-id');
    await act(async () => {
      await userEvent.type(input, '123pass');
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Password is invalid');
  });

  it('applies correct title to the eye icon button', async () => {
    render(<PasswordInput {...defaultProps} />);
    const toggleButton = screen.getByLabelText('Show password');
    expect(toggleButton).toHaveAttribute('title', 'Show password');
    await act(async () => {
      await userEvent.click(toggleButton);
    });
    expect(toggleButton).toHaveAttribute('title', 'Hide password');
  });
});
