import { Meta, StoryFn } from '@storybook/react';
import { withFetchMock } from 'storybook-addon-fetch-mock';
import CategoryPage from '@/pages/category';
import {
  StorybookPlatformAdapterDecorator,
  StorybookSharedUIConfigDecorator,
  allMenusMock,
  categoryMock,
} from '@bluelightcard/shared-ui';
import { AmplitudeExperimentFlags } from '../common/utils/amplitude/AmplitudeExperimentFlags';
import { StorybookAmplitudeContextDecorator } from '../common/context/AmplitudeExperiment/mocks/StorybookAmplitudeContextDecorator';
import { StorybookAuthContextDecorator } from '../common/context/Auth/mocks/StorybookAuthContextDecorator';
import { StorybookUserContextDecorator } from '../common/context/User/mocks/StorybookUserContextDecorator';
import { V5_API_URL } from '../common/globals/apiUrl';
import StorybookGraphQLMock from '@/root/src/graphql/mocks/StorybookGraphQLMock';

const componentMeta: Meta<typeof CategoryPage> = {
  title: 'Pages/Category',
  component: CategoryPage,
  parameters: {
    status: 'wip',
    amplitudeContext: {
      variants: {
        [AmplitudeExperimentFlags.BRAZE_CONTENT_CARDS_ENABLED]: 'control',
      },
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/ts9XtrAAIbvPNJnZ56INRi/Globalisation?node-id=4396-24356&t=Xx7hBhRABrhxphAT-4',
    },
    fetchMock: {
      mocks: [StorybookGraphQLMock],
    },
    router: {
      pathname: '/category',
      query: {
        id: 'category1',
      },
    },
    platformAdapter: {
      invokeV5Api: async (path: string) => {
        if (path.includes(V5_API_URL.Menus)) {
          return Promise.resolve({
            status: 200,
            data: JSON.stringify({
              data: allMenusMock,
            }),
          });
        }

        if (path.includes(V5_API_URL.Categories)) {
          return Promise.resolve({
            status: 200,
            data: JSON.stringify({
              data: categoryMock,
            }),
          });
        }
      },
    },
  },
  decorators: [
    withFetchMock,
    StorybookAuthContextDecorator,
    StorybookAmplitudeContextDecorator,
    StorybookUserContextDecorator,
    StorybookSharedUIConfigDecorator,
    StorybookPlatformAdapterDecorator,
  ],
};

const DefaultTemplate: StoryFn<typeof CategoryPage> = (args) => {
  return <CategoryPage {...args} />;
};

export const Success = DefaultTemplate.bind({});
Success.parameters = {
  ...DefaultTemplate.parameters,
};

export const WithPagination = DefaultTemplate.bind({});
WithPagination.parameters = {
  ...DefaultTemplate.parameters,
  router: {
    pathname: '/category',
    query: {
      id: 'category-paginated',
    },
  },
  platformAdapter: {
    invokeV5Api: async (path: string) => {
      if (path.includes(V5_API_URL.Menus)) {
        return Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: allMenusMock,
          }),
        });
      }

      if (path.includes(V5_API_URL.Categories)) {
        const categoryData = { ...categoryMock, data: [...categoryMock.data] };
        const [offer] = categoryData.data;
        for (const mockOfferNumber of Array.from({ length: 73 }, (_, index) => index + 2)) {
          categoryData.data.push({
            ...offer,
            offerID: `${offer.offerID}-${mockOfferNumber}`,
            offerName: offer.offerName.replace('1', mockOfferNumber.toString()),
          });
        }

        return Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: categoryData,
          }),
        });
      }
    },
  },
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
    pathname: '/category',
    query: {
      id: 'category2',
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
    pathname: '/category',
    query: {
      id: 'category3',
    },
  },
  platformAdapter: {
    invokeV5Api: () => Promise.resolve({ status: 500 }),
  },
};

export default componentMeta;
