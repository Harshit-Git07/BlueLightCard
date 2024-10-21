import { Meta, StoryFn } from '@storybook/react';
import Pagination from './Pagination';

const componentMeta: Meta<typeof Pagination> = {
  title: 'member-services-hub/Pagination Component',
  component: Pagination,
  argTypes: {
    totalPages: { control: 'number' },
    page: { control: 'number' },
    onChange: { action: 'pageChanged' },
  },
};

const Template: StoryFn<typeof Pagination> = (args) => <Pagination {...args} />;

export const Default = Template.bind({});
Default.args = {
  totalPages: 10,
  page: 1,
};

export const MiddlePage = Template.bind({});
MiddlePage.args = {
  totalPages: 10,
  page: 5,
};

export const LastPage = Template.bind({});
LastPage.args = {
  totalPages: 10,
  page: 10,
};

export default componentMeta;
