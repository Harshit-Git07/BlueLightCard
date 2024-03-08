import { Meta, StoryFn } from '@storybook/react';
import DesktopShowCardOrQrCode from './DesktopShowCardOrQrCode';

const componentMeta: Meta<typeof DesktopShowCardOrQrCode> = {
  title: 'Component System/Desktop Show Card or QR Code',
  component: DesktopShowCardOrQrCode,
};

const ShowCardTemplate: StoryFn<typeof DesktopShowCardOrQrCode> = (args) => (
  <DesktopShowCardOrQrCode {...args} />
);

export const ShowCard = ShowCardTemplate.bind({});

ShowCard.args = {
  redemptionType: 'showCard',
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
};

const VaultQrTemplate: StoryFn<typeof DesktopShowCardOrQrCode> = (args) => (
  <DesktopShowCardOrQrCode {...args} />
);

export const vaultQr = VaultQrTemplate.bind({});

vaultQr.args = {
  redemptionType: 'vaultQR',
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
};

export default componentMeta;
