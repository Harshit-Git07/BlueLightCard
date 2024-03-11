import { Meta, StoryFn } from '@storybook/react';
import ResponsiveOfferCard from './ResponsiveOfferCard';

const componentMeta: Meta<typeof ResponsiveOfferCard> = {
  title: 'Component System/ResponsiveOfferCard',
  component: ResponsiveOfferCard,
  argTypes: {},
};

const ResponsiveOfferCardTemplate: StoryFn<typeof ResponsiveOfferCard> = (args) => (
  <ResponsiveOfferCard {...args} />
);

export const VerticalDefault = ResponsiveOfferCardTemplate.bind({});

VerticalDefault.args = {
  id: '123',
  companyId: '4016',
  companyName: 'Samsung',
  type: 'Online',
  name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
  image: '/assets/forest.jpeg',
};

export const Horizontal = ResponsiveOfferCardTemplate.bind({});

Horizontal.args = {
  id: '123',
  companyId: '4016',
  companyName: 'Samsung',
  type: 'In-store',
  name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
  image: '/assets/forest.jpeg',
  variant: 'horizontal',
};

export default componentMeta;
