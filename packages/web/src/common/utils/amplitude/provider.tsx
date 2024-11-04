import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import AmplitudeContext from '../../context/AmplitudeContext';
import { amplitudeStore } from '../../context/AmplitudeExperiment';
import { amplitudeServiceAtom } from './store';
import { AMPLITUDE_API_KEY } from '@/global-vars';
import { Logger } from '@/services/Logger';
import { useEffectOnce } from 'react-use';

interface AmplitudeProviderProps {
  children: ReactNode;
}

const AmplitudeProvider = ({ children }: AmplitudeProviderProps) => {
  const amplitudeService = useAtomValue(amplitudeServiceAtom);

  useEffectOnce(() => {
    amplitudeService
      .initialise(AMPLITUDE_API_KEY)
      .then(() => {
        amplitudeStore.set(amplitudeServiceAtom, amplitudeService);
      })
      .catch((error) => Logger.instance.error('Error initialising amplitude.', { error }));
  });

  return <AmplitudeContext.Provider value={amplitudeService}>{children}</AmplitudeContext.Provider>;
};
export default AmplitudeProvider;
