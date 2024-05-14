// Braze requires dynamic importing due to NextJS server side rendering
// https://www.braze.com/docs/developer_guide/platform_integration_guides/web/initial_sdk_setup/#ssr
export const importBrazeFunctions = async (): Promise<{
  subscribeToContentCardsUpdates: (subscriber: (cards: any) => void) => string | undefined;
  requestContentCardsRefresh: (successCallback?: () => void, errorCallback?: () => void) => void;
  openSession: () => void;
  getCachedContentCards: () => any;
  initialize: (apiKey: string, options: any) => boolean;
}> => {
  const {
    initialize,
    requestContentCardsRefresh,
    openSession,
    getCachedContentCards,
    subscribeToContentCardsUpdates,
  } = await import('@braze/web-sdk');

  return {
    openSession,
    getCachedContentCards,
    subscribeToContentCardsUpdates,
    initialize,
    requestContentCardsRefresh,
  };
};
