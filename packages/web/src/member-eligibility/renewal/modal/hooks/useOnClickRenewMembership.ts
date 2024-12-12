import { renewalEvents } from '@/root/src/member-eligibility/renewal/modal/amplitude-events/RenewalEvents';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function useOnClickRenewMembership() {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();

  platformAdapter.logAnalyticsEvent(
    renewalEvents.onClickRenewMembership.event,
    renewalEvents.onClickRenewMembership.params
  );

  return useCallback(() => {
    router.push('/renewal');
  }, [router]);
}
