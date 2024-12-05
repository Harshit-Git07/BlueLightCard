import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { EligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/types/eligibliity-details/EligibilityDetails';
import { useGetMemberProfile } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/service-layer/UseGetMemberProfile';
import { mapToEligibilityDetails } from '@/root/src/member-eligibility/shared/hooks/use-eligibility-details/mapper/MapToEligibilityDetails';
import AuthContext from '@/context/Auth/AuthContext';

export type EligibilityDetailsState = [
  EligibilityDetails,
  Dispatch<SetStateAction<EligibilityDetails>>
];

export function useEligibilityDetails(initialState: EligibilityDetails): EligibilityDetailsState {
  const [eligibilityDetails, setEligibilityDetails] = useState(initialState);

  const { isReady } = useContext(AuthContext);
  const getMemberProfile = useGetMemberProfile();

  useEffect(() => {
    if (!isReady) return;

    (async () => {
      const memberProfile = await getMemberProfile();
      if (!memberProfile) {
        console.error('Failed to get member profile');
        return;
      }
      console.log('Member profile', memberProfile);

      setEligibilityDetails({
        ...initialState,
        ...(await mapToEligibilityDetails(memberProfile)),
      });
    })().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  return [eligibilityDetails, setEligibilityDetails];
}
