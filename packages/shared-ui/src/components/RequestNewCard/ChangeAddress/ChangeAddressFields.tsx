import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react';
import TextInput from '../../TextInput';
import Dropdown from '../../Dropdown';
import { australianStates, britishCounties, countries } from '../../../utils/countries';
import { addressSchema } from './addressSchema';
import { BRAND as envBrand } from '../../../global-vars';
import { BRAND } from '../../../types';
import { Address } from '../requestNewCardTypes';
import { findSelectedOption } from '../../Dropdown/utils/findSelectedOption';
import { generateDropdownOptions } from '../../Dropdown/utils/generateDropdownOptions';

export const isAustralia = envBrand === String(BRAND.BLC_AU);

interface ChangeAddressProps {
  address: Address;
  onChange: (field: keyof Address, value: string) => void;
  setHasErrors: (hasErrors: boolean) => void;
}

const ChangeAddressFields: FC<ChangeAddressProps> = ({ address, onChange, setHasErrors }) => {
  // State to store validation errors
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Memoize the options based on the country (Australia or UK)
  const countySuburbOptions = useMemo(() => {
    const options = isAustralia ? australianStates : britishCounties;
    return options.map((label) => ({ id: label, label }));
  }, [isAustralia]);

  const countryOptions = useMemo(() => generateDropdownOptions(countries), [countries]);

  // Validate a single field
  const validateField = (field: keyof Address, value: string) => {
    const trimmedValue = value.trim();
    const result = addressSchema.safeParse({ ...address, [field]: trimmedValue });
    if (!result.success) {
      const error = result.error.errors.find((err) => err.path[0] === field);
      setErrors((prev) => ({
        ...prev,
        [field]: error ? error.message : undefined,
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle form validation on change
  useEffect(() => {
    const result = addressSchema.safeParse(address);
    setHasErrors(!result.success);
  }, [address, setHasErrors]);

  //Handle default country
  useEffect(() => {
    if (!address.country) {
      const defaultCountry = isAustralia ? 'Australia' : 'United Kingdom';
      onChange('country', defaultCountry);
    }
  }, [address.country, onChange]);

  // Handle country selection
  const handleCountrySelect = (option: { id: string; label: string }) => {
    onChange('country', option.id);
    validateField('country', option.id);
  };

  // Handle county selection
  const handleCountySelect = (option: { id: string; label: string }) => {
    onChange('county', option.id);
    validateField('county', option.id);
  };

  const defaultCountry = isAustralia ? 'Australia' : 'United Kingdom';

  return (
    <>
      <div className="pt-[20px] flex flex-col gap-[20px]">
        <TextInput
          id="address-line-1"
          placeholder="Address line 1"
          value={address.address1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onChange('address1', value);
            validateField('address1', value);
          }}
          isValid={!errors.addressLine1}
          validationMessage={errors.addressLine1}
        />

        <TextInput
          id="address-line-2"
          placeholder="Address line 2"
          value={address.address2}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onChange('address2', value);
            validateField('address2', value);
          }}
          isValid={!errors.addressLine2}
          validationMessage={errors.addressLine2}
        />

        <Dropdown
          value={findSelectedOption(countySuburbOptions, address.county)}
          placeholder={isAustralia ? 'Suburb' : 'County'}
          options={countySuburbOptions.map((option, index) => ({
            ...option,
            key: `${option.id}-${index}`,
          }))}
          onChange={handleCountySelect}
          validationMessage={errors.county}
          isValid={!!errors.county}
        />

        <TextInput
          id="town"
          placeholder="Town/City"
          value={address.city}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onChange('city', value);
            validateField('city', value);
          }}
          isValid={!errors.city}
          validationMessage={errors.city}
        />

        <TextInput
          id="postcode"
          placeholder="Postcode"
          value={address.postcode}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            onChange('postcode', value);
            validateField('postcode', value);
          }}
          isValid={!errors.postcode}
          validationMessage={errors.postcode}
        />

        <Dropdown
          placeholder="Country"
          value={findSelectedOption(countryOptions, address.country ?? defaultCountry)}
          options={countryOptions}
          onChange={handleCountrySelect}
          validationMessage={errors.country}
        />
      </div>
    </>
  );
};

export default ChangeAddressFields;
