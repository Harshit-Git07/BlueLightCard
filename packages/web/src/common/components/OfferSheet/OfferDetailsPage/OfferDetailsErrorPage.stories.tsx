import { Meta } from '@storybook/react';
import { OfferDetailsErrorPage, Props } from './OfferDetailsErrorPage';

const props: Props = {
  offer: {
    offerId: '0',
    companyId: '0',
    companyName: 'SEAT',
  },
};

const meta: Meta = {
  title: 'Component System/Offer Sheet/Error Page',
  component: OfferDetailsErrorPage,
  args: props,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = (args: Props) => {
  return <OfferDetailsErrorPage {...args} />;
};

export default meta;
