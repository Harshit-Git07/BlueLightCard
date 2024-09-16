import { useState, type ReactNode } from 'react';
import AmplitudeContext from '../../context/AmplitudeContext';
import { Amplitude } from './amplitude';
import { AMPLITUDE_API_KEY } from '@/global-vars';
import { Logger } from '@/services/Logger';
import { useEffectOnce } from 'react-use';

interface AmplitudeProviderProps {
  children: ReactNode;
}

const AmplitudeProvider = ({ children }: AmplitudeProviderProps) => {
  const [amplitudeService, setAmplitudeService] = useState<Amplitude | null>(null);

  useEffectOnce(() => {
    try {
      const amplitude = new Amplitude();
      amplitude.initialise(AMPLITUDE_API_KEY).then(() => {
        setAmplitudeService(amplitude);
      });
    } catch (error) {
      Logger.instance.error('Error initialising amplitude.', { error });
    }
  });

  return <AmplitudeContext.Provider value={amplitudeService}>{children}</AmplitudeContext.Provider>;
};
export default AmplitudeProvider;
