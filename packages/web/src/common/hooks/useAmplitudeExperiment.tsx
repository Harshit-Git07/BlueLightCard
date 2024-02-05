import { useContext, useEffect, useState } from 'react';
import { Experiment } from '@amplitude/experiment-js-client';
import { AMPLITUDE_DEPLOYMENT_KEY } from '@/global-vars';
import { ReactElement, JSXElementConstructor } from 'react';
import AuthContext from '@/context/Auth/AuthContext';
import UserContext from '@/context/User/UserContext';

export class InvalidVariantsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidVariantsError';
  }
}

const experiment = Experiment.initializeWithAmplitudeAnalytics(AMPLITUDE_DEPLOYMENT_KEY, {
  serverZone: 'eu',
});

type VariantInput = {
  variantName: string;
  component: React.ReactElement;
};

function getVariant(
  variantName: string,
  components: VariantInput[]
): React.ReactElement | undefined {
  return components.find((comp) => comp.variantName === variantName)?.component;
}

const useAmplitudeExperiment = (
  experimentFlag: string,
  components: VariantInput[],
  defaultVariant?: string,
  allowUnauthorised: boolean = false
) => {
  const defaultVariantName = defaultVariant ?? 'control';
  const [component, setComponent] = useState<
    ReactElement<any, string | JSXElementConstructor<any>> | undefined
  >();

  const [error, setError] = useState<InvalidVariantsError | string | undefined>();

  const [selectedVariantName, setSelectedVariantName] = useState<string | undefined>();

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  function setComponentToDefault() {
    const comp = getVariant(defaultVariantName, components);
    if (comp) {
      setComponent(comp);
      setSelectedVariantName(defaultVariantName);
    } else
      throw new InvalidVariantsError(
        `Could not find a component for default variant: '${defaultVariantName}'}`
      );
  }

  useEffect(() => {
    async function startExperiment(user: { user_id?: string; device_id?: string }) {
      await experiment.start(user);

      const variant = experiment.variant(experimentFlag, {
        value: defaultVariantName,
        key: defaultVariantName,
      });
      const comp = getVariant(variant.value ?? defaultVariantName, components);

      // Set the component if it exists
      if (comp) {
        setComponent(comp);
        setSelectedVariantName(variant.value ?? defaultVariantName);
        return;
      }

      // Look for the default variant if the variant doesn't exist
      // Error if the variant and default variant don't exist
      try {
        setComponentToDefault();
      } catch (error) {
        setError(
          new InvalidVariantsError(
            `Could not find component for variant '${variant.value}' and also could not find component to default too for variant '${defaultVariantName}'.`
          )
        );
      }
    }

    // Only trigger experiment fetch after auth has completed so we can pass the user id to experiement
    if (!allowUnauthorised && !authCtx.isReady) {
      setComponentToDefault();
      setError('Waiting on authorisation check.');
      return;
    }

    if (userCtx.user) {
      try {
        startExperiment({ user_id: userCtx.user.uuid });
      } catch (error: any) {
        setError(error.message);
      }
    } else {
      try {
        startExperiment({});
      } catch (error: any) {
        setError(error.message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authCtx.isReady, userCtx.user]);

  return { component, error, variantName: selectedVariantName };
};

export default useAmplitudeExperiment;
