import * as target from '../generateOffersCustomDomainName';
import { Stack } from 'sst/constructs'
import { REGIONS } from '../../types/regions.enum'
import { describe, expect } from '@jest/globals';
import { isDdsUkBrand } from '../../utils/checkBrand';
import { OFFERS_SUBDOMAINS, OFFERS_DOMAIN_NAME } from '@blc-mono/offers/src/utils/global-constants';

jest.mock('../../utils/checkBrand');
const isDdsUkBrandMock = jest.mocked(isDdsUkBrand);

describe('Generate offers custom domain name', () => {
  describe('and is production', () => {
    it('should return BLC UK custom domain name', () => {
      const blcUkStack = buildStack(REGIONS.EU_WEST_2, 'production');
      isDdsUkBrandMock.mockReturnValue(false);

      const result = target.generateOffersCustomDomainName(blcUkStack);

      expect(result).toBe(`${OFFERS_SUBDOMAINS.BLC_UK}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should return BLC AU custom domain name', () => {
      const blcAuStack = buildStack(REGIONS.AP_SOUTHEAST_2, 'production');
      isDdsUkBrandMock.mockReturnValue(false);

      const result = target.generateOffersCustomDomainName(blcAuStack);

      expect(result).toBe(`${OFFERS_SUBDOMAINS.BLC_AUS}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should return DDS UK custom domain name', () => {
      const ddsUkStack = buildStack(REGIONS.EU_WEST_2, 'production-dds');
      isDdsUkBrandMock.mockReturnValue(true);

      const result = target.generateOffersCustomDomainName(ddsUkStack);

      expect(result).toBe(`${OFFERS_SUBDOMAINS.DDS_UK}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should throw error if valid region not provided', () => {
      const invalidRegionStack = buildStack('us-east-1', 'production');

      expect(() => target.generateOffersCustomDomainName(invalidRegionStack))
        .toThrow('Invalid region when building offers custom domain name: us-east-1');
    });

    describe('with a provided suffix', () => {
      it('should return a suffixed custom domain name', () => {
        const blcUkStack = buildStack(REGIONS.EU_WEST_2, 'production');
        isDdsUkBrandMock.mockReturnValue(false);
  
        const result = target.generateOffersCustomDomainName(blcUkStack, "two");
  
        expect(result).toBe(`${OFFERS_SUBDOMAINS.BLC_UK}-two.${OFFERS_DOMAIN_NAME}`);
      });

      it('should return a DDS branded suffixed custom domain name', () => {
        const ddsUkStack = buildStack(REGIONS.EU_WEST_2, 'production-dds');
        isDdsUkBrandMock.mockReturnValue(true);
  
        const result = target.generateOffersCustomDomainName(ddsUkStack, "three");
  
        expect(result).toBe(`${OFFERS_SUBDOMAINS.DDS_UK}-three.${OFFERS_DOMAIN_NAME}`);
      });
    });
  });

  describe('and is staging', () => {
    it('should return BLC UK custom domain name', () => {
      const blcUkStack = buildStack(REGIONS.EU_WEST_2, 'staging');
      isDdsUkBrandMock.mockReturnValue(false);

      const result = target.generateOffersCustomDomainName(blcUkStack);

      expect(result).toBe(`staging-${OFFERS_SUBDOMAINS.BLC_UK}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should return BLC AU custom domain name', () => {
      const blcAuStack = buildStack(REGIONS.AP_SOUTHEAST_2, 'staging');
      isDdsUkBrandMock.mockReturnValue(false);

      const result = target.generateOffersCustomDomainName(blcAuStack);

      expect(result).toBe(`staging-${OFFERS_SUBDOMAINS.BLC_AUS}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should return DDS UK custom domain name', () => {
      const ddsUkStack = buildStack(REGIONS.EU_WEST_2, 'staging-dds');
      isDdsUkBrandMock.mockReturnValue(true);

      const result = target.generateOffersCustomDomainName(ddsUkStack);

      expect(result).toBe(`staging-${OFFERS_SUBDOMAINS.DDS_UK}.${OFFERS_DOMAIN_NAME}`);
    });

    it('should throw error if valid region not provided', () => {
      const invalidRegionStack = buildStack('us-east-1', 'staging');

      expect(() => target.generateOffersCustomDomainName(invalidRegionStack))
        .toThrow('Invalid region when building offers custom domain name: us-east-1');
    });

    describe('with a provided suffix', () => {
      it('should return a suffixed custom domain name', () => {
        const blcUkStack = buildStack(REGIONS.EU_WEST_2, 'staging');
        isDdsUkBrandMock.mockReturnValue(false);
  
        const result = target.generateOffersCustomDomainName(blcUkStack, "two");
  
        expect(result).toBe(`staging-${OFFERS_SUBDOMAINS.BLC_UK}-two.${OFFERS_DOMAIN_NAME}`);
      });

      it('should return a DDS branded suffixed custom domain name', () => {
        const ddsUkStack = buildStack(REGIONS.EU_WEST_2, 'staging-dds');
        isDdsUkBrandMock.mockReturnValue(true);
  
        const result = target.generateOffersCustomDomainName(ddsUkStack, "three");
  
        expect(result).toBe(`staging-${OFFERS_SUBDOMAINS.DDS_UK}-three.${OFFERS_DOMAIN_NAME}`);
      });
    });
  });

  const buildStack = (region: string, stage: string): Stack => {
    return {
      stage,
      region,
      stackName: 'offers'
    } as unknown as Stack;
  }
});
