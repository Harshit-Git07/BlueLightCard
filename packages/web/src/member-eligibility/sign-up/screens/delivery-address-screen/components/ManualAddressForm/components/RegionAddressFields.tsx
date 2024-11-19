import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import Dropdown from '@bluelightcard/shared-ui/components/Dropdown';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';
import {
  AusAddress,
  EligibilityDetailsAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { australianStates } from '@/root/src/member-eligibility/shared/constants/AusStates';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';

interface RegionAddressFieldsProps {
  address?: EligibilityDetailsAddress;
  handleFieldChange: (field: keyof (UkAddress & AusAddress), value: string) => void;
  handleStateSelect: (option: DropdownOption) => void;
}

export const RegionAddressFields: FC<RegionAddressFieldsProps> = ({
  address,
  handleFieldChange,
  handleStateSelect,
}) => {
  const isAus = useIsAusBrand();

  if (isAus) {
    return (
      <>
        <TextInput
          placeholder="Suburb"
          name="address-level2"
          value={address?.city ?? ''}
          onChange={(error) => handleFieldChange('city', error.target.value)}
          required
        />

        <Dropdown
          onSelect={handleStateSelect}
          options={australianStates}
          selectedValue={(address as AusAddress)?.state ?? ''}
          placeholder="State"
          maxItemsShown={5}
          searchable={true}
        />
      </>
    );
  }

  return (
    <TextInput
      placeholder="City"
      name="address-level3"
      value={address?.city ?? ''}
      onChange={(error) => handleFieldChange('city', error.target.value)}
      required
    />
  );
};
