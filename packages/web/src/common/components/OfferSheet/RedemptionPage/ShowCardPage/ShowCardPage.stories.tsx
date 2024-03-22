import { Meta } from '@storybook/react';
import { ShowCardPage } from './ShowCardPage';
import { Props as RedemptionPageProps } from '../RedemptionPage';

const props: RedemptionPageProps = {
  __storybook: true,
  labels: ['Exclusive', 'Online', 'Expires 30th June 2030'],
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
  redeemData: {
    redemptionType: 'showCard',
    redemptionDetails: {},
  },
  state: 'success',
};

const meta: Meta = {
  title: 'Component System/Offer Sheet/Redemption Page/Show Card',
  component: ShowCardPage,
  args: props,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Success = () => {
  return <ShowCardPage {...props} state="success" />;
};

export const Loading = () => {
  return <ShowCardPage {...props} state="loading" />;
};

export const Error = () => {
  return <ShowCardPage {...props} state="error" />;
};

export default meta;
