import { Meta, StoryFn } from '@storybook/react';
import FlexibleOffersPage from '@/pages/flexible-offers';
import {
  StorybookPlatformAdapterDecorator,
  StorybookSharedUIConfigDecorator,
  flexibleOfferMock,
} from '@bluelightcard/shared-ui';

const componentMeta: Meta<typeof FlexibleOffersPage> = {
  title: 'Pages/Flexible Offers',
  component: FlexibleOffersPage,
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/ts9XtrAAIbvPNJnZ56INRi/Globalisation?node-id=3905-33471&t=HVue23wnnJZAUOEK-4',
    },
    router: {
      pathname: '/flexible-offers',
      query: {
        id: 'list1',
      },
    },
    platformAdapter: {
      invokeV5Api: () =>
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: flexibleOfferMock,
          }),
        }),
    },
  },
  decorators: [StorybookSharedUIConfigDecorator, StorybookPlatformAdapterDecorator],
};

const DefaultTemplate: StoryFn<typeof FlexibleOffersPage> = (args) => {
  return <FlexibleOffersPage {...args} />;
};

export const Success = DefaultTemplate.bind({});
Success.parameters = {
  ...DefaultTemplate.parameters,
};

export const WithCmsOffers = DefaultTemplate.bind({});
WithCmsOffers.parameters = {
  ...DefaultTemplate.parameters,
  plaformAdapter: {
    ...DefaultTemplate.parameters?.platformAdapter,
    getAmplitudeFeatureFlag: () => 'on',
  },
};

export const Loading = DefaultTemplate.bind({});
Loading.parameters = {
  ...DefaultTemplate.parameters,
  router: {
    pathname: '/flexible-offers',
    query: {
      id: 'list2',
    },
  },
  platformAdapter: {
    invokeV5Api: () => new Promise(() => {}),
  },
};

export const Error = DefaultTemplate.bind({});
Error.parameters = {
  ...DefaultTemplate.parameters,
  router: {
    pathname: '/flexible-offers',
    query: {
      id: 'list3',
    },
  },
  platformAdapter: {
    invokeV5Api: () => Promise.resolve({ status: 500 }),
  },
};

export default componentMeta;
