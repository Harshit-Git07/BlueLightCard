import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import IndexPage from '@/pages/index';
import pageDecorator from '@storybook-config/pageDecorator';

const componentMeta: Meta<typeof IndexPage> = {
  title: 'Pages/IndexPage',
  component: IndexPage,
  parameters: {
    layout: 'fullscreen',
    platformAdapter: {
      invokeV5Api: (path: string) => {
        if (path.includes('/identity/user')) {
          return Promise.resolve({
            statusCode: 200,
            data: JSON.stringify({
              data: {
                uuid: 'mock-uuid-1',
                canRedeemOffer: true,
                profile: {
                  firstname: 'string',
                  surname: 'string',
                  organisation: 'string',
                  dob: '1990-01-01',
                  service: undefined,
                  isAgeGated: true,
                },
              },
            }),
          });
        }

        if (path.includes('/discovery/campaigns')) {
          return Promise.resolve({
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
          });
        }
      },
    },
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof IndexPage> = (args) => {
  return <IndexPage {...args} />;
};

export const Default = DefaultTemplate.bind({});

Default.args = {};

const ThankYouCampaignTemplate: StoryFn<typeof IndexPage> = (args) => {
  return <IndexPage {...args} />;
};

export const ThankYouCampaign = ThankYouCampaignTemplate.bind({});
ThankYouCampaign.args = {};

export default componentMeta;
