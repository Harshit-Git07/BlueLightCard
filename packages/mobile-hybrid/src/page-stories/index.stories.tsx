import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import { useSetAtom } from 'jotai/index';
import { useEffect } from 'react';
import { experimentsAndFeatureFlags } from '@/components/AmplitudeProvider/store';
import { FeatureFlags } from '@/components/AmplitudeProvider/amplitudeKeys';
import IndexPage from '@/pages/index';
import pageDecorator from '@storybook-config/pageDecorator';

const componentMeta: Meta<typeof IndexPage> = {
  title: 'Pages/IndexPage',
  component: IndexPage,
  parameters: {
    layout: 'fullscreen',
    platformAdapter: {
      invokeV5Api: (path: string) =>
        Promise.resolve({
          statusCode: 200,
          data: JSON.stringify({
            data: [
              {
                id: '1',
                content: {
                  imageURL: '/spin_to_win.jpg',
                  iframeURL: 'https://api.odicci.com/widgets/iframe_loaders/8d11f7da521240eda77f',
                },
              },
            ],
          }),
        }),
    },
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof IndexPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);

  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.THANK_YOU_CAMPAIGN]: 'off' });
  }, [setExperimentsAndFeatureFlags]);

  return <IndexPage {...args} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {};

const ThankYouCampaignTemplate: StoryFn<typeof IndexPage> = (args) => {
  const setExperimentsAndFeatureFlags = useSetAtom(experimentsAndFeatureFlags);

  useEffect(() => {
    setExperimentsAndFeatureFlags({ [FeatureFlags.THANK_YOU_CAMPAIGN]: 'on' });
  }, [setExperimentsAndFeatureFlags]);

  return <IndexPage {...args} />;
};

export const ThankYouCampaign = ThankYouCampaignTemplate.bind({});
ThankYouCampaign.args = {};

export default componentMeta;
