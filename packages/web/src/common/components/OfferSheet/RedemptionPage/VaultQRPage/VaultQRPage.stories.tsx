import { Meta } from '@storybook/react';
import { VaultQRPage } from './VaultQRPage';
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
    redemptionType: 'vaultQR',
    redemptionDetails: {
      code: '123456',
    },
  },
  state: 'success',
};

const meta: Meta = {
  title: 'Component System/Offer Sheet/Redemption Page/Vault QR',
  component: VaultQRPage,
  args: props,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Success = () => {
  return <VaultQRPage {...props} state="success" />;
};

export const Loading = () => {
  return <VaultQRPage {...props} state="loading" />;
};

export const Error = () => {
  return <VaultQRPage {...props} state="error" />;
};

export default meta;
