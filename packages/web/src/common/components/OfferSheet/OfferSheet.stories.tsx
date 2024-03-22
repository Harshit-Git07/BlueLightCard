import { Meta } from '@storybook/react';
import {
  OfferDetailsPage,
  Props as OfferDetailsPageProps,
} from './OfferDetailsPage/OfferDetailsPage';

const props: OfferDetailsPageProps = {
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
  redemptionType: 'vault',
};

const meta: Meta = {
  title: 'Component System/Offer Sheet',
  component: OfferDetailsPage,
  args: props,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => {
  return <OfferDetailsPage {...props} />;
};

export default meta;
