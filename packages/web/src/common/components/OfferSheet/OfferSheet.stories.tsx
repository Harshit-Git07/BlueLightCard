import { Meta, StoryFn } from '@storybook/react';
import OfferSheet from './OfferSheet';

const componentMeta: Meta<typeof OfferSheet> = {
  title: 'Component System/Offer Sheet',
  component: OfferSheet,
  argTypes: {
    open: {
      description: 'Whether the Offer Sheet is open or not',
      control: {
        type: 'boolean',
      },
    },
    labels: {
      description: 'Labels to display on the Offer Sheet',
      control: {
        type: 'array',
      },
    },
  },
};

const DefaultTemplate: StoryFn<typeof OfferSheet> = (args) => <OfferSheet {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  open: true,
  setOpen: () => {},
  offer: {
    offerId: '6107',
    companyId: '4996',
    offerName: 'JD Sports',
    termsAndConditions: 'Terms and conditions go here. Lorem ipsum dolor sit amet consectetur.',
    offerDescription:
      'Sub description goes here. Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet unde minus similique repudiandae nulla, eos quo eum voluptate pariatur nobis sint quia quis et omnis, ab doloribus quibusdam, non totam?',
  },
  labels: ['Online', 'Expires: Oct 12 1998'],
  onButtonClick: () => console.log('Button clicked'),
};

export default componentMeta;
