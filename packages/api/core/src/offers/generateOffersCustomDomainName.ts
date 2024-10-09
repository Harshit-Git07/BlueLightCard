import { OFFERS_DOMAIN_NAME, OFFERS_SUBDOMAINS } from '@blc-mono/offers/src/utils/global-constants'
import { REGIONS } from '../types/regions.enum'
import { Stack } from 'sst/constructs/Stack'
import { isProduction, isStaging } from '../utils/checkEnvironment';
import { isDdsUkBrand } from '../utils/checkBrand';

export function generateOffersCustomDomainName(stack: Stack, suffix: string = ''): string {
  switch(true) {
    case isProduction(stack.stage):
      return buildCustomDomainName(stack, suffix);
    case isStaging(stack.stage):
      return `staging-${buildCustomDomainName(stack, suffix)}`;
    default:
      return `${stack.stage}-${buildCustomDomainName(stack, suffix)}`;
  }
}

const buildCustomDomainName = (stack: Stack, suffix: string): string => {
  const nameEnd = suffix ? `-${suffix}.${OFFERS_DOMAIN_NAME}` : `.${OFFERS_DOMAIN_NAME}`;
  switch (stack.region) {
    case REGIONS.EU_WEST_2:
      return isDdsUkBrand() ? OFFERS_SUBDOMAINS.DDS_UK + nameEnd : OFFERS_SUBDOMAINS.BLC_UK + nameEnd;
    case REGIONS.AP_SOUTHEAST_2:
      return OFFERS_SUBDOMAINS.BLC_AUS + nameEnd;
    default:
      throw new Error(`Invalid region when building offers custom domain name: ${stack.region}`);
  }
};
