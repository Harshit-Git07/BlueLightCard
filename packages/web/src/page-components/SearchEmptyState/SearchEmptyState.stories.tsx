import { Meta, StoryFn } from '@storybook/react';
import { SearchEmptyStatePresenter } from './SearchEmptyState';

const componentMeta: Meta<typeof SearchEmptyStatePresenter> = {
  title: 'Components/SearchEmptyState',
  component: SearchEmptyStatePresenter,
  argTypes: {},
  parameters: {
    controls: {
      exclude: ['categories', 'onSearchCategoryChange'],
    },
  },
};

const mockData = {
  data: {
    response: {
      categories: [
        {
          id: '11',
          name: 'Children and toys',
          __typename: 'CategoryMenu',
        },
        {
          id: '3',
          name: 'Days out',
          __typename: 'CategoryMenu',
        },
        {
          id: '1',
          name: 'Electrical and phones',
          __typename: 'CategoryMenu',
        },
        {
          id: '6',
          name: 'Entertainment',
          __typename: 'CategoryMenu',
        },
        {
          id: '8',
          name: 'Fashion',
          __typename: 'CategoryMenu',
        },
        {
          id: '16',
          name: 'Featured',
          __typename: 'CategoryMenu',
        },
        {
          id: '9',
          name: 'Financial and insurance',
          __typename: 'CategoryMenu',
        },
        {
          id: '15',
          name: 'Food and drink',
          __typename: 'CategoryMenu',
        },
        {
          id: '5',
          name: 'Gifts',
          __typename: 'CategoryMenu',
        },
        {
          id: '4',
          name: 'Health and beauty',
          __typename: 'CategoryMenu',
        },
      ],
    },
  },
};

const DefaultTemplate: StoryFn<typeof SearchEmptyStatePresenter> = (args) => (
  <SearchEmptyStatePresenter {...args}></SearchEmptyStatePresenter>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  categories: mockData.data.response.categories,
  onSearchCategoryChange: () => {},
};

export default componentMeta;
