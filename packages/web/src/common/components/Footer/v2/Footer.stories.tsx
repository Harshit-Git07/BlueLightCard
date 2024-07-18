import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';
import { AuthedAmplitudeExperimentProvider } from '../../../context/AmplitudeExperiment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockQueryClient = new QueryClient();

const componentMeta: Meta<typeof Footer> = {
  title: 'Component System/v2/Footer',
  component: Footer,
};

const DefaultTemplate: StoryFn<typeof Footer> = (args) => (
  <QueryClientProvider client={mockQueryClient}>
    <AuthedAmplitudeExperimentProvider>
      <Footer {...args} />
    </AuthedAmplitudeExperimentProvider>
  </QueryClientProvider>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  isAuthenticated: true,
};

export default componentMeta;
