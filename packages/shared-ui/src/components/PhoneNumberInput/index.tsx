import { ChangeEvent, FC, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { defaultCountries, ParsedCountry, usePhoneInput } from 'react-international-phone';
import ClickableFlag from './components/ClickableFlag';
import DropdownList from './components/DropdownList';
import FieldLabel from '../FieldLabel';
import { env } from '../../env';
import { colours, fonts, getInputBorderClasses } from '../../tailwind/theme';
import { FieldProps } from '../../types';
import ValidationMessage from '../ValidationMessage';

type Props = FieldProps<(phoneNumber: string) => void, string> & {
  defaultCountry?: string;
  isSelectable?: boolean;
};

const countryLocaleMap: Record<string, string> = {
  'en-GB': 'gb',
  'en-AU': 'au',
};

export const getLocalCountryCode = (): string => {
  const userLocale = (typeof navigator !== 'undefined' ? navigator?.language : null) ?? 'en-GB';
  const countryCode = countryLocaleMap[userLocale];

  if (typeof env.APP_BRAND !== 'undefined') {
    if (env.APP_BRAND === 'blc-uk') {
      return 'gb';
    } else if (env.APP_BRAND === 'blc-au') {
      return 'au';
    }
  }

  return countryCode || 'gb';
};

const PhoneNumberInputDataManager: FC<Props> = ({
  id,
  value: phoneNumber,
  onChange,
  isDisabled,
  defaultCountry,
  label = '',
  description = '',
  isSelectable = true,
  validationMessage,
  isValid,
}) => {
  const { inputValue, handlePhoneValueChange, country } = usePhoneInput({
    defaultCountry: defaultCountry ?? getLocalCountryCode(),
    value: phoneNumber,
    disableDialCodePrefill: true,
    disableDialCodeAndPrefix: true,
    onChange: ({ phone }) => {
      onChange && onChange(phone);
    },
  });

  const [dialCode] = useState(`+${country.dialCode}`);
  const randomId = useId();
  const elementId = id ?? randomId;

  return (
    <PhoneNumberInputWrapper>
      <FieldLabel
        htmlFor={elementId}
        label={isDisabled ? '' : label}
        tooltip={isDisabled ? '' : description}
      />
      <PhoneNumberInput
        id={elementId}
        isDisabled={isDisabled}
        dialCode={dialCode}
        value={inputValue}
        onChange={handlePhoneValueChange}
        selectedCountry={country}
        isValid={isValid}
        validationMessage={validationMessage}
        isSelectable={isSelectable}
      />
    </PhoneNumberInputWrapper>
  );
};

type WrapperProps = { children: ReactNode };

const PhoneNumberInputWrapper: FC<WrapperProps> = ({ children }) => (
  <div className="w-full flex flex-col">{children}</div>
);

type InputProps = FieldProps & {
  dialCode: string;
  selectedCountry: ParsedCountry;
  isSelectable?: boolean;
};

const PhoneNumberInput: FC<InputProps> = ({
  id,
  selectedCountry,
  value: phoneNumber,
  onChange,
  isDisabled: disabled,
  validationMessage,
  isValid,
  isSelectable,
}) => {
  const randomId = useId();
  const elementId = id ?? randomId;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
    setDropdownOpen(false);

    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const itemOnClick = (country: ParsedCountry) => {
    setDropdownOpen(false);

    const updatedPhonenumber = `+${country.dialCode}${phoneNumber}`;

    const phoneNumberChangeEvent = {
      target: { value: updatedPhonenumber },
      preventDefault: () => {},
      nativeEvent: new Event('change'),
    } as ChangeEvent<HTMLInputElement>;

    onChange && onChange(phoneNumberChangeEvent);
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

  const borderClasses = getInputBorderClasses(!!disabled, isInputFocused, isValid);

  return (
    <div className={`relative`} ref={containerRef}>
      <span
        className={`flex pl-4 items-center ${borderClasses} ${disabled && colours.backgroundSurfaceContainer}`}
      >
        <ClickableFlag
          country={selectedCountry}
          isSelectable={isSelectable}
          isOpen={dropdownOpen}
          disabled={disabled}
          className={`${disabled && 'opacity-10'} min-w-12`}
          toggleDropdown={toggleDropdown}
        />
        <p
          className={`ml-1 mr-2 ${fonts.bodyLarge}
           ${
             disabled
               ? `${colours.textOnSurfaceDisabled}`
               : 'text-colour-surface-dark dark:text-colour-surface-light'
           }`}
        >{`+${selectedCountry.dialCode ?? 'XX'}`}</p>
        <input
          id={id}
          className={`outline-none py-3 pr-4 w-full
            ${disabled && colours.textOnSurfaceDisabled} ${fonts.bodyLarge}
           ${
             disabled
               ? `${colours.textOnSurfaceDisabled} opacity-10`
               : 'text-colour-surface-dark dark:text-colour-surface-light'
           } bg-transparent
           `}
          type="tel"
          disabled={disabled}
          value={phoneNumber}
          placeholder="000000000"
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
          className={`z-50 border rounded-b-md ${
            isInputFocused || dropdownOpen
              ? 'border-colour-primary dark:border-colour-primary-dark'
              : 'border-onSurface-outline dark:border-onSurface-outline-dark'
          }`}
        />
      )}

      <ValidationMessage
        message={validationMessage}
        htmlFor={elementId}
        isValid={isValid}
        isDisabled={disabled ?? false}
      />
    </div>
  );
};

export default PhoneNumberInputDataManager;
