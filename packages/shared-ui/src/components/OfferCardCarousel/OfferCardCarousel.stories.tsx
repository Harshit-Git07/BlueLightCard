import { Meta, StoryFn } from '@storybook/react';
import OfferCardCarousel from '.';

const componentMeta: Meta<typeof OfferCardCarousel> = {
  title: 'Component System/OfferCardCarousel',
  component: OfferCardCarousel,
  argTypes: {},
};

const BadgeTemplate: StoryFn<typeof OfferCardCarousel> = (args) => <OfferCardCarousel {...args} />;

export const DealsOfTheWeek = BadgeTemplate.bind({});

DealsOfTheWeek.args = {
  offers: [
    {
      id: '123',
      companyId: '4016',
      companyName: 'Samsung',
      type: 'online',
      name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      image: '/assets/forest.jpeg',
    },
    {
      id: '345',
      companyId: '4017',
      companyName: 'Apple',
      type: 'in-store',
      name: 'Get 10% off in Airpods Max Pro',
      image: '/assets/forest.jpeg',
    },
    {
      id: '345',
      companyId: '4017',
      companyName: 'Apple',
      type: 'in-store',
      name: 'Get 10% off in Airpods Max Pro',
      image: '/assets/forest.jpeg',
    },
  ],
  dealsOfTheWeek: true,
};

export const CommonWeb = BadgeTemplate.bind({});

CommonWeb.args = {
  offers: [
    {
      id: '123',
      companyId: '4016',
      companyName: 'Samsung',
      type: 'online',
      name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
      image: '/assets/forest.jpeg',
    },
    {
      id: '345',
      companyId: '4017',
      companyName: 'Apple',
      type: 'in-store',
      name: 'Get 10% off in Airpods Max Pro',
      image: '/assets/forest.jpeg',
    },
    {
      id: '789',
      companyId: '4018',
      companyName: 'Seat',
      type: 'gift-card',
      name: 'Get 10% off in Seat oil change',
      image: '/assets/forest.jpeg',
    },
    {
      id: '789',
      companyId: '4018',
      companyName: 'Seat',
      type: 'gift-card',
      name: 'Get 10% off in Seat oil change',
      image: '/assets/forest.jpeg',
    },
  ],
};

export default componentMeta;
