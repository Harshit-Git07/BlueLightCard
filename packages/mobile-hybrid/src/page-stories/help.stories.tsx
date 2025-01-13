import { Meta, StoryFn } from '@storybook/react';
import pageDecorator from '@storybook-config/pageDecorator';
import HelpPage from '@/pages/help';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof HelpPage> = {
  title: 'Pages/HelpPage',
  component: HelpPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof HelpPage> = (args) => {
  return <HelpPage {...args} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

export default componentMeta;
