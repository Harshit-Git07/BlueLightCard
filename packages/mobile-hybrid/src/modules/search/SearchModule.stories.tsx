import { Meta, StoryFn } from '@storybook/react';
import SearchModule from './';
import { useSetAtom } from 'jotai/index';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { useEffect } from 'react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';

const componentMeta: Meta<typeof SearchModule> = {
  title: 'Modules/Search',
  component: SearchModule,
  decorators: [StorybookPlatformAdapterDecorator],
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: StoryFn<typeof SearchModule> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({});
  }, [setExperimentsAndFeatureFlags]);
  return <SearchModule {...args} />;
};

const RecentSearchesTemplate: StoryFn<typeof SearchModule> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);
  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.SEARCH_RECENT_SEARCHES]: 'on' });
  }, [setExperimentsAndFeatureFlags]);
  return <SearchModule {...args} />;
};

export const Default = Template.bind({});
Default.args = {};

export const RecentSearchesEnabled = RecentSearchesTemplate.bind({});
RecentSearchesEnabled.args = {};

export default componentMeta;
