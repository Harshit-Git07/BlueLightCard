import { RedemptionType } from '../../../components/OfferSheet/types';
import { useMockPlatformAdapter } from '../../../adapters';
import { PlatformVariant } from '../../../types';
import { getPlatformExperimentForRedemptionType } from '../offerDetailsExperiments';

const testTable = [
  { redemptionType: 'vault', platform: PlatformVariant.Web },
  { redemptionType: 'vault', platform: PlatformVariant.MobileHybrid },
  { redemptionType: 'generic', platform: PlatformVariant.MobileHybrid },
];

describe('getPlatformExperimentForRedemptionType', () => {
  it.each(testTable)(
    'checks the $platform experiment for the $redemptionType redemption type',
    ({ redemptionType, platform }) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, {}, platform);

      getPlatformExperimentForRedemptionType(mockPlatformAdapter, redemptionType as RedemptionType);

      const experimentName = mockPlatformAdapter.getAmplitudeFeatureFlag.mock.calls[0][0];
      expect(experimentName).toMatchSnapshot();
    },
  );
});
