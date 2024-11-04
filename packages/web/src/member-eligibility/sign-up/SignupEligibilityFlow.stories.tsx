import { Meta, StoryFn } from '@storybook/react';
import { SignupEligibilityFlow } from './SignupEligibilityFlow';

const componentMeta: Meta<typeof SignupEligibilityFlow> = {
  title: 'Pages/Signup Eligibility Flow',
  component: SignupEligibilityFlow,
};

const DefaultTemplate: StoryFn<typeof SignupEligibilityFlow> = (args) => (
  <SignupEligibilityFlow {...args} />
);

export const EndToEnd = DefaultTemplate.bind({});

export default componentMeta;
