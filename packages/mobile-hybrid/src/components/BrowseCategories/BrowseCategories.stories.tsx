import BrowseCategories from './BrowseCategories';
import { StoryFn, Meta } from '@storybook/react';

const componentMeta: Meta<typeof BrowseCategories> = {
  title: 'BrowseCategories',
  component: BrowseCategories,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof BrowseCategories> = (args) => <BrowseCategories {...args} />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
