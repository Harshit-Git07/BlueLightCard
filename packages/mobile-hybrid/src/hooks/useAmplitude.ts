import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useAtomValue } from 'jotai';
import { useCallback } from 'react';

type UseAmplitudeIsCallback = (key: string, value: string) => boolean;
type UseAmplitudeReturnType = {
  is: UseAmplitudeIsCallback;
};

export const useAmplitude = (): UseAmplitudeReturnType => {
  const ampStore = useAtomValue(experimentsAndFeatureFlags);
  const is = useCallback<UseAmplitudeIsCallback>(
    (key, value) => {
      return ampStore[key] === value;
    },
    [ampStore],
  );
  return { is };
};
