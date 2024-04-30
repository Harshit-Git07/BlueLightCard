import { UseQueryResult } from '@tanstack/react-query';
import { useContext, useEffect, useMemo, useState } from 'react';
import { AmplitudeExperimentContext } from './context';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { UseDerivedQueryResult, useDerivedQuery } from '@/hooks/useDerivedQuery';
import AmplitudeDeviceExperimentClient from '../../utils/amplitude/AmplitudeDeviceExperimentClient';

export function useAmplitudeExperimentClient(): UseQueryResult<ExperimentClient, Error> {
  const client = useContext(AmplitudeExperimentContext);

  if (!client) {
    throw new Error(
      'useAmplitudeExperimentClient must be used within a AuthedAmplitudeExperimentProvider'
    );
  }

  return client;
}

export type Variant<TVariant = string> = {
  variantName: TVariant;
};

export function useAmplitudeExperiment(
  experimentFlag: string,
  defaultVariant: string,
  deviceId?: string
): UseDerivedQueryResult<Variant, Error> {
  const clientQuery = useAmplitudeExperimentClient();
  const [deviceExperimentClient, setDeviceExperimentClient] = useState<ExperimentClient | null>(
    null
  );

  useEffect(() => {
    async function setUpDeviceExperimentClient() {
      const instance = await AmplitudeDeviceExperimentClient.Instance();
      setDeviceExperimentClient(instance);
    }

    if (deviceId) {
      setUpDeviceExperimentClient();
    }
  }, [deviceId]);

  return useDerivedQuery({
    query: clientQuery,
    queryKey: ['amplitudeExperiment', experimentFlag, defaultVariant],
    transformData(client) {
      let variant;

      if (deviceId && deviceExperimentClient) {
        variant = deviceExperimentClient.variant(experimentFlag, defaultVariant);
      } else {
        variant = client.variant(experimentFlag, defaultVariant);
      }

      return {
        variantName: variant.value ?? defaultVariant,
      };
    },
  });
}

export type ComponentVariant<TVariant = string> = Variant<TVariant> & {
  component: React.ReactElement;
};

export function useAmplitudeExperimentComponent<TVariant extends string>(
  experimentFlag: string,
  components: Record<TVariant, () => React.ReactElement>,
  defaultVariant: NoInfer<TVariant>,
  deviceId?: string
): UseDerivedQueryResult<ComponentVariant<TVariant>, Error> {
  const clientQuery = useAmplitudeExperimentClient();
  const [deviceExperimentClient, setDeviceExperimentClient] = useState<ExperimentClient | null>(
    null
  );

  useEffect(() => {
    async function setUpDeviceExperimentClient() {
      const instance = await AmplitudeDeviceExperimentClient.Instance();
      setDeviceExperimentClient(instance);
    }

    if (deviceId) {
      setUpDeviceExperimentClient();
    }
  }, [deviceId]);

  return useDerivedQuery({
    query: clientQuery,
    queryKey: ['amplitudeExperiment', experimentFlag, defaultVariant],
    transformData(client) {
      let variant;

      if (deviceId && deviceExperimentClient) {
        variant = deviceExperimentClient.variant(experimentFlag, defaultVariant);
      } else {
        variant = client.variant(experimentFlag, defaultVariant);
      }

      if (!variant.value || !(variant.value in components)) {
        return {
          variantName: defaultVariant,
          component: components[defaultVariant](),
        };
      }

      return {
        variantName: variant.value as TVariant,
        component: components[variant.value as TVariant](),
      };
    },
  });
}
