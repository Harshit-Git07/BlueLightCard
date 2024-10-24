import { Meta, StoryFn } from '@storybook/react';
import Notifications from '@/pages/notifications';
import pageDecorator from '@storybook-config/pageDecorator';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof Notifications> = {
  title: 'Pages/NotificationsPage',
  component: Notifications,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof Notifications> = (args) => <Notifications {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
