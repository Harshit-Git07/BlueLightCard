import { useCallback } from 'react';
import { isAusAddress } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/hooks/utils/AddressType';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import {
  AusAddress,
  EligibilityDetailsAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';

type UkOrAusAddress = UkAddress & AusAddress;

export function useAddressFieldUpdater(
  eligibilityDetailsState: EligibilityDetailsState
): (field: keyof UkOrAusAddress, value: string) => void {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return useCallback(
    (field: keyof UkOrAusAddress, value: string) => {
      const currentAddress = eligibilityDetails.address;

      const baseAddress: EligibilityDetailsAddress = {
        line1: currentAddress?.line1 ?? '',
        line2: currentAddress?.line2 ?? '',
        city: currentAddress?.city ?? '',
        postcode: currentAddress?.postcode ?? '',
        ...(isAusAddress(currentAddress) ? { state: currentAddress.state } : {}),
      };

      const newAddress: EligibilityDetailsAddress = {
        ...baseAddress,
        [field]: value,
      };

      setEligibilityDetails({
        ...eligibilityDetails,
        address: newAddress,
      });
    },
    [eligibilityDetails, setEligibilityDetails]
  );
}
