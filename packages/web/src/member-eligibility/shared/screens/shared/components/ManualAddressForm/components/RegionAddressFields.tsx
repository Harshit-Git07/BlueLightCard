import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import Dropdown from '@bluelightcard/shared-ui/components/Dropdown';
import {
  AusAddress,
  EligibilityDetailsAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { australianStatesDropdownOptions } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/components/constants/AusStates';
import { ukCountyDropdownOptions } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/components/constants/UkCounties';
import { OnAddressFieldChanged } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/UseOnAddressFieldChanged';

interface RegionAddressFieldsProps {
  address?: EligibilityDetailsAddress;
  onAddressFieldChanged: OnAddressFieldChanged;
}

export const RegionAddressFields: FC<RegionAddressFieldsProps> = ({
  address,
  onAddressFieldChanged,
}) => {
  const isAus = useIsAusBrand();

  if (isAus) {
    return (
      <>
        <TextInput
          placeholder="Suburb"
          name="address-level2"
          value={address?.city ?? ''}
          onChange={(error) => onAddressFieldChanged('city', error.target.value)}
          required
        />

        <Dropdown
          onSelect={(option) => {
            onAddressFieldChanged('state', option.label);
          }}
          options={australianStatesDropdownOptions}
          selectedValue={(address as AusAddress)?.state ?? ''}
          placeholder="State"
          maxItemsShown={4}
          searchable
        />
      </>
    );
  }

  return (
    <>
      <TextInput
        placeholder="Town/City"
        name="address-level3"
        value={address?.city ?? ''}
        onChange={(error) => onAddressFieldChanged('city', error.target.value)}
        required
      />

      <Dropdown
        data-testid="county-dropdown"
        onSelect={(option) => {
          onAddressFieldChanged('county', option.label);
        }}
        options={ukCountyDropdownOptions}
        selectedValue={(address as UkAddress)?.county ?? ''}
        placeholder="County"
        maxItemsShown={4}
        searchable
      />
    </>
  );
};
