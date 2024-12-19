import { Decorator, Meta, StoryFn } from '@storybook/react';
import CategoryPage from '@/pages/category';
import {
  StorybookPlatformAdapterDecorator,
  StorybookSharedUIConfigDecorator,
  categoryMock,
} from '@bluelightcard/shared-ui';
import { CATEGORY_PAGE_SIZE, V5_API_URL } from '@/globals';
import { JotaiTestProvider } from '@/utils/jotaiTestProvider';
import { experimentsAndFeatureFlags, FeatureFlags } from '@/components/AmplitudeProvider';

const withJotaiStore: Decorator = (Story) => {
  return (
    <JotaiTestProvider
      initialValues={[
        [
          experimentsAndFeatureFlags,
          {
            [FeatureFlags.V5_API_INTEGRATION]: 'on',
          },
        ],
      ]}
    >
      <Story />
    </JotaiTestProvider>
  );
};

const componentMeta: Meta<typeof CategoryPage> = {
  title: 'Pages/Category',
  component: CategoryPage,
  parameters: {
    status: 'wip',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/ts9XtrAAIbvPNJnZ56INRi/Globalisation?node-id=4396-24356&t=Xx7hBhRABrhxphAT-4',
    },
    router: {
      pathname: '/category',
      query: {
        id: 'category1',
      },
    },
    platformAdapter: {
      invokeV5Api: async (path: string) => {
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
  decorators: [StorybookSharedUIConfigDecorator, StorybookPlatformAdapterDecorator, withJotaiStore],
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
      if (path.includes(V5_API_URL.Categories)) {
        const categoryData = { ...categoryMock, data: [...categoryMock.data] };
        const [offer] = categoryData.data;
        for (const mockOfferNumber of Array.from(
          { length: CATEGORY_PAGE_SIZE * 2 - 1 },
          (_, index) => index + 2,
        )) {
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
