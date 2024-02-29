import { Meta, StoryFn } from '@storybook/react';
import OfferSheet from './OfferSheet';

const componentMeta: Meta<typeof OfferSheet> = {
  title: 'Component System/Offer Sheet',
  component: OfferSheet,
};

const DefaultTemplate: StoryFn<typeof OfferSheet> = (args) => <OfferSheet {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  offer: {
    offerId: '6107',
    companyId: '4996',
  },
  onButtonClick: () => console.log('Button clicked'),
};

export default componentMeta;
