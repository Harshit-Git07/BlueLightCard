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

  test('it returns the modern search path for BLC AU when feature flag is OFF', () => {
    mockGlobals.BRAND = 'blc-au';

    amplitudeStore.set(experimentsAndFeatureFlags, {
      [AmplitudeExperimentFlags.AUS_DISABLE_WEB_SEARCH]: 'off',
    });

    const searchPath = getOffersBySearchTermUrl('Test search term', 'serp');

    expect(searchPath).toEqual('/search?issuer=serp&q=Test search term');
  });

  test('it returns the legacy search path for BLC AU when feature flag is ON', () => {
    mockGlobals.BRAND = 'blc-au';

    amplitudeStore.set(experimentsAndFeatureFlags, {
      [AmplitudeExperimentFlags.AUS_DISABLE_WEB_SEARCH]: 'on',
    });

    const searchPath = getOffersBySearchTermUrl('Test search term', 'serp');

    expect(searchPath).toEqual('/offers.php?type=1&opensearch=1&search=Test search term');
  });
});
