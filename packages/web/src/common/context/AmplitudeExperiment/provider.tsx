import { useQuery } from '@tanstack/react-query';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { amplitudeExperimentClient } from '@/globals/amplitudeExperimentClient';
import { AmplitudeExperimentContext } from './context';
import { useContext } from 'react';
import UserContext, { User } from '@/context/User/UserContext';

async function _initExperimentClient(user: User): Promise<ExperimentClient> {
  await amplitudeExperimentClient.start({ user_id: user.uuid });

  return amplitudeExperimentClient;
}

export type Props = {
  children: React.ReactNode;
  initExperimentClient?: typeof _initExperimentClient;
};

/**
 * Provides the Amplitude Experiment client to the app when the user is authenticated.
 */
export function AuthedAmplitudeExperimentProvider({
  children,
  initExperimentClient = _initExperimentClient,
}: Props): JSX.Element {
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
