import { Meta, StoryFn } from '@storybook/react';
import OfferCardCarousel from '.';

const componentMeta: Meta<typeof OfferCardCarousel> = {
  title: 'Component System/OfferCardCarousel',
  component: OfferCardCarousel,
  argTypes: {
    onOfferClick: { action: 'Offer clicked' },
  },
};

const DefaultTemplate: StoryFn<typeof OfferCardCarousel> = (args) => (
  <OfferCardCarousel {...args} />
);

export const Loading = DefaultTemplate.bind({});
Loading.args = {
  offers: [],
};

export const DealsOfTheWeek = DefaultTemplate.bind({});
DealsOfTheWeek.args = {
  offers: [
    {
      offerID: 123,
      companyID: '4016',
      companyName: 'Samsung',
      offerType: 'online',
      offerName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 345,
      companyID: '4017',
      companyName: 'Apple',
      offerType: 'in-store',
      offerName: 'Get 10% off in Airpods Max Pro',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 345,
      companyID: '4017',
      companyName: 'Apple',
      offerType: 'in-store',
      offerName: 'Get 10% off in Airpods Max Pro',
      imageURL: '/assets/forest.jpeg',
    },
  ],
  dealsOfTheWeek: true,
};

export const CommonWeb = DefaultTemplate.bind({});
CommonWeb.args = {
  offers: [
    {
      offerID: 123,
      companyID: '4016',
      companyName: 'Samsung',
      offerType: 'online',
      offerName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 345,
      companyID: '4017',
      companyName: 'Apple',
      offerType: 'in-store',
      offerName: 'Get 10% off in Airpods Max Pro',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 789,
      companyID: '4018',
      companyName: 'Seat',
      offerType: 'gift-card',
      offerName: 'Get 10% off in Seat oil change',
      imageURL: '/assets/forest.jpeg',
    },
    {
      offerID: 789,
      companyID: '4018',
      companyName: 'Seat',
      offerType: 'gift-card',
      offerName: 'Get 10% off in Seat oil change',
      imageURL: '/assets/forest.jpeg',
    },
  ],
};

export default componentMeta;
