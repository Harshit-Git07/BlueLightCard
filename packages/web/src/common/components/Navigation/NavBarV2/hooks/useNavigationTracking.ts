import { useContext } from 'react';
import AmplitudeContext from '../../../../context/AmplitudeContext';
import UserContext from '../../../../context/User/UserContext';
import { Amplitude } from '@/utils/amplitude/amplitude';
import { Logger } from '@/root/src/services/Logger';
import * as amplitudeAnalytics from '@amplitude/analytics-browser';

const trackEvent = async (
  amplitude: Amplitude | null | undefined,
  userUuid: string | undefined,
  event: string,
  data: any
) => {
  if (amplitude) {
    amplitude.setUserId(userUuid ?? '');

    return trackEventWithTimeout(
      amplitude
        .trackEventAsync(event, data)
        .catch((error) => Logger.instance.error('Error sending amplitude event.', { error }))
    );
  }
};

const trackEventWithTimeout = async (
  trackEventPromise: Promise<void | amplitudeAnalytics.Types.Result>
) => {
  const TIMEOUT_MS = 2000;
  const errorMessage = 'Timeout limit reached for Amplitude Event';
  let timeoutHandle: NodeJS.Timeout;

  const timeoutPromise = new Promise((resolve) => {
    timeoutHandle = setTimeout(() => {
      Logger.instance.warn(errorMessage);
      resolve(errorMessage);
    }, TIMEOUT_MS);
  });

  return await Promise.race([trackEventPromise, timeoutPromise]).then((result) => {
    clearTimeout(timeoutHandle);
    return result;
  });
};

export const useNavigationTracking = () => {
  const amplitude = useContext(AmplitudeContext);
  const userCtx = useContext(UserContext);

  const trackNavigationEvent = (buttonID: string) => {
    return trackEvent(amplitude, userCtx.user?.uuid, 'navigation_clicked', {
      menuItem: buttonID,
    });
  };

  return { trackNavigationEvent };
};
