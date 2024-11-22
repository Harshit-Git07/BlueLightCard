import { useMemo } from 'react';
import { EligibilityDetailsState } from '@/root/src/member-eligibility/shared/screens/shared/types/VerifyEligibilityScreenProps';
import { useAddressIsValid } from '@/root/src/member-eligibility/sign-up/screens/delivery-address-screen/hooks/UseAddressIsValid';

export function useAccountDetailsValid(eligibilityDetailsState: EligibilityDetailsState): boolean {
  const [eligibilityDetails] = eligibilityDetailsState;
  const addressIsValid = useAddressIsValid(eligibilityDetailsState);

  return useMemo(() => {
    const member = eligibilityDetails.member;
    if (!member) return false;

    const memberFieldsValid = Boolean(
      member.firstName?.trim() && member.surname?.trim() && member.dob
    );

    return addressIsValid && memberFieldsValid;
  }, [eligibilityDetails.member, addressIsValid]);
}
