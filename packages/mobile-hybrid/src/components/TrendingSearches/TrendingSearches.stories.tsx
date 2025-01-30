import TrendingSearches from './TrendingSearches';
import { StoryFn, Meta } from '@storybook/react';
import TrendingSearchesData from '@/data/TrendingSearches';

const componentMeta: Meta<typeof TrendingSearches> = {
  title: 'TrendingSearches',
  component: TrendingSearches,
  parameters: {
    layout: 'fullscreen',
  },
};

const DefaultTemplate: StoryFn<typeof TrendingSearches> = (args) => <TrendingSearches {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  trendingSearches: TrendingSearchesData,
};

export default componentMeta;
