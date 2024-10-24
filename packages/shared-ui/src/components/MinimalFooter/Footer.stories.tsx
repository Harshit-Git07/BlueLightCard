import { Meta, StoryFn } from '@storybook/react';
import MinimalFooter from '.';

const meta: Meta<typeof MinimalFooter> = {
  title: 'Component System/Minimal Footer',
  component: MinimalFooter,
};

const FooterTemplate: StoryFn<typeof MinimalFooter> = (args) => <MinimalFooter />;
export const Default = FooterTemplate.bind({});
Default.args = {};

export default meta;
