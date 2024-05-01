import { FC, useEffect } from 'react';
import InvokeNativeExperiment from '@/invoke/experiment';
import { experimentsAndFeatureFlags } from './store';
import { useSetAtom } from 'jotai';
import { AmplitudeProviderProps } from '@/components/AmplitudeProvider/types';
import { Channels } from '@/globals';
import eventBus from '@/eventBus';

const invokeNativeExperiment = new InvokeNativeExperiment();

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
        setExperimentsAndFeatureFlags(variants);
      }
    });
  }, [setExperimentsAndFeatureFlags]);

  return children;
};

export default AmplitudeProvider;
