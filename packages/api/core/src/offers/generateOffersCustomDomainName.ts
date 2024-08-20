import { OFFERS_DOMAIN_NAME } from '@blc-mono/offers/src/utils/global-constants'
import { REGIONS } from '../types/regions.enum'
import { Stack } from 'sst/constructs/Stack'
import { isProduction, isStaging } from '../utils/checkEnvironment';
import { isDdsUkBrand } from '../utils/checkBrand';

export function generateOffersCustomDomainName(stack: Stack): string {
  switch(true) {
    case isProduction(stack.stage):
      return buildCustomDomainName(stack);
    case isStaging(stack.stage):
      return `staging-${buildCustomDomainName(stack)}`;
    default:
      return `${stack.stage}-${buildCustomDomainName(stack)}`;
  }
}

const buildCustomDomainName = (stack: Stack): string => {
  switch (stack.region) {
    case REGIONS.EU_WEST_2:
      return isDdsUkBrand() ? OFFERS_DOMAIN_NAME.DDS_UK : OFFERS_DOMAIN_NAME.BLC_UK;
    case REGIONS.AP_SOUTHEAST_2:
      return OFFERS_DOMAIN_NAME.BLC_AUS;
    default:
      throw new Error(`Invalid region when building offers custom domain name: ${stack.region}`);
  }
};
