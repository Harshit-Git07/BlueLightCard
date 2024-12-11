import PhoneNumberInput from '../../PhoneNumberInput';
import { copy } from '../copy';
import { BRAND, Dropdown } from '../../../index';
import { PersonalDetailsFormState } from '../hooks/usePersonalDetailsState';
import { FC } from 'react';
import { countiesUKDropdownOptions, statesAUDropdownOptions } from '../constants';
import { DropdownOption } from '../../Dropdown/types';
import { BRAND as envBrand } from '@/global-vars';

const regionOptions =
  envBrand === String(BRAND.BLC_AU) ? statesAUDropdownOptions : countiesUKDropdownOptions;

type PhoneNumberRegionSectionProps = {
  phoneNumber: PersonalDetailsFormState['phoneNumber'];
  onPhoneNumberChange: (phoneNumber: string) => void;
  region: PersonalDetailsFormState['region'];
  onRegionChange: (region: DropdownOption) => void;
};

export const PhoneNumberRegionSection: FC<PhoneNumberRegionSectionProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  region,
  onRegionChange,
}) => {
  return (
    <>
      <PhoneNumberInput
        onChange={onPhoneNumberChange}
        label={copy.phoneNumberLabel}
        isSelectable
        disabled={phoneNumber.disabled}
        value={phoneNumber.value}
      />
      <Dropdown
        options={regionOptions}
        value={region.value}
        searchable
        onChange={onRegionChange}
        placeholder={copy.county.placeholder}
        isDisabled={region.disabled}
        label={copy.county.label}
        tooltip={copy.county.tooltip}
        maxItemsShown={4}
      />
    </>
  );
};
