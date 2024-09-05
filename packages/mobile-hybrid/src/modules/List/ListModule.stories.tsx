import { Meta, StoryFn } from '@storybook/react';
import List from './List';
import pageDecorator from '@storybook-config/pageDecorator';
import { ListVariant } from './types';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof List> = {
  title: 'Modules/List',
  component: List,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const Template: StoryFn<typeof List> = (args) => <List {...args} />;

export const Default = Template.bind({});
Default.args = {
  listVariant: ListVariant.Categories,
  entityId: 15,
};

export const Empty = Template.bind({});
Empty.args = {
  listVariant: ListVariant.Types,
  entityId: 16,
};

export default componentMeta;
