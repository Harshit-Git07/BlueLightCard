import { DDS_UK, OFFERS_DOMAIN_NAME } from '@blc-mono/offers/src/utils/global-constants'
import { REGIONS } from '../types/regions.enum'
import { Stack } from 'sst/constructs/Stack'
import { isProduction } from '../utils/checkEnvironment'

export function generateOffersCustomDomainName(stack: Stack): string {
  return isProduction(stack.stage)
    ? buildCustomDomainName(stack)
    : `${stack.stage}-${buildCustomDomainName(stack)}`;
}

const buildCustomDomainName = (stack: Stack): string => {
  const isDds = stack.stackName.includes(DDS_UK);

  switch (stack.region) {
    case REGIONS.EU_WEST_2:
      return isDds ? OFFERS_DOMAIN_NAME.DDS_UK : OFFERS_DOMAIN_NAME.BLC_UK;
    case REGIONS.AP_SOUTHEAST_2:
      return OFFERS_DOMAIN_NAME.BLC_AUS;
    default:
      throw new Error(`Invalid region when building offers custom domain name: ${stack.region}`);
  }
};
