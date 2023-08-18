import { Meta, StoryFn } from '@storybook/react';
import OfferCard from './OfferCard';

const componentMeta: Meta<typeof OfferCard> = {
  title: 'Component System/Offers/OfferCard',
  component: OfferCard,
  argTypes: {},
};

const OfferCardTemplate: StoryFn<typeof OfferCard> = (args) => <OfferCard {...args} />;

export const Default = OfferCardTemplate.bind({});

Default.args = {
  imageSrc: '/assets/forest.jpeg',
  alt: 'Forest Holidays',
  offerName: '20% off OLED TVs',
  companyName: 'LG',
  offerLink: 'https://www.bluelightcard.co.uk',
};

export const smallText = OfferCardTemplate.bind({});

smallText.args = {
  imageSrc: '/assets/forest.jpeg',
  alt: 'Forest Holidays',
  offerName: '20% off OLED TVs',
  companyName: 'LG',
  offerLink: 'https://www.bluelightcard.co.uk',
  variant: 'small',
};

export default componentMeta;
