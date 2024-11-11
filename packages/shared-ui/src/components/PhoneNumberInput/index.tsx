import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import {
  CountryIso2,
  defaultCountries,
  ParsedCountry,
  usePhoneInput,
} from 'react-international-phone';
import ClickableFlag from './ClickableFlag';
import DropdownList from './DropdownList';
import InfoWrapper from '../InfoWrapper';
import { env } from '../../env';

type Props = {
  id?: string;
  disabled?: boolean;
  showErrors?: boolean;
  defaultCountry?: string;
  emptyErrorMessage?: string;
  invalidErrorMessage?: string;
  label?: string;
  helpText?: string;
  messageText?: string;
  isSelectable?: boolean;
  onChange?: (dialCode: string, phoneNumber: string) => void;
};

const countryLocaleMap: Record<string, string> = {
  'en-GB': 'gb',
  'en-AU': 'au',
};

export const getLocalCountryCode = (): string => {
  const userLocale = navigator.language || 'en-US';
  const countryCode = countryLocaleMap[userLocale];

  if (typeof env.APP_BRAND !== 'undefined') {
    if (env.APP_BRAND === 'blc-uk') {
      return 'gb';
    } else if (env.APP_BRAND === 'blc-au') {
      return 'au';
    }
  }

  return countryCode || 'us';
};

const PhoneNumberInputDataManager: FC<Props> = ({
  id,
  disabled,
  showErrors = false,
  defaultCountry,
  emptyErrorMessage = 'Please enter a phone number',
  invalidErrorMessage = 'Please enter a valid phone number',
  label = '',
  helpText = '',
  messageText,
  isSelectable = false,
  onChange,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: defaultCountry ?? getLocalCountryCode(),
    value: phoneNumber,
    disableDialCodePrefill: true,
    disableDialCodeAndPrefix: true,
    onChange: ({ phone }) => {
      setPhoneNumber(phone);
    },
  });

  const [dialCode, setDialCode] = useState(`+${country.dialCode}`);
  const randomId = useId();
  const elementId = id ?? randomId;

  console.log({ PhoneNumberInputDataManager: elementId });

  return (
    <PhoneNumberInputWrapper>
      <InfoWrapper
        htmlFor={elementId}
        label={disabled ? '' : label}
        helpText={disabled ? '' : helpText}
      >
        <PhoneNumberInput
          id={elementId}
          disabled={disabled}
          dialCode={dialCode}
          setDialCode={setDialCode}
          phoneNumber={inputValue}
          setPhoneNumber={handlePhoneValueChange}
          selectedCountry={country}
          setSelectedCountry={setCountry}
          showErrors={showErrors}
          emptyErrorMessage={emptyErrorMessage}
          invalidErrorMessage={invalidErrorMessage}
          messageText={messageText}
          isSelectable={isSelectable}
          onChange={onChange}
        />
      </InfoWrapper>
    </PhoneNumberInputWrapper>
  );
};

type WrapperProps = { children: ReactNode };

const PhoneNumberInputWrapper: FC<WrapperProps> = ({ children }) => (
  <div className="max-w-[524px] flex gap-2 flex-col">{children}</div>
);

type InputProps = {
  id?: string;
  dialCode: string;
  setDialCode: (dialCode: string) => void;
  selectedCountry: ParsedCountry;
  setSelectedCountry: (country: CountryIso2) => void;
  disabled?: boolean;
  showErrors?: boolean;
  phoneNumber: string;
  setPhoneNumber: ChangeEventHandler<HTMLInputElement>;
  emptyErrorMessage: string;
  invalidErrorMessage: string;
  messageText?: string;
  isSelectable?: boolean;
  onChange?: (dialCode: string, phoneNumber: string) => void;
};

const PhoneNumberInput: FC<InputProps> = ({
  id,
  dialCode,
  setDialCode,
  selectedCountry,
  phoneNumber,
  setPhoneNumber,
  setSelectedCountry,
  disabled,
  showErrors,
  invalidErrorMessage,
  emptyErrorMessage,
  messageText,
  isSelectable,
  onChange,
}) => {
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullyEntered, setIsFullyEntered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {}, [isFullyEntered]);

  const validatePhoneNumber = () => {
    const fullPhoneNumber = `${dialCode}${phoneNumber}`;

    if (!phoneNumber || !fullPhoneNumber) {
      setPhoneNumberError(emptyErrorMessage);
      return;
    }

    const parsedNumber = parsePhoneNumberFromString(fullPhoneNumber);

    if (!parsedNumber?.isValid()) {
      setPhoneNumberError(invalidErrorMessage);
    } else {
      setPhoneNumberError(null);
    }
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e;
    setPhoneNumber(newPhoneNumber);
    setDropdownOpen(false);

    if (!hasInteracted) {
      setHasInteracted(true);
    }

    if (newPhoneNumber.target.value.length >= 10) {
      setIsFullyEntered(true);
    } else {
      setIsFullyEntered(false);
      setPhoneNumberError(null);
    }

    if (onChange) {
      onChange(dialCode, newPhoneNumber.target.value);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    validatePhoneNumber();
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const itemOnClick = (country: ParsedCountry) => {
    setDropdownOpen(false);
    setSelectedCountry(country.iso2);
    setDialCode(`+${country.dialCode}`);
  };

  const calculateDialCodeWidth = () => {
    const baseWidth = 25;
    const extraWidthPerChar = 10;
    const dialCodeLength = dialCode.length;

    return `${baseWidth + (dialCodeLength - 2) * extraWidthPerChar}px`;
  };

  const handleDialCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    let newDialCode = e.target.value;

    setDropdownOpen(false);
    newDialCode = newDialCode.replace(/[^\d+]/g, '');
    if (newDialCode && !newDialCode.startsWith('+')) {
      newDialCode = `+${newDialCode.replace(/\D/g, '')}`;
    }
    newDialCode = newDialCode.length > 1 ? newDialCode.slice(0, 5) : newDialCode;
    setDialCode(newDialCode);

    if (newDialCode === '+1') {
      setSelectedCountry('us');
      return;
    }

    const country = defaultCountries.find(([, , code]) => `+${code}` === newDialCode);

    if (country) {
      setSelectedCountry(country[1]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  const renderMessage = () => {
    if (showErrors && phoneNumberError) {
      return (
        <p className="text-colour-error-light dark:text-colour-error-dark pt-2 text-typography-body-small font-typography-body-small-weight leading-typography-body-small font-typography-body-small">
          {phoneNumberError}
        </p>
      );
    }

    if (messageText) {
      const messageClassName =
        isInputFocused || dropdownOpen
          ? 'text-colour-primary-light dark:text-colour-primary-dark'
          : 'text-colour-onSurface-subtle-light dark:text-colour-onSurface-subtle-dark';

      return (
        <p
          className={`${messageClassName} pt-2 text-typography-body-small font-typography-body-small-weight leading-typography-body-small font-typography-body-small`}
        >
          {messageText}
        </p>
      );
    }

    return null;
  };

  console.log({ PhoneNumberInput: id });

  return (
    <div className="relative" ref={containerRef}>
      <span
        className={`flex items-center gap-2 px-5 border rounded bg-colour-surface-brand-light dark:bg-colour-surface-brand-dark 
          ${
            isInputFocused || dropdownOpen
              ? 'border-colour-primary-light dark:border-colour-primary-dark'
              : 'border-onSurface-outline-light dark:border-onSurface-outline-dark'
          } 
        ${disabled && 'bg-colour-surface-container-disabled-light dark: bg-colour-surface-container-disabled-dark'} 
        ${showErrors && phoneNumberError && 'border-colour-error-light dark:border-colour-error-dark'}`}
      >
        <ClickableFlag
          country={selectedCountry}
          isSelectable={isSelectable}
          isOpen={dropdownOpen}
          disabled={disabled}
          className={`${disabled && 'opacity-10'} `}
          toggleDropdown={toggleDropdown}
        />
        <input
          className={`outline-none rounded ml-2 
          text-typography-body-large font-typography-body-large-weight leading-typography-body-large font-typography-body-large 
          bg-colour-surface-light dark:bg-colour-surface-dark 
           ${disabled ? 'text-colour-onSurface-disabled-light dark:text-colour-onSurface-disabled-dark' : 'text-colour-surface-dark dark:text-colour-surface-light'}`}
          type="tel"
          value={dialCode}
          disabled={disabled}
          placeholder="+XX"
          onChange={handleDialCodeChange}
          style={{ width: dialCode ? calculateDialCodeWidth() : '35px' }}
          onFocus={handleInputFocus}
        />
        <input
          id={id}
          className={`outline-none w-full py-3 mr-2 rounded 
            ${disabled && 'text-colour-onSurface-disabled'} 
            text-typography-body-large font-typography-body-large-weight leading-typography-body-large font-typography-body-large
           ${disabled ? 'text-colour-onSurface-disabled-light dark:text-colour-onSurface-disabled-dark opacity-10' : 'text-colour-surface-dark dark:text-colour-surface-light'}
            bg-colour-surface-brand-light dark:bg-colour-surface-brand-dark`}
          type="tel"
          disabled={disabled}
          value={phoneNumber}
          placeholder="XXXXXXXXXX"
          onChange={handlePhoneNumberChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </span>
      {isSelectable && dropdownOpen && (
        <DropdownList
          dropdownOpen={dropdownOpen}
          listOfCountries={defaultCountries}
          selectedCountryCode={selectedCountry.iso2}
          itemOnClick={itemOnClick}
          className={`border rounded-b-lg ${
            isInputFocused || dropdownOpen
              ? 'border-colour-primary dark:border-colour-primary-dark'
              : 'border-onSurface-outline dark:border-onSurface-outline-dark'
          }`}
        />
      )}
      {renderMessage()}
    </div>
  );
};

export default PhoneNumberInputDataManager;
