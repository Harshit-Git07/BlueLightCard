import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';
import { useAddressFieldUpdater } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/UseAddressFieldUpdater';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { RegionAddressFields } from './components/RegionAddressFields';

interface ManualAddressFormProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const ManualAddressForm: FC<ManualAddressFormProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const handleFieldChange = useAddressFieldUpdater(eligibilityDetailsState);

  const handleStateSelect = (option: DropdownOption) => {
    handleFieldChange('state', option.id);
  };

  return (
    <div className="flex flex-col w-full gap-[20px]">
      <TextInput
        placeholder="Address line 1"
        name="address-line1"
        value={eligibilityDetails.address?.line1 ?? ''}
        onChange={(error) => handleFieldChange('line1', error.target.value)}
        required
      />

      <TextInput
        placeholder="Address line 2 (Optional)"
        name="address-line2"
        value={eligibilityDetails.address?.line2}
        onChange={(error) => handleFieldChange('line2', error.target.value)}
      />

      <RegionAddressFields
        address={eligibilityDetails.address}
        handleFieldChange={handleFieldChange}
        handleStateSelect={handleStateSelect}
      />

      <TextInput
        placeholder="Postcode"
        name="postal-code"
        value={eligibilityDetails.address?.postcode}
        onChange={(error) => handleFieldChange('postcode', error.target.value)}
        required
      />
    </div>
  );
};
