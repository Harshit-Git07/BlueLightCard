import { Meta, StoryFn } from '@storybook/react';
import PersonalDetails from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '../../adapters';
import { FC } from 'react';
import { PlatformVariant } from '../../types';

type WrapperProps = {
  platform: PlatformVariant;
};

const Wrapper: FC<WrapperProps> = ({ platform }) => {
  const adapter = {
    ...storybookPlatformAdapter,
    platform,
  };
  return (
    <PlatformAdapterProvider adapter={adapter}>
      <QueryClientProvider client={new QueryClient()}>
        <PersonalDetails />
      </QueryClientProvider>
    </PlatformAdapterProvider>
  );
};

const componentMeta: Meta<typeof Wrapper> = {
  title: 'Organisms/Personal Details',
  component: Wrapper,
  argTypes: {
    platform: {
      control: 'select',
      options: [PlatformVariant.Web, PlatformVariant.MobileHybrid],
    },
  },
};

const Template: StoryFn<typeof Wrapper> = (args) => <Wrapper {...args} />;

export const Default = Template.bind({});
Default.args = {
  platform: PlatformVariant.Web,
};

export default componentMeta;
