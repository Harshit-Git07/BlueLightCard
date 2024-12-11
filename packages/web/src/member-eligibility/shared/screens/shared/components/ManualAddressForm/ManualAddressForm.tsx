import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { useOnAddressFieldChanged } from '@/root/src/member-eligibility/shared/screens/shared/components/ManualAddressForm/hooks/UseOnAddressFieldChanged';
import { RegionAddressFields } from './components/RegionAddressFields';

interface ManualAddressFormProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const ManualAddressForm: FC<ManualAddressFormProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const onAddressFieldChanged = useOnAddressFieldChanged(eligibilityDetailsState);

  return (
    <div className="flex flex-col w-full gap-[20px]">
      <TextInput
        placeholder="Address line 1"
        name="address-line1"
        value={eligibilityDetails.address?.line1 ?? ''}
        onChange={(error) => onAddressFieldChanged('line1', error.target.value)}
        required
      />

      <TextInput
        placeholder="Address line 2 (Optional)"
        name="address-line2"
        value={eligibilityDetails.address?.line2}
        onChange={(error) => onAddressFieldChanged('line2', error.target.value)}
      />

      <RegionAddressFields
        address={eligibilityDetails.address}
        onAddressFieldChanged={onAddressFieldChanged}
      />

      <TextInput
        placeholder="Postcode"
        name="postal-code"
        value={eligibilityDetails.address?.postcode}
        onChange={(error) => onAddressFieldChanged('postcode', error.target.value)}
        required
      />
    </div>
  );
};
