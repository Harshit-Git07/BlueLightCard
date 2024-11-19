import React, { FC } from 'react';
import TextInput from '@bluelightcard/shared-ui/components/TextInput';
import { DropdownOption } from '@bluelightcard/shared-ui/components/Dropdown/types';
import Button from '@bluelightcard/shared-ui/components/Button-V2';
import { ThemeVariant } from '@bluelightcard/shared-ui/types';
import { useAddressFieldUpdater } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/hooks/UseAddressFieldUpdater';
import { useOnAddressSubmitted } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/hooks/UseOnAddressSubmitted';
import { useAddressIsValid } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/hooks/UseAddressIsValid';
import { useOnBack } from './hooks/UseOnBack';
import { RegionAddressFields } from './components/RegionAddressFields';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';

interface ManualAddressFormProps {
  eligibilityDetailsState: EligibilityDetailsState;
}

export const ManualAddressForm: FC<ManualAddressFormProps> = ({ eligibilityDetailsState }) => {
  const [eligibilityDetails] = eligibilityDetailsState;

  const handleFieldChange = useAddressFieldUpdater(eligibilityDetailsState);
  const isValid = useAddressIsValid(eligibilityDetails);
  const handleNext = useOnAddressSubmitted(eligibilityDetailsState);
  const handleBack = useOnBack(eligibilityDetailsState);

  const handleStateSelect = (option: DropdownOption) => {
    handleFieldChange('state', option.id);
  };

  return (
    <>
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

      <div className="flex flex-row items-center justify-between w-full gap-[8px]">
        <Button variant={ThemeVariant.Secondary} size="Large" onClick={handleBack}>
          Back
        </Button>

        <Button size="Large" className="flex-1" onClick={handleNext} disabled={!isValid}>
          Next
        </Button>
      </div>
    </>
  );
};
