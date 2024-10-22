import { Meta, StoryFn } from '@storybook/react';
import PaginationControls from './index';

const componentMeta: Meta = {
  title: 'Molecules/Pagination Controls',
  args: {
    totalPages: 50,
    currentPage: 1,
    disabled: false,
  },
  argTypes: {
    totalPages: {
      description: 'The total number of pages of results',
      type: 'number',
      defaultValue: 1,
    },
    currentPage: {
      description: 'The number of the page that is currently selected',
      type: 'number',
      defaultValue: 1,
    },
    disabled: {
      description: 'Flag to disable interaction with the pagination controls',
      type: 'boolean',
      defaultValue: false,
    },
    onPageChange: {
      description: 'Callback for when the user changes the selected page',
      action: 'Selected page changed',
    },
  },
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/ts9XtrAAIbvPNJnZ56INRi/Globalisation?node-id=4396-25232&t=DtuguYq6CHhYQY3C-4',
    },
  },
};

const DefaultTemplate: StoryFn = (args) => (
  <PaginationControls
    onPageChange={args.onPageChange}
    totalPages={args.totalCount}
    currentPage={args.currentPage}
    {...args}
  />
);

export const Default = DefaultTemplate.bind({});

export default componentMeta;
