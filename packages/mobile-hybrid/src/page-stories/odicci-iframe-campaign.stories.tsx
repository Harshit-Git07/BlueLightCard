import { Meta, StoryFn } from '@storybook/react';
import OdicciIframeCampaignPage from '@/pages/odicci-iframe-campaign';

import pageDecorator from '@storybook-config/pageDecorator';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof OdicciIframeCampaignPage> = {
  title: 'Pages/OdicciIframeCampaignPage',
  component: OdicciIframeCampaignPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        query: {
          iframeUrl: 'https://campaign.odicci.com/#/2031feeae3808e7b8802',
        },
      },
    },
    platformAdapter: {
      invokeV5Api: (path: string) =>
        Promise.resolve({
          statusCode: 200,
          data: JSON.stringify({
            data: {
              uuid: 'mock-uuid-1',
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
        }),
    },
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof OdicciIframeCampaignPage> = (args) => (
  <OdicciIframeCampaignPage {...args} />
);

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
