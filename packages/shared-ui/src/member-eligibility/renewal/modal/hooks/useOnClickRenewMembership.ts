import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatformAdapter } from '../../../../adapters';
import { renewalEvents } from '../amplitude-events/RenewalEvents';

export function useOnClickRenewMembership() {
  const router = useRouter();
  const platformAdapter = usePlatformAdapter();

  platformAdapter.logAnalyticsEvent(
    renewalEvents.onClickRenewMembership.event,
    renewalEvents.onClickRenewMembership.params,
  );

  return useCallback(() => {
    router.push('/renewal');
  }, [router]);
}
