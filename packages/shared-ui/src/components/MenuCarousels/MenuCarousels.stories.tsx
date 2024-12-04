import { Meta, StoryFn } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StorybookPlatformAdapterDecorator } from '../../adapters';
import { allMenusMock } from '../../mocks';
import MenuCarousels from './';

const queryClient = new QueryClient();

const withQueryClientProvider = (Story: StoryFn) => (
  <QueryClientProvider client={queryClient}>
    <Story />
  </QueryClientProvider>
);

const componentMeta: Meta<typeof MenuCarousels> = {
  title: 'Molecules/Menu Carousels',
  component: MenuCarousels,
  argTypes: {
    menus: {
      description: 'Array of menu types to load',
      control: 'array',
    },
    onOfferClick: {
      description: 'Callback function for when an offer in a carousel is clicked',
      action: 'Offer clicked',
    },
  },
  parameters: {
    status: 'done',
    platformAdapter: {
      invokeV5Api: () =>
        Promise.resolve({
          status: 200,
          data: JSON.stringify({
            data: allMenusMock,
          }),
        }),
    },
  },
  decorators: [withQueryClientProvider, StorybookPlatformAdapterDecorator],
};

const DealsOfTheWeekTemplate: StoryFn<typeof MenuCarousels> = (args) => {
  return <MenuCarousels.DealsOfTheWeek {...args} />;
};
export const DealsOfTheWeek = DealsOfTheWeekTemplate.bind({});

const MarketplaceTemplate: StoryFn<typeof MenuCarousels> = (args) => {
  return <MenuCarousels.Marketplace {...args} />;
};
export const Marketplace = MarketplaceTemplate.bind({});

const FeaturedOffersTemplate: StoryFn<typeof MenuCarousels> = (args) => {
  return <MenuCarousels.FeaturedOffers {...args} />;
};
export const FeaturedOffers = FeaturedOffersTemplate.bind({});

export default componentMeta;
