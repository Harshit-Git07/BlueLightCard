import { Meta, StoryFn } from '@storybook/react';
import SearchResultsPage from '@/pages/searchresults';
import pageDecorator from '@storybook-config/pageDecorator';
import { useSetAtom } from 'jotai/index';
import { useEffect } from 'react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof SearchResultsPage> = {
  title: 'Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        query: {
          search: 'Nike',
        },
      },
    },
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof SearchResultsPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({});
  }, [setExperimentsAndFeatureFlags]);
  return <SearchResultsPage {...args} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

const CategoriesLinkFeatureTemplate: StoryFn<typeof SearchResultsPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.MODERN_CATEGORIES_HYBRID]: 'on' });
  }, [setExperimentsAndFeatureFlags]);

  return <SearchResultsPage {...args} />;
};

export const CategoriesLinksEnabled = CategoriesLinkFeatureTemplate.bind({});
CategoriesLinksEnabled.args = {};

export default componentMeta;
