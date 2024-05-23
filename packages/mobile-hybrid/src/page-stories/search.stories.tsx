import { Meta, StoryFn } from '@storybook/react';
import pageDecorator from '@storybook/pageDecorator';
import { useSetAtom } from 'jotai/index';
import { useEffect } from 'react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import SearchPage from '@/pages/search';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui/src/adapters/StorybookPlatformAdapter';

const componentMeta: Meta<typeof SearchPage> = {
  title: 'Pages/SearchPage',
  component: SearchPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof SearchPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({});
  }, [setExperimentsAndFeatureFlags]);
  return <SearchPage {...args} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {};

const OffersNearYouLinkFeatureTemplate: StoryFn<typeof SearchPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'on' });
  }, [setExperimentsAndFeatureFlags]);

  return <SearchPage {...args} />;
};

export const OffersNearYouLinkEnabled = OffersNearYouLinkFeatureTemplate.bind({});
OffersNearYouLinkEnabled.args = {};

const SearchForBrandsLinkFeatureTemplate: StoryFn<typeof SearchPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'on' });
  }, [setExperimentsAndFeatureFlags]);

  return <SearchPage {...args} />;
};

export const SearchForBrandsLinkEnabled = SearchForBrandsLinkFeatureTemplate.bind({});
SearchForBrandsLinkEnabled.args = {};

const CategoriesLinksFeatureTemplate: StoryFn<typeof SearchPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'on' });
  }, [setExperimentsAndFeatureFlags]);

  return <SearchPage {...args} />;
};

export const CategoriesLinksEnabled = CategoriesLinksFeatureTemplate.bind({});
CategoriesLinksEnabled.args = {};

const AllFeaturesTemplate: StoryFn<typeof SearchPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({
      [FeatureFlags.SEARCH_START_PAGE_CATEGORIES_LINKS]: 'on',
      [FeatureFlags.SEARCH_START_PAGE_BRANDS_LINK]: 'on',
      [FeatureFlags.SEARCH_START_PAGE_OFFERS_NEAR_YOU_LINK]: 'on',
    });
  }, [setExperimentsAndFeatureFlags]);

  return <SearchPage {...args} />;
};

export const AllFeaturesEnabled = AllFeaturesTemplate.bind({});
AllFeaturesEnabled.args = {};

export default componentMeta;
