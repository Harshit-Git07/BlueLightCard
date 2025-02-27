import { act, renderHook } from '@testing-library/react';
import OfferSheet from '../../OfferSheet';
import { OfferDetailsLink, useOfferDetailsComponent } from '../useOfferDetailsComponent';
import { useMockPlatformAdapter } from '../../../adapters';
import { PlatformVariant } from 'src/types';

const supportedRedemptionTypes = ['vault', 'generic'];

describe('useOfferDetailsComponent', () => {
  const env = process.env;
  beforeEach(() => {
    process.env = env;
    jest.clearAllMocks();
  });

  test('it returns offer details link by default', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter();
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('off');
    process.env.NEXT_PUBLIC_FSI_COMPANY_IDS = '16913';

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 16913,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test.each(supportedRedemptionTypes)(
    'it returns the offer details link for the %s offer control group',
    async (redemptionType) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType } });
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('control');
      process.env.NEXT_PUBLIC_FSI_COMPANY_IDS = '16913';

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent({
          offerId: 1,
          companyId: 16913,
          companyName: 'companyName',
          platform: PlatformVariant.MobileHybrid,
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
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent({
          offerId: 1,
          companyId: 1,
          companyName: 'companyName',
          platform: PlatformVariant.MobileHybrid,
          amplitudeCtx: null,
        });
      });

      expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
    },
  );

  test.each(supportedRedemptionTypes)(
    'it returns the offer sheet for the %s offer with flag on',
    async (redemptionType) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType } });
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('on');

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent({
          offerId: 1,
          companyId: 1,
          companyName: 'companyName',
          platform: PlatformVariant.MobileHybrid,
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
    process.env.NEXT_PUBLIC_FSI_COMPANY_IDS = '16913';

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 16913,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer details link if an error is thrown when getting the redemption details', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('control');
    process.env.NEXT_PUBLIC_FSI_COMPANY_IDS = '16913';

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 16913,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer sheet for the treatment and a vault offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('treatment');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });

  test('it returns the offer sheet for the on flag and a generic offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'generic' },
    });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('on');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });

  test('it returns the offer sheet for the on flag and a preApplied offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'preApplied' },
    });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('on');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });

  test('it returns the offer sheet for the on flag and a showCard offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'showCard' },
    });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('on');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });

  test('it returns the offer sheet for the on flag and a vaultQR offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'vaultQR' },
    });
    mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('on');

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent({
        offerId: 1,
        companyId: 1,
        companyName: 'companyName',
        platform: PlatformVariant.MobileHybrid,
        amplitudeCtx: null,
      });
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });
});
