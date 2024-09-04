import * as globals from '@/global-vars';
import { getOffersBySearchTermUrl } from '../externalPageUrls';
import { amplitudeStore } from '../../context/AmplitudeExperiment';
import { experimentsAndFeatureFlags } from '../../utils/amplitude/store';
import { AmplitudeExperimentFlags } from '../../utils/amplitude/AmplitudeExperimentFlags';

jest.mock('@/global-vars', () => ({
  __esModule: true,
  BRAND: 'blc-uk',
  AMPLITUDE_DEPLOYMENT_KEY: '',
}));

const mockGlobals = globals as { BRAND: string };

describe('getOffersBySearchTermUrl', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

  test('it returns the modern search path for BLC UK', () => {
    mockGlobals.BRAND = 'blc-uk';

    const searchPath = getOffersBySearchTermUrl('Test search term', 'serp');

    expect(searchPath).toEqual('/search?issuer=serp&q=Test search term');
  });

  test('it returns the modern search path for when feature flag is OFF', () => {
    amplitudeStore.set(experimentsAndFeatureFlags, {
      [AmplitudeExperimentFlags.DISABLE_MODERN_WEB_SEARCH]: 'off',
    });

    const searchPath = getOffersBySearchTermUrl('Test search term', 'serp');

    expect(searchPath).toEqual('/search?issuer=serp&q=Test search term');
  });

  test('it returns the legacy search path for feature flag is ON', () => {
    amplitudeStore.set(experimentsAndFeatureFlags, {
      [AmplitudeExperimentFlags.DISABLE_MODERN_WEB_SEARCH]: 'on',
    });

    const searchPath = getOffersBySearchTermUrl('Test search term', 'serp');

    expect(searchPath).toEqual('/offers.php?type=1&opensearch=1&search=Test search term');
  });
});
