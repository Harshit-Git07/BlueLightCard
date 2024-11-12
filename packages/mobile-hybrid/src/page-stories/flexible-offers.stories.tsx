import { Meta, StoryFn } from '@storybook/react';
import FlexibleOffersPage from '@/pages/flexible-offers';
import { StorybookPlatformAdapterDecorator, flexibleOfferMock } from '@bluelightcard/shared-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient();

const withQueryClientProvider = (Story: StoryFn) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

const componentMeta: Meta<typeof FlexibleOffersPage> = {
  title: 'Pages/FlexibleOffers',
  component: FlexibleOffersPage,
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/ts9XtrAAIbvPNJnZ56INRi/Globalisation?node-id=3905-33472&node-type=section&m=dev',
    },
    router: {
      pathname: '/flexible-offers',
      query: {
        id: 'list1',
      },
    },
    platformAdapter: {
      invokeV5Api: (path: string) =>
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: flexibleOfferMock,
          }),
        }),
    },
  },
  decorators: [StorybookPlatformAdapterDecorator, withQueryClientProvider],
};

const DefaultTemplate: StoryFn<typeof FlexibleOffersPage> = (args) => {
  return <FlexibleOffersPage {...args} />;
};

export const Success = DefaultTemplate.bind({});
Success.parameters = {
  ...DefaultTemplate.parameters,
};

export const Loading = DefaultTemplate.bind({});
Loading.parameters = {
  ...DefaultTemplate.parameters,
  nextjs: {
    router: {
      pathname: '/flexible-offers',
      query: {
        id: 'list2',
      },
    },
  },
  platformAdapter: {
    invokeV5Api: (path: string) => new Promise(() => {}),
  },
};

export const Error = DefaultTemplate.bind({});
Error.parameters = {
  ...DefaultTemplate.parameters,
  nextjs: {
    router: {
      pathname: '/flexible-offers',
      query: {
        id: 'list3',
      },
    },
  },
  platformAdapter: {
    invokeV5Api: () => Promise.resolve({ status: 500 }),
  },
};

export default componentMeta;
