import {
  AusAddress,
  EligibilityDetailsAddress,
} from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';

export function isAusAddress(
  address: EligibilityDetailsAddress | undefined
): address is AusAddress {
  return address !== undefined && 'state' in address;
}
