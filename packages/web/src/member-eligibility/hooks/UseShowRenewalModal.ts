import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import { AmplitudeExperimentFlags } from '@/utils/amplitude/AmplitudeExperimentFlags';
import { useEffect, useState } from 'react';
import { useMemberProfile } from '@/root/src/member-eligibility/service-layer/member-profile/UseGetMemberProfile';
import { isBefore, differenceInDays, startOfDay } from 'date-fns';
import {
  ServiceLayerMemberProfile,
  ServiceLayerMemberProfileCard,
} from '@/root/src/member-eligibility/service-layer/member-profile/types/ServiceLayerMemberProfile';

interface Result {
  shouldShowRenewalModal: boolean;
  onHideRenewalModal: () => void;
  ifCardExpiredMoreThan30Days: boolean;
}

export function useShowRenewalModal(): Result {
  const [shouldShowRenewalModal, setShouldShowRenewalModal] = useState(false);
  const [ifCardExpiredMoreThan30Days, setIfCardExpiredMoreThan30Days] = useState(false);

  const memberProfile = useMemberProfile();

  const eligibilityEnabled = useAmplitudeExperiment(
    AmplitudeExperimentFlags.MODERN_ELIGIBILITY_ENABLED,
    'off'
  );

  const onHideRenewalModal = () => {
    setShouldShowRenewalModal(false);
  };

  useEffect(() => {
    if (eligibilityEnabled.data?.variantName !== 'on') return;
    if (!memberProfile) return;

    const card = getLatestCard(memberProfile);
    if (!card) return;

    const expiryDate = startOfDay(new Date(card.expiryDate));
    const today = startOfDay(new Date());

    // Check if the card has expired
    const isExpired = isBefore(expiryDate, today);
    setShouldShowRenewalModal(isExpired);

    // Check if the card expired more than 30 days ago
    if (isExpired) {
      const daysSinceExpiry = differenceInDays(today, expiryDate);
      setIfCardExpiredMoreThan30Days(daysSinceExpiry > 30);
    } else {
      setIfCardExpiredMoreThan30Days(false);
    }
  }, [eligibilityEnabled, eligibilityEnabled.data?.variantName, memberProfile]);

  return {
    shouldShowRenewalModal,
    onHideRenewalModal,
    ifCardExpiredMoreThan30Days,
  };
}

function getLatestCard(
  memberProfile: ServiceLayerMemberProfile
): ServiceLayerMemberProfileCard | undefined {
  return memberProfile.cards.at(-1);
}
