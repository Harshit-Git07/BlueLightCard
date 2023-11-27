import { useEffect, useState, ReactNode, useContext } from 'react';
import AmplitudeContext from '../../context/AmplitudeContext';
import { Amplitude } from './amplitude';
import { AMPLITUDE_API_KEY } from '@/global-vars';

interface AmplitudeProviderProps {
  children: ReactNode;
}

const AmplitudeProvider = ({ children }: AmplitudeProviderProps) => {
  const [amplitudeService, setAmplitudeService] = useState<Amplitude | null>();
  const amplitude = useContext(AmplitudeContext);

  useEffect(() => {
    try {
      if (amplitude) {
        amplitude.initialise(AMPLITUDE_API_KEY);
        setAmplitudeService(amplitude);
      }
    } catch (e) {
      console.error(e);
    }
  }, [amplitude]);

  return <AmplitudeContext.Provider value={amplitudeService}>{children}</AmplitudeContext.Provider>;
};
export default AmplitudeProvider;
