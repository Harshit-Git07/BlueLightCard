import { useCallback } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/UseEligibilityDetails';
import {
  AusAddress,
  EligibilityDetailsAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { regionSpecificAddressOptions } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/RegionSpecificAddressOptions';

type AddressFields = keyof (UkAddress & AusAddress);
export type OnAddressFieldChanged = (field: AddressFields, value: string) => void;

export function useOnAddressFieldChanged(
  eligibilityDetailsState: EligibilityDetailsState
): OnAddressFieldChanged {
  const [eligibilityDetails, setEligibilityDetails] = eligibilityDetailsState;

  return useCallback(
    (field, value) => {
      const currentAddress = eligibilityDetails.address;

      const baseAddress: EligibilityDetailsAddress = {
        line1: currentAddress?.line1 ?? '',
        line2: currentAddress?.line2 ?? '',
        city: currentAddress?.city ?? '',
        postcode: currentAddress?.postcode ?? '',
        ...regionSpecificAddressOptions(currentAddress),
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
