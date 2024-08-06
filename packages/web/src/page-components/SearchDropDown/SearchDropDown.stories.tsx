import { Meta, StoryFn } from '@storybook/react';
import { SearchDropDownPresenter } from './SearchDropDown';

const componentMeta: Meta<typeof SearchDropDownPresenter> = {
  title: 'Components/SearchDropDown',
  component: SearchDropDownPresenter,
  argTypes: {},
  parameters: {
    controls: {
      exclude: [
        'categories',
        'companies',
        'isLoading',
        'onSearchCategoryChange',
        'onSearchCompanyChange',
      ],
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
        {
          id: '2',
          name: 'Holidays and travel',
          __typename: 'CategoryMenu',
        },
        {
          id: '10',
          name: 'Home and garden',
          __typename: 'CategoryMenu',
        },
        {
          id: '7',
          name: 'Motoring',
          __typename: 'CategoryMenu',
        },
      ],
      companies: [
        {
          id: '26529',
          name: ' Youth & Earth',
          __typename: 'CompanyMenu',
        },
        {
          id: '14779',
          name: '1 Stop Barber Shop ',
          __typename: 'CompanyMenu',
        },
        {
          id: '15939',
          name: '11 Degrees',
          __typename: 'CompanyMenu',
        },
        {
          id: '23876',
          name: '18montrose',
          __typename: 'CompanyMenu',
        },
        {
          id: '20128',
          name: '1st 4 Signs Ltd',
          __typename: 'CompanyMenu',
        },
        {
          id: '13571',
          name: '360 Play',
          __typename: 'CompanyMenu',
        },
        {
          id: '5961',
          name: '361 Property Management ',
          __typename: 'CompanyMenu',
        },
        {
          id: '15943',
          name: '3RD ROCK',
          __typename: 'CompanyMenu',
        },
        {
          id: '19750',
          name: '43T Clothing',
          __typename: 'CompanyMenu',
        },
      ],
    },
  },
};

const DefaultTemplate: StoryFn<typeof SearchDropDownPresenter> = (args) => (
  <SearchDropDownPresenter {...args}></SearchDropDownPresenter>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  categories: mockData.data.response.categories,
  companies: mockData.data.response.companies,
  isLoading: false,
  onSearchCategoryChange: () => {},
  onSearchCompanyChange: () => {},
};

export default componentMeta;
