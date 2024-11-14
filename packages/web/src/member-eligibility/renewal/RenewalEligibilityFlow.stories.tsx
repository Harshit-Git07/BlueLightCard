import { Meta, StoryFn } from '@storybook/react';
import { RenewalEligibilityFlow } from './RenewalEligibilityFlow';

const componentMeta: Meta<typeof RenewalEligibilityFlow> = {
  title: 'Pages/Renewal Eligibility Flow',
  component: RenewalEligibilityFlow,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof RenewalEligibilityFlow> = (args) => (
  <RenewalEligibilityFlow {...args} />
);

export const EndToEnd = DefaultTemplate.bind({});

export default componentMeta;
