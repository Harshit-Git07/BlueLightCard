import { Meta, StoryFn } from '@storybook/react';
import Badge from './Badge';
import { BadgeVariant } from '@/app/common/types/theme';

const componentMeta: Meta<typeof Badge> = {
  title: 'member-services-hub/Badge Component',
  component: Badge,
};

const Template: StoryFn<typeof Badge> = (args) => (
  <Badge {...args} data-testid="danger-badge">
    Badge
  </Badge>
);

export const Default = Template.bind({});

Default.args = {
  type: BadgeVariant.Danger,
  text: 'Danger',
};

export default componentMeta;
