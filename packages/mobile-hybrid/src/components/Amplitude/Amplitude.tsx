import { FC } from 'react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useAtomValue } from 'jotai';
import { AmplitudeProps } from '@/components/Amplitude/types';

const Amplitude: FC<AmplitudeProps> = ({ keyName, value, children }) => {
  const experimentsAndFeatureFlagsStore = useAtomValue(experimentsAndFeatureFlags);

  if (experimentsAndFeatureFlagsStore[keyName] === value) return children;

  return <></>;
};

export default Amplitude;
