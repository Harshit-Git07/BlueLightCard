import type { RedemptionType } from '../../../components/OfferSheet/types';
import { useMockPlatformAdapter } from '../../../adapters';
import { PlatformVariant } from '../../../types';
import { getPlatformExperimentForRedemptionType } from '../offerDetailsExperiments';

const testTable = [
  { redemptionType: 'vault', platform: PlatformVariant.Web },
  { redemptionType: 'vault', platform: PlatformVariant.MobileHybrid },
  { redemptionType: 'generic', platform: PlatformVariant.Web },
  { redemptionType: 'generic', platform: PlatformVariant.MobileHybrid },
  { redemptionType: 'preApplied', platform: PlatformVariant.Web },
  { redemptionType: 'preApplied', platform: PlatformVariant.MobileHybrid },
  { redemptionType: 'showCard', platform: PlatformVariant.Web },
  { redemptionType: 'showCard', platform: PlatformVariant.MobileHybrid },
  { redemptionType: 'vaultQR', platform: PlatformVariant.Web },
  { redemptionType: 'vaultQR', platform: PlatformVariant.MobileHybrid },
] as const;

describe('getPlatformExperimentForRedemptionType', () => {
  it.each(testTable)(
    'checks the $platform experiment for the $redemptionType redemption type',
    ({ redemptionType, platform }) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {}, platform);

      getPlatformExperimentForRedemptionType(mockPlatformAdapter, redemptionType);

      const experimentName = mockPlatformAdapter.getAmplitudeFeatureFlag.mock.calls;

      expect(experimentName[0][0]).toMatchSnapshot();
    },
  );
});
