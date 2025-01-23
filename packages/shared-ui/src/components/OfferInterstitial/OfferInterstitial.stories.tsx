import { Meta, StoryFn } from '@storybook/react';
import OfferInterstitial from './OfferInterstitial';

const componentMeta: Meta<typeof OfferInterstitial> = {
  title: 'Experiments/OfferInterstitial',
  component: OfferInterstitial,
};

const DefaultTemplate: StoryFn<typeof OfferInterstitial> = (args) => (
  <OfferInterstitial {...args} />
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  isOpen: true,
  imageSource: '/card_test_img.jpg',
  companyName: 'Company',
  offerName: 'Sample Offer',
};

export default componentMeta;
