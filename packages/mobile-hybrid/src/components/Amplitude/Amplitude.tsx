import { FC } from 'react';
import { AmplitudeProps } from '@/components/Amplitude/types';
import { useAmplitude } from '@/hooks/useAmplitude';

const Amplitude: FC<AmplitudeProps> = ({ keyName, value, children }) => {
  const { is } = useAmplitude();

  if (is(keyName, value)) return children;

  return <></>;
};

export default Amplitude;
