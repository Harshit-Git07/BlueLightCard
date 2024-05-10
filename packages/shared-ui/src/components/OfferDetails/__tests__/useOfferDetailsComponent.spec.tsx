import { act, renderHook } from '@testing-library/react';
import OfferSheet from '../../OfferSheet';
import {
  EmptyOfferDetails,
  OfferDetailsLink,
  useOfferDetailsComponent,
} from '../useOfferDetailsComponent';
import { useMockPlatformAdapter } from '../../../adapters';

describe('useOfferDetailsComponent', () => {
  test('it returns empty offer details by default', () => {
    const mockPlatformAdapter = useMockPlatformAdapter();

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    expect(result.current.OfferDetailsComponent).toBe(EmptyOfferDetails);
  });

  test('it returns the offer details link for the control', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent('control', 1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer details link for the treatment and a non-vault offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, {
      data: { redemptionType: 'default' },
    });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent('treatment', 1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer details link if an error is thrown when getting the redemption details', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(500);

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent('treatment', 1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferDetailsLink);
  });

  test('it returns the offer sheet for the treatment and a vault offer', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent('treatment', 1);
    });

    expect(result.current.OfferDetailsComponent).toBe(OfferSheet);
  });

  test('it does not get redemption details if the user is not in the experiment treatment', async () => {
    const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });

    const { result } = renderHook(() => useOfferDetailsComponent(mockPlatformAdapter));

    await act(async () => {
      await result.current.updateOfferDetailsComponent('control', 1);
    });

    expect(mockPlatformAdapter.invokeV5Api).not.toHaveBeenCalled();
  });
});
