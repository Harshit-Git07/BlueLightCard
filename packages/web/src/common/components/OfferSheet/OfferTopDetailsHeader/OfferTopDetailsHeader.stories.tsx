import { Meta, StoryFn } from '@storybook/react';
import OfferTopDetailsHeaderComponent from './OfferTopDetailsHeader';
import { OfferTopDetailsHeaderProps } from '../types';

const props: OfferTopDetailsHeaderProps = {
  offerData: {
    companyId: 0,
    companyLogo: '',
    description:
      'SEAT have put together a discount on the price of a new car. Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    expiry: '2030-06-30T23:59:59.000Z',
    id: 0,
    name: 'Save with SEAT',
    terms: 'Must be a Blue Light Card member in order to receive the discount.',
    type: 'Online',
  },
  offerMeta: {
    offerId: '0',
    companyId: '0',
    companyName: 'SEAT',
  },
};

const meta: Meta<typeof OfferTopDetailsHeaderComponent> = {
  title: 'Component System/Offer Sheet/Offer Top Details Header',
  component: OfferTopDetailsHeaderComponent,
  args: props,
  parameters: {
    layout: 'centered',
  },
};

const renderTemplate = (args: Partial<OfferTopDetailsHeaderProps>) => (
  // This represents the width of the parent container
  <div style={{ width: '24rem' }}>
    <OfferTopDetailsHeaderComponent {...props} {...args} />
  </div>
);

export const ShowOrHideSections = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: true,
    showTerms: true,
  });

export const DescriptionSeeMore = () =>
  renderTemplate({
    showOfferDescription: true,
    showShareFavorite: false,
    showTerms: false,
  });

export default meta;
