import { Meta, StoryFn } from '@storybook/react';
import SearchResultsPage from '@/pages/searchresults';

import pageDecorator from '@storybook/pageDecorator';

const componentMeta: Meta<typeof SearchResultsPage> = {
  title: 'Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        query: {
          searchTerm: 'Nike',
        },
      },
    },
  },
  decorators: [pageDecorator],
};

const DefaultTemplate: StoryFn<typeof SearchResultsPage> = (args) => (
  <SearchResultsPage {...args} />
);

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
