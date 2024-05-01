import { renderHook } from '@testing-library/react';
import { useAmplitude } from '../useAmplitude';
import { AmplitudeStore, experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useSetAtom } from 'jotai';

describe('useAmplitude', () => {
  it('should return boolean "true" if variant key and value are found in store', () => {
    givenAmplitudeStoreSet({
      'amplitude-variant-key': 'control',
    });
    const result = renderHook(() => useAmplitude());
    const variant = result.result.current;
    expect(variant.is('amplitude-variant-key', 'control')).toBe(true);
  });

  it('should return boolean "false" if variant key and value are NOT found in store', () => {
    givenAmplitudeStoreSet({
      'amplitude-variant-key': 'control',
    });
    const result = renderHook(() => useAmplitude());
    const variant = result.result.current;
    expect(variant.is('amplitude-variant-key', 'treatment')).toBe(false);
  });

  it('should return boolean "false" if variant key NOT found in store', () => {
    givenAmplitudeStoreSet({});
    const result = renderHook(() => useAmplitude());
    const variant = result.result.current;
    expect(variant.is('amplitude-variant-key', 'treatment')).toBe(false);
  });
});

const givenAmplitudeStoreSet = (state: AmplitudeStore) => {
  return renderHook(() => {
    const setAmpStore = useSetAtom(experimentsAndFeatureFlags);
    setAmpStore(state);
  });
};
