import { useMemo } from 'react';
import { useIsAusBrand } from '@/root/src/member-eligibility/shared/hooks/use-is-aus-brand/UseIsAusBrand';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import { isAusAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/IsAusAddress';

export function useAddressIsValid(eligibilityDetailsState: EligibilityDetailsState): boolean {
  const [eligibilityDetails] = eligibilityDetailsState;
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
