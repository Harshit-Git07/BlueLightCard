import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';
import { AuthedAmplitudeExperimentProvider } from '../../../context/AmplitudeExperiment';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { FC } from 'react';
import { FooterProps } from './types';

const mockQueryClient = new QueryClient();

// const FooterTemplate: FC<FooterProps> = ({ ...args }) => {
//   const mockClientQuery = useQuery({
//     queryKey: ['amplitudeExperimentClient'],
//     queryFn: () =>
//       ({
//         variant: () => ({}),
//       } as any),
//     enabled: true,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//   });
//   return (
//     <AmplitudeExperimentContext.Provider value={mockClientQuery}>
//       <Footer {...args} />
//     </AmplitudeExperimentContext.Provider>
//   );
// };

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
