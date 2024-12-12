import { useEffect, useState } from 'react';
import { isBefore, differenceInDays, startOfDay } from 'date-fns';
import { useMemberProfile } from '../service-layer/member-profile/UseGetMemberProfile';
import { usePlatformAdapter } from '../../adapters';
import { eligibilityFeatureFlagKey } from '../constants/FeatureFlags';

interface Result {
  shouldShowRenewalModal: boolean;
  onHideRenewalModal: () => void;
  ifCardExpiredMoreThan30Days: boolean;
}

export function useShowRenewalModal(): Result {
  const [shouldShowRenewalModal, setShouldShowRenewalModal] = useState(false);
  const [ifCardExpiredMoreThan30Days, setIfCardExpiredMoreThan30Days] = useState(false);

  const memberProfile = useMemberProfile();

  const platformAdapter = usePlatformAdapter();

  const eligibilityFeatureFlag = platformAdapter.getAmplitudeFeatureFlag(eligibilityFeatureFlagKey);

  const onHideRenewalModal = () => {
    setShouldShowRenewalModal(false);
  };

  useEffect(() => {
    if (eligibilityFeatureFlag !== 'on') return;
    if (!memberProfile?.card?.expiryDate) return;

    const expiryDate = startOfDay(new Date(memberProfile.card.expiryDate));
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
  }, [eligibilityFeatureFlag, memberProfile?.card?.expiryDate]);

  return { shouldShowRenewalModal, onHideRenewalModal, ifCardExpiredMoreThan30Days };
}
