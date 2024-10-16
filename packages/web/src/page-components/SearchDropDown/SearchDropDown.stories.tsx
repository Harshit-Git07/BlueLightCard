import { Meta, StoryFn } from '@storybook/react';
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import { SearchDropDownPresenter } from './SearchDropDown';
import { useState } from 'react';

const componentMeta: Meta<typeof SearchDropDownPresenter> = {
  title: 'Components/SearchDropDown',
  component: SearchDropDownPresenter,
  argTypes: {
    onSearchCategoryChange: { action: 'Category selected' },
    onSearchCompanyChange: { action: 'Company selected' },
    onClose: { action: 'Closed' },
  },
  parameters: {
    controls: {
      exclude: ['categories', 'companies', 'isLoading'],
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
          name: 'Youth & Earth',
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

const DefaultTemplate: StoryFn<typeof SearchDropDownPresenter> = (args) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categoriesForPillGroup = mockData.data.response.categories.map(({ id, name }) => ({
    id: Number(id),
    label: name,
    selected: selectedCategory === id,
  }));

  return (
    <SearchDropDownPresenter
      {...args}
      onSearchCategoryChange={(id: string, categoryName: string) => {
        args.onSearchCategoryChange(id, categoryName);
        setSelectedCategory(id);
      }}
      categoriesForPillGroup={categoriesForPillGroup}
    ></SearchDropDownPresenter>
  );
};

export const Default = DefaultTemplate.bind({});

Default.args = {
  companies: mockData.data.response.companies,
  isOpen: true,
};

export const Interaction = DefaultTemplate.bind({});

Interaction.args = {
  ...Default.args,
};
Interaction.argTypes = {
  onSearchCategoryChange: { action: 'Category selected' },
  onSearchCompanyChange: { action: 'Company selected' },
  onClose: { action: 'Closed' },
};
Interaction.play = async ({ canvasElement }) => {
  const category = within(canvasElement).getByText('Children and toys');
  fireEvent.click(category);

  const companyDropdown = within(canvasElement).getByPlaceholderText('Search for a company');
  await userEvent.type(companyDropdown, 'you');

  const company = await within(canvasElement).findByText('Youth & Earth');
  fireEvent.click(company);

  const overlay = within(canvasElement).getByTestId('search-dropdown-overlay');
  fireEvent.click(overlay);
};

export default componentMeta;
