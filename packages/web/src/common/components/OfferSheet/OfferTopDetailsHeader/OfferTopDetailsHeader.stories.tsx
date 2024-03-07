import { Meta, StoryFn } from '@storybook/react';
import OfferTopDetailsHeaderComponent from './OfferTopDetailsHeader';

const componentMeta: Meta<typeof OfferTopDetailsHeaderComponent> = {
  title: 'Component System/Offer Sheet/Offer Top Details Header',
  component: OfferTopDetailsHeaderComponent,
  parameters: {
    layout: 'centered',
  },
};

const ShowOrHideSectionsTemplate: StoryFn<typeof OfferTopDetailsHeaderComponent> = (args) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <OfferTopDetailsHeaderComponent {...args} />
  </div>
);

export const ShowOrHideSections = ShowOrHideSectionsTemplate.bind({});

ShowOrHideSections.args = {
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
  companyId: '4016',
  showOfferDescription: true,
  showShareFavorite: true,
  showTerms: true,
};

const DescriptionSeeMoreTemplate: StoryFn<typeof OfferTopDetailsHeaderComponent> = (args) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <OfferTopDetailsHeaderComponent {...args} />
  </div>
);

export const DescriptionSeeMore = DescriptionSeeMoreTemplate.bind({});

DescriptionSeeMore.args = {
  offerData: {
    id: '3802',
    name: 'Save with SEAT',
    description:
      'SEAT have put together a discount on the price of a new car. Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent. To redeem this offer simply use the discount code at the checkout stage. This code is only available for Blue Light Card members and must not be shared on any other Voucher site -Please use code BLC25CC if calling the Call Centre',
    expiry: '2030-06-30T23:59:59.000Z',
    type: 'Online',
    terms: 'Must be a Blue Light Card member in order to receive the discount.',
    companyId: '4016',
    companyLogo: 'companyimages/complarge/retina/',
  },
  companyId: '4016',
  showOfferDescription: true,
  showShareFavorite: false,
  showTerms: false,
};

export default componentMeta;
