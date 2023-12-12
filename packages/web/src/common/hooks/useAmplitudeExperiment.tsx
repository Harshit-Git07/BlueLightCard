import { useEffect, useState } from 'react';
import { Experiment } from '@amplitude/experiment-js-client';
import { AMPLITUDE_DEPLOYMENT_KEY } from '@/global-vars';
import { ReactElement, JSXElementConstructor } from 'react';

export class InvalidVariantsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidVariantsError';
  }
}

const experiment = Experiment.initializeWithAmplitudeAnalytics(AMPLITUDE_DEPLOYMENT_KEY, {
  serverZone: 'eu',
});

const useAmplitudeExperiment = (
  experimentFlag: string,
  components: {
    variantName: string;
    component: React.ReactElement;
  }[],
  defaultVariant?: string
) => {
  const defaultVariantName = defaultVariant ?? 'control';
  const [component, setComponent] = useState<
    ReactElement<any, string | JSXElementConstructor<any>> | undefined
  >();

  const [error, setError] = useState<InvalidVariantsError | string | undefined>();

  useEffect(() => {
    async function startExperiment() {
      await experiment.start();

      const variant = experiment.variant(experimentFlag, { value: defaultVariantName });
      const comp = components.find((comp) => comp.variantName === variant.value)?.component;

      // Set the component if it exists
      if (comp) {
        setComponent(comp);
        return;
      }

      // Look for the default variant if the variant doesn't exist
      const defaultComp = components.find(
        (comp) => comp.variantName === defaultVariantName
      )?.component;

      if (defaultComp) {
        setComponent(defaultComp);
        return;
      }

      // Error if the variant and default variant don't exist
      setError(
        new InvalidVariantsError(
          `Could not find component for variant '${variant.value}' and also could not find component to default too for variant '${defaultVariantName}'.`
        )
      );
    }

    try {
      startExperiment();
    } catch (error: any) {
      setError(error.message);
    }
  }, [components, defaultVariantName, experimentFlag]);

  return { component, error };
};

export default useAmplitudeExperiment;
