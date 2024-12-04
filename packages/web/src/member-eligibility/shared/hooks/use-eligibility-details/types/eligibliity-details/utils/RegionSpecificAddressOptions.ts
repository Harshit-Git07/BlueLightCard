import {
  AusAddress,
  EligibilityDetailsAddress,
  UkAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { isAusAddress } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/utils/IsAusAddress';

export function regionSpecificAddressOptions(
  address: EligibilityDetailsAddress | undefined
): Pick<AusAddress, 'state'> | Pick<UkAddress, 'county'> {
  if (!address) {
    return {
      county: '',
    };
  }

  if (isAusAddress(address)) {
    return {
      state: address.state,
    };
  }

  return {
    county: address.county,
  };
}
