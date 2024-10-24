import { Meta, StoryFn } from '@storybook/react';
import NotificationItem from './NotificationItem';

const componentMeta: Meta<typeof NotificationItem> = {
  title: 'NotificationItem',
  component: NotificationItem,
  argTypes: {
    onClick: { action: 'notification clicked' },
  },
};

const DefaultTemplate: StoryFn<typeof NotificationItem> = (args) => <NotificationItem {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  id: 'test-notification-one',
  title: 'Notification text goes here it can span multiple lines like this',
  subtext: 'sub text',
  isClicked: false,
};

export default componentMeta;
