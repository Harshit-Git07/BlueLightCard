import { AmplitudeEvent } from '@/root/src/member-eligibility/shared/amplitude-events/AmplitudeEvents';
import { usePlatformAdapter } from '@bluelightcard/shared-ui/adapters';
import { useCallback } from 'react';

type Callback = (amplitudeEvent: AmplitudeEvent) => void;

export function useLogAmplitudeEvent(): Callback {
  const platformAdapter = usePlatformAdapter();

  return useCallback(
    (amplitudeEvent) => {
      platformAdapter.logAnalyticsEvent(amplitudeEvent.event, amplitudeEvent.params);
      console.log('Sends Events to Amplitude', amplitudeEvent);
    },
    [platformAdapter]
  );
}
