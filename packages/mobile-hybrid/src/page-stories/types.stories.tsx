import { Meta, StoryFn } from '@storybook/react';
import TypesPage from '@/pages/types';
import pageDecorator from '@storybook-config/pageDecorator';
import { StorybookPlatformAdapterDecorator } from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof TypesPage> = {
  title: 'Pages/TypesPage',
  component: TypesPage,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      router: {
        query: {
          type: '5',
        },
      },
    },
  },
  decorators: [pageDecorator, StorybookPlatformAdapterDecorator],
};

const Template: StoryFn<typeof TypesPage> = () => <TypesPage />;

export const Default = Template.bind({});

export default componentMeta;
