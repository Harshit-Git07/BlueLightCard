import { Meta, StoryFn } from '@storybook/react';
import VerifyInfoCard from './VerifyInfoCard';

const componentMeta: Meta<typeof VerifyInfoCard> = {
  title: 'Component System/Verify/VerifyInfoCard',
  component: VerifyInfoCard,
  argTypes: { title: { control: 'text' } },
};

const DefaultTemplate: StoryFn<typeof VerifyInfoCard> = (args) => (
  <VerifyInfoCard {...args}></VerifyInfoCard>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'Collect valuable insights',
  children: (
    <p>
      Each time a member ships with you, <b>Verify</b> allows you to understand where and when they
      are using your discount. These insights allow you to create specific member cohorts and target
      them directly to help you achieve your objectives.
    </p>
  ),

  imageAlt: 'Acquire new members image',
  imageSrc: '/assets/verify/verify-illo-collect-data.svg',
};

export default componentMeta;
