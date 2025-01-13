import { Meta, StoryFn } from '@storybook/react';
import PersonalInformation from '.';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PlatformAdapterProvider, storybookPlatformAdapter } from '@/adapters';
import React, { FC } from 'react';
import { PlatformVariant } from '@/types';
import { fonts } from '@/tailwind/theme';

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
        <div className="mt-[6px] flex flex-col gap-[24px]">
          <h2 className={fonts.titleLarge}>Personal Information</h2>
          <PersonalInformation />
        </div>
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
