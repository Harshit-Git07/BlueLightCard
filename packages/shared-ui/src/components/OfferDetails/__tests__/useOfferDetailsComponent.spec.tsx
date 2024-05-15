import { act, renderHook } from '@testing-library/react';
import OfferSheet from '../../OfferSheet';
import {
  EmptyOfferDetails,
  OfferDetailsLink,
  useOfferDetailsComponent,
} from '../useOfferDetailsComponent';
import { useMockPlatformAdapter } from '../../../adapters';

const supportedRedemptionTypes = ['vault', 'generic'];

describe('useOfferDetailsComponent', () => {
  test('it returns empty offer details by default', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    expect(result.current.OfferDetailsComponent).toBe(EmptyOfferDetails);
  });

  test.each(supportedRedemptionTypes)(
    'it returns the offer details link for the %s offer control group',
    async (redemptionType) => {
      const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType } });
      mockPlatformAdapter.getAmplitudeFeatureFlag.mockReturnValue('control');

      const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

      await act(async () => {
        await result.current.updateOfferDetailsComponent(1);
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
        await result.current.updateOfferDetailsComponent(1);
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
      await result.current.updateOfferDetailsComponent(1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer details link if an error is thrown when getting the redemption details', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent(1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });
});
