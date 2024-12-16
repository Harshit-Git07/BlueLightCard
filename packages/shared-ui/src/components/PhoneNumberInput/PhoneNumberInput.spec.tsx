import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PhoneNumberInputDataManager from './';
import { env } from '../../env';

describe('PhoneNumberInput', () => {
  const defaultProps = {
    id: 'my-phone-number',
    disabled: false,
    showErrors: false,
    label: 'Phone Number',
    helpText: 'Enter your phone number',
    helpIcon: true,
    messageText: '',
    onChange: jest.fn(),
    isSelectable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} />);
    const label = screen.getAllByLabelText(/Phone Number/i, {})[0];
    expect(label).toBeInTheDocument();
  });

  it.skip('should render input fields with initial values', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} />);
    const dialCodeInput = screen.getByPlaceholderText('+XX', {});
    const phoneNumberInput = screen.getByPlaceholderText('XXXXXXXXXX', {});

    expect(dialCodeInput).toBeInTheDocument();
    expect(phoneNumberInput).toBeInTheDocument();
    expect(dialCodeInput).toHaveValue('+1');
  });

  it.skip('should handle phone number change', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} />);
    const phoneNumberInput = screen.getByPlaceholderText('XXXXXXXXXX', {});

    fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    expect(phoneNumberInput).toHaveValue('(123) 456-7890');
  });

  it.skip('should show error when phone number is invalid', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} showErrors={true} />);
    const phoneNumberInput = screen.getByPlaceholderText('XXXXXXXXXX', {});

    fireEvent.change(phoneNumberInput, { target: { value: '123' } });
    fireEvent.blur(phoneNumberInput);

    expect(screen.getByText(/Please enter a valid phone number/i, {})).toBeInTheDocument();
  });

  it.skip('should show empty error message when no phone number is entered', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} showErrors={true} />);
    const phoneNumberInput = screen.getByPlaceholderText('XXXXXXXXXX', {});

    fireEvent.change(phoneNumberInput, { target: { value: '' } });
    fireEvent.blur(phoneNumberInput);

    expect(screen.getByText(/Please enter a phone number/i, {})).toBeInTheDocument();
  });

  it('should handle dial code change', async () => {
    render(<PhoneNumberInputDataManager {...defaultProps} />);
    const dialCodeInput = screen.getByPlaceholderText('XX', {});

    fireEvent.change(dialCodeInput, { target: { value: '44' } });
    await waitFor(() => expect(defaultProps.onChange).toHaveBeenCalledWith('(44)'));
  });

  it('should not allow interaction when disabled', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} disabled={true} />);
    const phoneNumberInput = screen.getByPlaceholderText('000000000', {});
    expect(phoneNumberInput).toBeDisabled();
  });

  it('should open and close country dropdown on flag click', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} />);

    const countryButton = screen.getByRole('button', { name: /Country selector/i });

    fireEvent.click(countryButton);

    expect(screen.getByLabelText(/Country selector/i, {})).toBeInTheDocument();
  });

  it('should render country dropdown when isSelectable is true', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} isSelectable={true} />);
    const countryButton = screen.getByRole('button', { name: /Country selector/i });
    fireEvent.click(countryButton);
    expect(countryButton).toBeInTheDocument();
    expect(countryButton).toHaveClass('flex flex-row items-center cursor-pointer false');
  });

  it('should not render country dropdown when isSelectable is false', () => {
    render(<PhoneNumberInputDataManager {...defaultProps} isSelectable={false} />);

    const countryButton = screen.queryByRole('button', { name: /Country selector/i });

    expect(countryButton).toHaveClass('flex flex-row items-center cursor-default false');
  });

  describe('returns related to country', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it.skip('returns "gb" for APP_BRAND "blc-uk"', () => {
      env.APP_BRAND = 'blc-uk';
      Object.defineProperty(navigator, 'language', {
        value: 'en-GB',
        configurable: true,
      });

      // expect(getLocalCountryCode()).toBe('gb');
    });

    it.skip('returns "au" for APP_BRAND "blc-au"', () => {
      env.APP_BRAND = 'blc-au';
      Object.defineProperty(navigator, 'language', {
        value: 'en-AU',
        configurable: true,
      });

      // expect(getLocalCountryCode()).toBe('au');
    });
  });
});
