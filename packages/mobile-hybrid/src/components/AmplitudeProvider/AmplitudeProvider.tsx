import { FC, useContext, useEffect } from 'react';
import InvokeNativeExperiment from '@/invoke/experiment';
import { experimentsAndFeatureFlags } from './store';
import { useSetAtom } from 'jotai';
import { AppContext } from '@/store';
import { AmplitudeProviderProps } from '@/components/AmplitudeProvider/types';

const invokeNativeExperiment = new InvokeNativeExperiment();

const AmplitudeProvider: FC<AmplitudeProviderProps> = ({
  experimentKeys,
  featureFlagKeys,
  children,
}) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  const { experiments: expr } = useContext(AppContext);

  useEffect(() => {
    invokeNativeExperiment.experiment(experimentKeys.concat(featureFlagKeys));
  }, [experimentKeys, featureFlagKeys]);

  useEffect(() => {
    if (expr) {
      setExperimentsAndFeatureFlags(expr);
    }
  }, [expr, setExperimentsAndFeatureFlags]);

  return children;
};

export default AmplitudeProvider;
