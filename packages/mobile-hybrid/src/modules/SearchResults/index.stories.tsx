import { Meta, StoryFn } from '@storybook/react';
import { useSetAtom } from 'jotai';
import SearchResultsModule from '@/modules/SearchResults';

import pageDecorator from '@storybook/pageDecorator';
import { useEffect } from 'react';
import { searchTerm } from './store';

const componentMeta: Meta<typeof SearchResultsModule> = {
  title: 'Modules/SearchResults',
  component: SearchResultsModule,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator],
};

const DefaultTemplate: StoryFn<typeof SearchResultsModule> = (args) => {
  const setTerm = useSetAtom(searchTerm);
  useEffect(() => {
    setTerm({ term: 'The' });
  }, [setTerm]);
  return <SearchResultsModule {...args} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
