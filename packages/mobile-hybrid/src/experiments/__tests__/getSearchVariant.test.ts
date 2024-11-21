import { renderHook } from '@testing-library/react';
import { AmplitudeStore, experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useSetAtom } from 'jotai';
import { GetSearchVariant } from '../getSearchVariant';

describe('getSearchVariant', () => {
  it('should return default value if variant key and control are found in store', () => {
    givenAmplitudeStoreSet({
      'conv-blc-5-0-search-ui': 'control',
    });
    const result = renderHook(() => GetSearchVariant());
    expect(result.result.current).toBe('control');
  });

  it('should return value `border-variant` if variant key and value are found in store', () => {
    givenAmplitudeStoreSet({
      'conv-blc-5-0-search-ui': 'border-variant',
    });
    const result = renderHook(() => GetSearchVariant());
    expect(result.result.current).toBe('border-variant');
  });

  it('should return value `background-variant-dark` if variant key and value are found in store', () => {
    givenAmplitudeStoreSet({
      'conv-blc-5-0-search-ui': 'background-variant-dark',
    });
    const result = renderHook(() => GetSearchVariant());
    expect(result.result.current).toBe('background-variant-dark');
  });

  it('should return value `background-variant-light` if variant key and value are found in store', () => {
    givenAmplitudeStoreSet({
      'conv-blc-5-0-search-ui': 'background-variant-light',
    });
    const result = renderHook(() => GetSearchVariant());
    expect(result.result.current).toBe('background-variant-light');
  });

  it('should return default value if variant key and value are NOT found in store', () => {
    givenAmplitudeStoreSet({
      'conv-blc-5-0-search-ui': 'example-variant',
    });
    const result = renderHook(() => GetSearchVariant());
    expect(result.result.current).toBe('control');
  });
});

const givenAmplitudeStoreSet = (state: AmplitudeStore) => {
  return renderHook(() => {
    const setAmpStore = useSetAtom(experimentsAndFeatureFlags);
    setAmpStore(state);
  });
};
