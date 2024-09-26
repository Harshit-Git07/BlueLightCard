import { Meta, StoryFn } from '@storybook/react';
import NotificationItem from './NotificationItem';
import { action } from '@storybook/addon-actions';

const componentMeta: Meta<typeof NotificationItem> = {
  title: 'NotificationItem',
  component: NotificationItem,
};

const DefaultTemplate: StoryFn<typeof NotificationItem> = (args) => <NotificationItem {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'Notification text goes here it can span multiple lines like this',
  subtext: 'sub text',
  onClick: action('onClick'),
};

export default componentMeta;
