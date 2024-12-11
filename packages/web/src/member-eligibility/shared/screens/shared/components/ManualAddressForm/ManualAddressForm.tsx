import React, { ChangeEvent, FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';
import { useOnAddressFieldChanged } from './hooks/UseOnAddressFieldChanged';
import { RegionAddressFields } from './components/RegionAddressFields';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';

interface ManualAddressFormProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const ManualAddressForm: FC<ManualAddressFormProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const handleFieldChange = useOnAddressFieldChanged(eligibilityDetailsState);

  const handleStateSelect = (option: DropdownOption) => {
    handleFieldChange('state', option.id);
  };

  return (
    <div className="flex flex-col w-full gap-[20px]">
      <TextInput
        placeholder="Address line 1"
        name="address-line1"
        value={eligibilityDetails.address?.line1 ?? ''}
        onChange={(error: ChangeEvent<HTMLInputElement>) =>
          handleFieldChange('line1', error.target.value)
        }
        isRequired
      />

      <TextInput
        placeholder="Address line 2 (Optional)"
        name="address-line2"
        value={eligibilityDetails.address?.line2}
        onChange={(error: ChangeEvent<HTMLInputElement>) =>
          handleFieldChange('line2', error.target.value)
        }
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
        onChange={(error: ChangeEvent<HTMLInputElement>) =>
          handleFieldChange('postcode', error.target.value)
        }
        isRequired
      />
    </div>
  );
};
