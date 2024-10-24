import React, { act } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PasswordInput, { Props } from './';
import userEvent from '@testing-library/user-event';

jest.spyOn(React, 'useId').mockImplementation(() => 'mocked-id');

describe('PasswordInput Component', () => {
  const onChangeMock = jest.fn();
  const defaultProps: Props = {
    onChange: onChangeMock,
    isValid: undefined,
    hideRequirements: false,
    password: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    render(
      <PasswordInput
        {...defaultProps}
        label="FieldName"
        helpMessage="Description"
        infoMessage="InfoOnlyShowsWithInPut"
        showIcon
        isDisabled={false}
      />,
    );
    expect(screen.getByText('FieldName')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.queryByText('InfoOnlyShowsWithInPut')).toBeNull();
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    render(<PasswordInput {...defaultProps} />);

    const eyeButton = screen.getByLabelText('Show password');
    const input = screen.getByLabelText('Password');

    expect(input).toHaveAttribute('type', 'password');

    await act(async () => {
      await userEvent.click(eyeButton);
    });

    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange on input change and sets dirty state', async () => {
    render(<PasswordInput {...defaultProps} isValid={false} infoMessage="Password is invalid" />);

    const input = screen.getByLabelText('Password');

    await act(async () => {
      await userEvent.type(input, 'password123');
    });

    expect(onChangeMock).toHaveBeenCalledWith('password123');
    expect(screen.getByRole('alert')).toHaveTextContent('Password is invalid');
  });

  it('shows and hides validation rules on focus and blur', async () => {
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('Password');

    // Initially, rules should not be visible
    expect(screen.queryByText('Your password must contain:')).toBeNull();

    // Focus event should show rules
    await act(async () => {
      await userEvent.click(input);
    });
    expect(screen.getByText('Your password must contain:')).toBeInTheDocument();

    // Blur event should hide rules
    await act(async () => {
      await userEvent.tab();
    });
    expect(screen.queryByText('Your password must contain:')).toBeNull();

    // Form dirty state should keep rules visible
    await act(async () => {
      await userEvent.type(input, 'password123');
    });
    expect(screen.getByText('Your password must contain:')).toBeInTheDocument();
  });

  it('disables input and interactions when isDisabled is true', async () => {
    render(<PasswordInput {...defaultProps} isDisabled={true} />);

    const input = screen.getByLabelText('Password');
    expect(input).toBeDisabled();

    const eyeButton = screen.getByLabelText('Show password');
    await act(async () => {
      await userEvent.click(eyeButton);
    });
    expect(input).toHaveAttribute('type', 'password'); // No change since input is disabled
  });

  it('does not render password requirements if hideRequirements is true', async () => {
    render(<PasswordInput {...defaultProps} hideRequirements={true} />);

    const input = screen.getByLabelText('Password');
    await act(async () => {
      await userEvent.click(input);
    });

    expect(screen.queryByText('Your password must contain:')).toBeNull();
  });

  it('renders password requirements if hideRequirements is false', async () => {
    render(<PasswordInput {...defaultProps} />);

    const input = screen.getByLabelText('Password');
    await act(async () => {
      await userEvent.click(input);
    });

    expect(screen.getByText('Your password must contain:')).toBeInTheDocument();
  });

  it('does not render icon if showIcon is false', () => {
    render(<PasswordInput {...defaultProps} showIcon={false} />);

    expect(screen.queryByLabelText('Information icon')).toBeNull();
  });

  it('does not render icon if label is empty', () => {
    render(<PasswordInput {...defaultProps} label="" />);

    expect(screen.queryByLabelText('Information icon')).toBeNull();
  });

  it('renders icon wih a title prefixed with the value of label', () => {
    render(<PasswordInput {...defaultProps} label="prefix" />);

    expect(screen.queryByLabelText('prefix Information')).toBeInTheDocument();
  });

  test('sets aria-invalid to true when the password is invalid', () => {
    render(<PasswordInput {...defaultProps} isValid={false} />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('does not set aria-invalid when the password is valid', () => {
    render(<PasswordInput {...defaultProps} isValid />);
    const input = screen.getByLabelText('Password');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('does not set aria-invalid when the password is undefined', () => {
    render(<PasswordInput {...defaultProps} isValid={undefined} />);
    const input = screen.getByLabelText('Password');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  test('applies aria-describedby when helpMessage is provided', () => {
    render(<PasswordInput {...defaultProps} isValid helpMessage="This is a help message" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('aria-describedby', 'helpMessage-mocked-id');
  });

  test('does not apply aria-describedby when helpMessage is not provided', () => {
    render(<PasswordInput {...defaultProps} isValid />);
    const input = screen.getByLabelText('Password');
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  test('displays validation message with role alert and aria-live', async () => {
    render(<PasswordInput {...defaultProps} isValid infoMessage="Password is invalid" />);

    const input = screen.getByLabelText('Password');

    // Type a password
    await act(async () => {
      await userEvent.type(input, '123pass');
    });

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Password is invalid');
  });

  test('applies correct title to the eye icon button', async () => {
    render(<PasswordInput {...defaultProps} isValid />);
    const toggleButton = screen.getByLabelText('Show password');
    expect(toggleButton).toHaveAttribute('title', 'Show password');
    await act(async () => {
      await userEvent.click(toggleButton);
    });
    expect(toggleButton).toHaveAttribute('title', 'Hide password');
  });
});
