import * as target from '../generateOffersCustomDomainName';
import { Stack } from 'sst/constructs'
import { REGIONS } from '../../types/regions.enum'
import { DDS_UK, OFFERS_DOMAIN_NAME } from '@blc-mono/offers/src/utils/global-constants'
import { describe, expect } from '@jest/globals';

describe('Generate offers custom domain name', () => {
  describe('and is production', () => {
    it('should return BLC UK custom domain name', () => {
      const blcUkStack = buildProductionStack(REGIONS.EU_WEST_2);

      const result = target.generateOffersCustomDomainName(blcUkStack);

      expect(result).toBe(OFFERS_DOMAIN_NAME.BLC_UK);
    });

    it('should return BLC AU custom domain name', () => {
      const blcAuStack = buildProductionStack(REGIONS.AP_SOUTHEAST_2);

      const result = target.generateOffersCustomDomainName(blcAuStack);

      expect(result).toBe(OFFERS_DOMAIN_NAME.BLC_AUS);
    });

    it('should return DDS UK custom domain name', () => {
      const blcAuStack = buildProductionStack(REGIONS.EU_WEST_2, DDS_UK);

      const result = target.generateOffersCustomDomainName(blcAuStack);

      expect(result).toBe(OFFERS_DOMAIN_NAME.DDS_UK);
    });

    it('should throw error if valid region not provided', () => {
      const invalidRegionStack = buildProductionStack('us-east-1');

      expect(() => target.generateOffersCustomDomainName(invalidRegionStack))
        .toThrow('Invalid region when building offers custom domain name: us-east-1');
    });

    const buildProductionStack = (region: string, stackNamePrefix?: string): Stack => {
      return {
        stage: 'production',
        region,
        stackName: stackNamePrefix ? `${stackNamePrefix}-offers` : 'offers'
      } as unknown as Stack;
    }
  });

  describe('and is staging', () => {
    it('should return BLC UK custom domain name', () => {
      const blcUkStack = buildStagingStack(REGIONS.EU_WEST_2);

      const result = target.generateOffersCustomDomainName(blcUkStack);

      expect(result).toBe(`staging-${OFFERS_DOMAIN_NAME.BLC_UK}`);
    });

    it('should return BLC AU custom domain name', () => {
      const blcAuStack = buildStagingStack(REGIONS.AP_SOUTHEAST_2);

      const result = target.generateOffersCustomDomainName(blcAuStack);

      expect(result).toBe(`staging-${OFFERS_DOMAIN_NAME.BLC_AUS}`);
    });

    it('should return DDS UK custom domain name', () => {
      const ddsUkStack = buildStagingStack(REGIONS.EU_WEST_2, DDS_UK);

      const result = target.generateOffersCustomDomainName(ddsUkStack);

      expect(result).toBe(`staging-${OFFERS_DOMAIN_NAME.DDS_UK}`);
    });

    it('should throw error if valid region not provided', () => {
      const invalidRegionStack = buildStagingStack('us-east-1');

      expect(() => target.generateOffersCustomDomainName(invalidRegionStack))
        .toThrow('Invalid region when building offers custom domain name: us-east-1');
    });

    const buildStagingStack = (region: string, stackNamePrefix?: string): Stack => {
      return {
        stage: 'staging',
        region,
        stackName: stackNamePrefix ? `${stackNamePrefix}-offers` : 'offers'
      } as unknown as Stack;
    }
  });
});
