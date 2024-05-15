import { FC, useEffect } from 'react';
import InvokeNativeExperiment from '@/invoke/experiment';
import { experimentsAndFeatureFlags } from './store';
import { Provider, createStore, useSetAtom } from 'jotai';
import { AmplitudeProviderProps } from '@/components/AmplitudeProvider/types';
import { Channels } from '@/globals';
import eventBus from '@/eventBus';

const invokeNativeExperiment = new InvokeNativeExperiment();
export const amplitudeStore = createStore();

const AmplitudeProvider: FC<AmplitudeProviderProps> = ({
  experimentKeys,
  featureFlagKeys,
  children,
}) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);

  useEffect(() => {
    invokeNativeExperiment.experiment(experimentKeys.concat(featureFlagKeys));
  }, [experimentKeys, featureFlagKeys]);

  useEffect(() => {
    eventBus.on(Channels.EXPERIMENTS, (variants) => {
      if (variants) {
        amplitudeStore.set(experimentsAndFeatureFlags, variants);
        setExperimentsAndFeatureFlags(variants);
      }
    });
  }, [setExperimentsAndFeatureFlags]);

  return <Provider store={amplitudeStore}>{children}</Provider>;
};

export default AmplitudeProvider;
