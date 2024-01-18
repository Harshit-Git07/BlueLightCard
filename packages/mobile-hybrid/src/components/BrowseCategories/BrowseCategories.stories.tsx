import BrowseCategories from './BrowseCategories';
import { StoryFn, Meta } from '@storybook/react';
import BrowseCategoriesData from 'data/BrowseCategories';

const componentMeta: Meta<typeof BrowseCategories> = {
  title: 'BrowseCategories',
  component: BrowseCategories,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof BrowseCategories> = (args) => <BrowseCategories {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  categories: BrowseCategoriesData,
};

export default componentMeta;
