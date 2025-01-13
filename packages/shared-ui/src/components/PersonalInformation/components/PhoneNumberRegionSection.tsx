import PhoneNumberInput from '../../PhoneNumberInput';
import { copy } from '../copy';
import { BRAND } from '../../../types';
import { PersonalInfoFormState } from '../hooks/usePersonalInfoState';
import { FC } from 'react';
import { countiesUKDropdownOptions, statesAUDropdownOptions } from '../constants';
import { BRAND as envBrand } from '../../../global-vars';
import Dropdown from '../../../components/MyAccountDuplicatedComponents/Dropdown';
import { DropdownOption } from '../../MyAccountDuplicatedComponents/Dropdown/types';

const regionOptions =
  envBrand === String(BRAND.BLC_AU) ? statesAUDropdownOptions : countiesUKDropdownOptions;

type PhoneNumberRegionSectionProps = {
  phoneNumber: PersonalInfoFormState['phoneNumber'];
  onPhoneNumberChange: (phoneNumber: string) => void;
  region: PersonalInfoFormState['region'];
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
        value={phoneNumber.value}
        onChange={onPhoneNumberChange}
        label={copy.phoneNumberLabel}
        isSelectable
        isDisabled={phoneNumber.disabled}
        isValid={!phoneNumber.error}
        validationMessage={phoneNumber.error}
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
        tooltipPosition="right"
        maxItemsShown={4}
      />
    </>
  );
};
