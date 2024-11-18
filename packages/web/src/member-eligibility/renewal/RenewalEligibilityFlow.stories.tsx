import { Meta, StoryFn } from '@storybook/react';
import { RenewalEligibilityFlow } from './RenewalEligibilityFlow';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/adapters';

const componentMeta: Meta<typeof RenewalEligibilityFlow> = {
  title: 'Pages/Renewal Eligibility Flow',
  component: RenewalEligibilityFlow,
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

const DefaultTemplate: StoryFn<typeof RenewalEligibilityFlow> = (args) => (
  <RenewalEligibilityFlow {...args} />
);

export const EndToEnd = DefaultTemplate.bind({});

export default componentMeta;
