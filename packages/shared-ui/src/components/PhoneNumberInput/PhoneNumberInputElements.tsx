import { defaultCountries, ParsedCountry } from 'react-international-phone';
import { ChangeEvent, ChangeEventHandler, FC, useCallback, useState } from 'react';
import { colours, fonts, getInputBorderClasses } from '../../tailwind/theme';
import ClickableFlag from './components/ClickableFlag';
import DropdownList from './components/DropdownList';
import useClickOutside from '../../hooks/useClickOutside';
import { calculateDialCodeWidth, countriesByDialCode, validatePhoneNumber } from './utils';
import { BRAND as envBrand } from '../../global-vars';
import { BRAND } from '../../types';

type InputProps = {
  id?: string;
  value?: string;
  disabled?: boolean;
  showErrors?: boolean;
  messageText?: string;
  isSelectable?: boolean;
  onChange?: (number: string) => void;
};

const defaultDialCode = envBrand === String(BRAND.BLC_AU) ? '61' : '44';

const PhoneNumberInputElements: FC<InputProps> = ({
  id,
  value,
  disabled,
  showErrors,
  messageText,
  isSelectable,
  onChange,
}) => {
  const dialCode = value?.replace(/\((\d*)\)(.*)/g, '$1').trim();
  const phoneNumber = value?.replace(/\((\d*)\)(.*)/g, '$2').trim();

  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const onClickOutside = useCallback(() => setDropdownOpen(false), []);
  const containerRef = useClickOutside<HTMLDivElement>(onClickOutside);

  const handleChange = (newValue: string) => {
    setDropdownOpen(false);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handlePhoneNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value.replace(/[^\d]/g, '');
    handleChange(`(${dialCode})${newPhoneNumber}`);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    setPhoneNumberError(validatePhoneNumber(dialCode, phoneNumber));
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const itemOnClick = (country: ParsedCountry) => {
    handleChange(`(${country.dialCode})${phoneNumber}`);
  };

  const handleDialCodeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value;
    const newDialCode = v.replace(/[^\d]/g, '').substring(0, 5);
    handleChange(`(${newDialCode})${phoneNumber}`);
  };

  const selectedCountry =
    countriesByDialCode.get(dialCode) ?? countriesByDialCode.get(defaultDialCode);

  const renderMessage = () => {
    if (showErrors && phoneNumberError) {
      return <p className={`${fonts.bodySmall} ${colours.textError} pt-2`}>{phoneNumberError}</p>;
    }

    if (messageText) {
      const messageClassName =
        isInputFocused || dropdownOpen ? colours.textPrimary : colours.textOnSurfaceSubtle;

      return <p className={`${messageClassName} ${fonts.bodySmall} pt-2`}>{messageText}</p>;
    }

    return null;
  };

  const borderClasses = getInputBorderClasses(!!disabled, isInputFocused, !showErrors);

  return (
    <div className={`relative`} ref={containerRef}>
      <span
        className={`flex items-center gap-2 px-5 ${borderClasses} ${disabled && colours.backgroundSurfaceContainer}`}
      >
        <ClickableFlag
          iso2={selectedCountry.iso2}
          name={selectedCountry.name}
          isSelectable={isSelectable}
          isOpen={dropdownOpen}
          disabled={disabled}
          className={`${disabled && 'opacity-10'} `}
          toggleDropdown={toggleDropdown}
        />
        <span className={`inline-flex items-center`}>
          <span className={fonts.bodyLarge}>+</span>
          <input
            className={`bg-transparent outline-none ml-1 ${fonts.bodyLarge}
           ${
             disabled
               ? `${colours.textOnSurfaceDisabled}`
               : 'text-colour-surface-dark dark:text-colour-surface-light'
           }`}
            type="tel"
            value={dialCode}
            disabled={disabled}
            placeholder="XX"
            onChange={handleDialCodeChange}
            style={{ width: dialCode ? calculateDialCodeWidth(dialCode) : '35px' }}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </span>
        <input
          id={id}
          className={`outline-none w-full py-3 mr-2 rounded 
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
      {isSelectable && dropdownOpen ? (
        <DropdownList
          dropdownOpen={dropdownOpen}
          listOfCountries={defaultCountries}
          selectedCountryCode={selectedCountry ? selectedCountry.iso2 : 'gb'}
          itemOnClick={itemOnClick}
          className={`z-50 border rounded-b-md ${
            isInputFocused || dropdownOpen
              ? 'border-colour-primary dark:border-colour-primary-dark'
              : 'border-onSurface-outline dark:border-onSurface-outline-dark'
          }`}
        />
      ) : null}
      {renderMessage()}
    </div>
  );
};

export default PhoneNumberInputElements;
