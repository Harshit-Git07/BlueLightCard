import amplitudeEvents from '@/utils/amplitude/events';
import { Amplitude } from '@/utils/amplitude/amplitude';
import * as amplitudeAnalytics from '@amplitude/analytics-browser';
import { Logger } from '@/services/Logger';

type BaseLogGlobalNavigationParams = {
  amplitude: Amplitude | null | undefined;
  userUuid: string | undefined;
  origin: string;
};

export type LogGlobalNavigationParams = BaseLogGlobalNavigationParams & {
  offerPage: string;
};

export type LogGlobalNavigationBrowseCategoriesParams = BaseLogGlobalNavigationParams & {
  categoryPage: string;
};

export const logGlobalNavigationOffersClicked = ({
  amplitude,
  userUuid,
  offerPage,
  origin,
}: LogGlobalNavigationParams) => {
  trackEvent(amplitude, userUuid, amplitudeEvents.GLOBAL_NAVIGATION_OFFERS_CLICKED, {
    offer_page: offerPage,
    origin,
  });
};

export const logGlobalNavigationBrowseCategoriesClicked = ({
  amplitude,
  userUuid,
  categoryPage,
  origin,
}: LogGlobalNavigationBrowseCategoriesParams) => {
  trackEvent(amplitude, userUuid, amplitudeEvents.GLOBAL_NAVIGATION_BROWSE_CATEGORIES_CLICKED, {
    category_page: categoryPage,
    origin,
  });
};

export const logGlobalNavigationMyCardClicked = ({
  amplitude,
  userUuid,
  origin,
}: BaseLogGlobalNavigationParams) => {
  trackEvent(amplitude, userUuid, amplitudeEvents.GLOBAL_NAVIGATION_MY_CARD_CLICKED, {
    origin,
  });
};

export const logGlobalNavigationMyAccountClicked = ({
  amplitude,
  userUuid,
  origin,
}: BaseLogGlobalNavigationParams) => {
  trackEvent(amplitude, userUuid, amplitudeEvents.GLOBAL_NAVIGATION_MY_ACCOUNT_CLICKED, {
    origin,
  });
};

export const logGlobalNavigationNotificationsClicked = ({
  amplitude,
  userUuid,
  origin,
}: BaseLogGlobalNavigationParams) => {
  return trackEvent(amplitude, userUuid, amplitudeEvents.GLOBAL_NAVIGATION_NOTIFICATIONS_CLICKED, {
    origin,
  });
};

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
