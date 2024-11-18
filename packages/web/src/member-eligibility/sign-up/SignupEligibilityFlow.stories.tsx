import { Meta, StoryFn } from '@storybook/react';
import { SignupEligibilityFlow } from './SignupEligibilityFlow';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof SignupEligibilityFlow> = {
  title: 'Pages/Signup Eligibility Flow',
  component: SignupEligibilityFlow,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
    platformAdapter: {
      invokeV5Api: async (path: string) => {
        if (!path.includes('/orders/checkout')) return undefined;

        return {
          statusCode: 503,
        };
      },
    },
  },
};

const DefaultTemplate: StoryFn<typeof SignupEligibilityFlow> = (args) => (
  <SignupEligibilityFlow {...args} />
);

export const EndToEnd = DefaultTemplate.bind({});

export default componentMeta;
