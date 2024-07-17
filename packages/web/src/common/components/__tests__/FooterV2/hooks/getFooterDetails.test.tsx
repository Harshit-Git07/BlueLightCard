import { BRANDS } from '@/root/src/common/types/brands.enum';
import {
  AUS_FOOTER_CONFIG_AUTHENTICATED,
  AUS_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../../../Footer/v2/constants/ausFooterConfig';
import {
  DDS_FOOTER_CONFIG_AUTHENTICATED,
  DDS_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../../../Footer/v2/constants/ddsFooterConfig';
import {
  UK_FOOTER_CONFIG_AUTHENTICATED,
  UK_FOOTER_CONFIG_UNAUTHENTICATED,
} from '../../../Footer/v2/constants/ukFooterConfig';
import { getFooterDetails } from '../../../Footer/v2/helpers/getFooterDetails';

const footerConfigs = [
  {
    isAuthenticated: true,
    brand: BRANDS.BLC_UK,
    expectedFooterConfig: UK_FOOTER_CONFIG_AUTHENTICATED,
  },
  {
    isAuthenticated: false,
    brand: BRANDS.BLC_UK,
    expectedFooterConfig: UK_FOOTER_CONFIG_UNAUTHENTICATED,
  },
  {
    isAuthenticated: true,
    brand: BRANDS.BLC_AU,
    expectedFooterConfig: AUS_FOOTER_CONFIG_AUTHENTICATED,
  },
  {
    isAuthenticated: false,
    brand: BRANDS.BLC_AU,
    expectedFooterConfig: AUS_FOOTER_CONFIG_UNAUTHENTICATED,
  },
  {
    isAuthenticated: true,
    brand: BRANDS.DDS_UK,
    expectedFooterConfig: DDS_FOOTER_CONFIG_AUTHENTICATED,
  },
  {
    isAuthenticated: false,
    brand: BRANDS.DDS_UK,
    expectedFooterConfig: DDS_FOOTER_CONFIG_UNAUTHENTICATED,
  },
];

describe('getFooterDetails', () => {
  it.each(footerConfigs)(
    'should return the correct footer config',
    ({ isAuthenticated, brand, expectedFooterConfig }) => {
      expect(getFooterDetails(brand, isAuthenticated)).toStrictEqual(expectedFooterConfig);
    }
  );
});
