import { useQuery } from '@tanstack/react-query';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { amplitudeExperimentClient } from '@/globals/amplitudeExperimentClient';
import { AmplitudeExperimentContext } from './context';
import { useContext } from 'react';
import UserContext, { User } from '@/context/User/UserContext';
import getDeviceFingerprint from '../../utils/amplitude/getDeviceFingerprint';
import AmplitudeDeviceExperimentClient from '../../utils/amplitude/AmplitudeDeviceExperimentClient';
import { createStore } from 'jotai';
import { experimentsAndFeatureFlags } from '../../utils/amplitude/store';
import { transformObjVariants } from '../../utils/amplitude/transformObjVariants';

export const amplitudeStore = createStore();
async function _initExperimentClient(user: User): Promise<ExperimentClient> {
  await amplitudeExperimentClient.start({ user_id: user.uuid, device_id: getDeviceFingerprint() });

  const variants = transformObjVariants(amplitudeExperimentClient.all());
  amplitudeStore.set(experimentsAndFeatureFlags, variants);

  return amplitudeExperimentClient;
}

export type AuthedAmplitudeExperimentProviderProps = {
  children: React.ReactNode;
  initExperimentClient?: typeof _initExperimentClient;
};

/**
 * Provides the Amplitude Experiment client to the app when the user is authenticated.
 */
export function AuthedAmplitudeExperimentProvider({
  children,
  initExperimentClient = _initExperimentClient,
}: AuthedAmplitudeExperimentProviderProps): JSX.Element {
  const userCtx = useContext(UserContext);

  const queryClient = useQuery({
    queryKey: ['amplitudeExperimentClient'],
    queryFn: () => initExperimentClient(userCtx.user!),
    enabled: Boolean(userCtx.user),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <AmplitudeExperimentContext.Provider value={queryClient}>
      {children}
    </AmplitudeExperimentContext.Provider>
  );
}

async function _initExperimentClientLoggedOut(deviceId: string): Promise<ExperimentClient> {
  const client = await AmplitudeDeviceExperimentClient.Instance();

  const variants = transformObjVariants(amplitudeExperimentClient.all());
  amplitudeStore.set(experimentsAndFeatureFlags, variants);

  return client;
}

export type LoggedOutAmplitudeExperimentProviderProps = {
  children: React.ReactNode;
  initExperimentClient?: typeof _initExperimentClientLoggedOut;
};

/**
 * Provides the Amplitude Experiment client to the app when the user is not authenticated
 */
export function LoggedOutAmplitudeExperimentProvider({
  children,
  initExperimentClient = _initExperimentClientLoggedOut,
}: LoggedOutAmplitudeExperimentProviderProps): JSX.Element {
  const deviceFingerprint = getDeviceFingerprint();

  const queryClient = useQuery({
    queryKey: ['amplitudeExperimentClient'],
    queryFn: () => initExperimentClient(deviceFingerprint),
    enabled: Boolean(deviceFingerprint),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <AmplitudeExperimentContext.Provider value={queryClient}>
      {children}
    </AmplitudeExperimentContext.Provider>
  );
}
