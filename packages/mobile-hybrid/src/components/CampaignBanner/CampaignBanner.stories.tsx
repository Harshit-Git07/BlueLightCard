import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';
import CampaignBanner from './index';

const componentMeta: Meta<typeof CampaignBanner> = {
  title: 'Campaign Banner',
  component: CampaignBanner,
  decorators: [StorybookPlatformAdapterDecorator],
  argTypes: {
    onClick: { action: 'Banner clicked' },
  },
  parameters: {
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
};

const DefaultTemplate: StoryFn<typeof CampaignBanner> = (args) => <CampaignBanner {...args} />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
