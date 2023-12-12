import { Meta, StoryFn } from '@storybook/react';
import IndexPage from '@/pages/index';

import pageDecorator from '@storybook/pageDecorator';

const componentMeta: Meta<typeof IndexPage> = {
  title: 'Pages/IndexPage',
  component: IndexPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator],
};

const DefaultTemplate: StoryFn<typeof IndexPage> = (args) => <IndexPage {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
