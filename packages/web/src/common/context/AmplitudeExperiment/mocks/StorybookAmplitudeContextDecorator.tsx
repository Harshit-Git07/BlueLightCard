import { Decorator } from '@storybook/react';
import { ExperimentClient } from '@amplitude/experiment-js-client';
import { AuthedAmplitudeExperimentProvider } from '../provider';
import { as } from '@core/utils/testing';

export const StorybookAmplitudeContextDecorator: Decorator = (Story, { parameters }) => {
  const variants = {
    ...parameters.amplitudeContext?.variants,
  };

  const mockExperimentClient = {
    variant: (name: string) => {
      return variants[name] ?? 'off';
    },
  } satisfies Pick<ExperimentClient, 'variant'>;

  const experimentClientMock: () => Promise<ExperimentClient> = () =>
    Promise.resolve(as(mockExperimentClient));

  return (
    <AuthedAmplitudeExperimentProvider initExperimentClient={experimentClientMock}>
      <Story />
    </AuthedAmplitudeExperimentProvider>
  );
};
