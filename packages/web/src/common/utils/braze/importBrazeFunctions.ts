interface BrazeFunctions {
  subscribeToContentCardsUpdates: (subscriber: (cards: any) => void) => string | undefined;
  requestContentCardsRefresh: (successCallback?: () => void, errorCallback?: () => void) => void;
  openSession: () => void;
  getCachedContentCards: () => any;
  initialize: (apiKey: string, options: any) => boolean;
  changeUser: (userId: string) => void;
  logContentCardClick: LogContentCardClick;
}

export type LogContentCardClick = (card: any) => boolean;

// Braze requires dynamic importing due to NextJS server side rendering
// https://www.braze.com/docs/developer_guide/platform_integration_guides/web/initial_sdk_setup/#ssr
export const importBrazeFunctions = async (): Promise<BrazeFunctions> => {
  const {
    initialize,
    requestContentCardsRefresh,
    openSession,
    getCachedContentCards,
    subscribeToContentCardsUpdates,
    logContentCardClick,
    changeUser,
  } = await import('@braze/web-sdk');

  return {
    openSession,
    getCachedContentCards,
    subscribeToContentCardsUpdates,
    initialize,
    requestContentCardsRefresh,
    logContentCardClick,
    changeUser,
  };
};
