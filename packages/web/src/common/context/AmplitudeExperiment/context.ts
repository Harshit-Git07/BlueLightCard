import { UseQueryResult } from '@tanstack/react-query';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { createContext } from 'react';

export const AmplitudeExperimentContext = createContext<UseQueryResult<
  ExperimentClient,
  Error
> | null>(null);
