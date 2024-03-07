import { Meta, StoryFn } from '@storybook/react';
import OfferGetDiscount from './OfferGetDiscount';

const componentMeta: Meta<typeof OfferGetDiscount> = {
  title: 'Component System/Offer Sheet/Offer Get Discount',
  component: OfferGetDiscount,
};

const DefaultTemplate: StoryFn<typeof OfferGetDiscount> = (args) => <OfferGetDiscount {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  offer: {
    offerId: '3802',
    companyId: '4016',
    companyName: 'SEAT',
  },
  offerData: {
    id: '3802',
    name: 'Save with SEAT',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    expiry: '2030-06-30T23:59:59.000Z',
    type: 'Online',
    terms: 'Must be a Blue Light Card member in order to receive the discount.',
    companyId: '4016',
    companyLogo: 'companyimages/complarge/retina/',
  },
  onButtonClick: () => {},
  companyId: '4016',
};

export default componentMeta;
