import { Meta, StoryFn } from '@storybook/react';
import CompanyFilters from './CompanyFilters';

const ComponentMeta: Meta<typeof CompanyFilters> = {
  title: 'Component System/Company Filters',
  component: CompanyFilters,
  argTypes: {},
};

const Template: StoryFn<typeof CompanyFilters> = (args) => <CompanyFilters {...args} />;

export const Filters = Template.bind({});

Filters.args = {};

export default ComponentMeta;
