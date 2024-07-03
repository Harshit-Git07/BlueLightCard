import { Meta, StoryFn } from '@storybook/react';
import Badge from '.';

const componentMeta: Meta<typeof Badge> = {
  title: 'Component System/Badge',
  component: Badge,
};

const BadgeTemplate: StoryFn<typeof Badge> = (args) => <Badge {...args} />;

export const Large = BadgeTemplate.bind({});

Large.args = {
  label: 'Online',
  color: 'bg-badge-online-bg-colour-light',
  size: 'large',
};
export const Small = BadgeTemplate.bind({});

Small.args = {
  label: 'In-store',
  color: 'bg-badge-instore-bg-colour-light',
  size: 'small',
};

export default componentMeta;
