import { useMemo } from 'react';
import { isAusAddress } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/components/ManualAddressForm/hooks/utils/AddressType';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/EligibilityDetails';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';

export function useAddressIsValid(eligibilityDetails: EligibilityDetails): boolean {
  const isAus = useIsAusBrand();

  return useMemo(() => {
    const address = eligibilityDetails.address;
    if (!address) return false;

    const baseFieldsValid = Boolean(
      address.line1?.trim() && address.city?.trim() && address.postcode?.trim()
    );

    if (!isAus) {
      return baseFieldsValid;
    }

    if (!isAusAddress(address)) {
      return false;
    }

    return baseFieldsValid && Boolean(address.state?.trim());
  }, [eligibilityDetails.address, isAus]);
}
