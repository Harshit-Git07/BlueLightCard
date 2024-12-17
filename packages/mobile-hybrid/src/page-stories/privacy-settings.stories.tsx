import { Meta, StoryFn } from '@storybook/react';
import pageDecorator from '@storybook-config/pageDecorator';
import PrivacySettingsPage from '@/pages/privacy-settings';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof PrivacySettingsPage> = {
  title: 'Pages/PrivacySettingsPage',
  component: PrivacySettingsPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof PrivacySettingsPage> = (args) => {
  return <PrivacySettingsPage {...args} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

export default componentMeta;
