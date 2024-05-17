import { act, renderHook } from '@testing-library/react';
import OfferSheet from '../../OfferSheet';
import {
  EmptyOfferDetails,
  OfferDetailsLink,
  useOfferDetailsComponent,
} from '../useOfferDetailsComponent';
import { useMockPlatformAdapter } from '../../../adapters';
import { PlatformVariant } from 'src/types';
import { getPlatformExperimentForRedemptionType } from '../offerDetailsExperiments';

const supportedRedemptionTypes = ['vault', 'generic'];
jest.mock('../offerDetailsExperiments');

describe('useOfferDetailsComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it returns offer details link by default', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    jest.mocked(getPlatformExperimentForRedemptionType).mockReturnValue('off');
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('off');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test.each(supportedRedemptionTypes)(
    'it returns the offer details link for the %s offer control group',
    async (redemptionType) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType } });
      jest.mocked(getPlatformExperimentForRedemptionType).mockReturnValue('control');
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('control');

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent({
          offerId: 1,
          companyId: 1,
          companyName: 'companyName',
          platform: PlatformVariant.MobileHybrid,
          cdnUrl: 'CDN_URL',
          BRAND: 'blc-uk',
          isMobileHybrid: true,
          height: '90%',
          amplitudeCtx: null,
        });
      });

      expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
    },
  );

  test.each(supportedRedemptionTypes)(
    'it returns the offer sheet for the %s offer treatment group',
    async (redemptionType) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType } });
      jest.mocked(getPlatformExperimentForRedemptionType).mockReturnValue('treatment');
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent({
          offerId: 1,
          companyId: 1,
          companyName: 'companyName',
          platform: PlatformVariant.MobileHybrid,
          cdnUrl: 'CDN_URL',
          BRAND: 'blc-uk',
          isMobileHybrid: true,
          height: '90%',
          amplitudeCtx: null,
        });
      });

      expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
    },
  );

  test('it returns the offer details link for an unsupported redemption type', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'unsupported-redemption-type' },
    });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        cdnUrl: 'CDN_URL',
        BRAND: 'blc-uk',
        isMobileHybrid: true,
        height: '90%',
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer details link if an error is thrown when getting the redemption details', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);
    jest.mocked(getPlatformExperimentForRedemptionType).mockReturnValue('control');
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('control');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        cdnUrl: 'CDN_URL',
        BRAND: 'blc-uk',
        isMobileHybrid: true,
        height: '90%',
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer sheet for the treatment and a vault offer', async () => {
    jest.mocked(getPlatformExperimentForRedemptionType).mockReturnValue('treatment');
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        cdnUrl: 'CDN_URL',
        BRAND: 'blc-uk',
        isMobileHybrid: true,
        height: '90%',
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });
});
