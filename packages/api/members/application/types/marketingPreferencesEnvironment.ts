export type MarketingPreferencesEnvironment = 'web' | 'mobile';

export function isMarketingPreferencesEnvironment(
  maybeMarketingPreferencesEnvironment: string,
): maybeMarketingPreferencesEnvironment is MarketingPreferencesEnvironment {
  return (
    maybeMarketingPreferencesEnvironment === 'web' ||
    maybeMarketingPreferencesEnvironment === 'mobile'
  );
}
