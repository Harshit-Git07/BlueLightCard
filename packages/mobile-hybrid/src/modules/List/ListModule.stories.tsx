import { Meta, StoryFn } from '@storybook/react';
import List from './List';
import pageDecorator from '@storybook/pageDecorator';
import { ListVariant } from './types';
import { userService } from '@/components/UserServiceProvider/store';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';

const componentMeta: Meta<typeof List> = {
  title: 'Modules/List',
  component: List,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator],
};

const Template: StoryFn<typeof List> = (args) => (
  <JotaiTestProvider initialValues={[[userService, 'NHS']]}>
    <List {...args} />
  </JotaiTestProvider>
);

export const Default = Template.bind({});
Default.args = {
  listVariant: ListVariant.Categories,
  entityId: 15,
};

export default componentMeta;
