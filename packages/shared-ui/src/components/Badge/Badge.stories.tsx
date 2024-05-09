import { Meta, StoryFn } from '@storybook/react';
import Badge from '.';

const componentMeta: Meta<typeof Badge> = {
  title: 'Component System/Badge',
  component: Badge,
};

const BadgeTemplate: StoryFn<typeof Badge> = (args) => <Badge {...args} />;

export const Default = BadgeTemplate.bind({});

Default.args = {
  label: 'Online',
  color: 'bg-[#BCA5F7]',
  size: 'large',
};

export default componentMeta;
