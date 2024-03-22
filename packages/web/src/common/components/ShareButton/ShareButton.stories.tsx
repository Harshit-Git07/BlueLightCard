import { Meta, StoryFn } from '@storybook/react';
import ShareButton from './ShareButton';

const componentMeta: Meta<typeof ShareButton> = {
  title: 'Component System/ShareButton',
  component: ShareButton,
};

const Template: StoryFn<typeof ShareButton> = (args) => <ShareButton {...args} />;

export const ShareWithDefaultLabel = Template.bind({});
ShareWithDefaultLabel.args = {
  shareDetails: {
    name: 'Save with SEAT',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    url: 'https://www.dummy-link.com',
  },
};

export const ShareWithCustomLabel = Template.bind({});
ShareWithCustomLabel.args = {
  shareDetails: {
    name: 'Save with SEAT',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    url: 'https://www.dummy-link.com',
  },
  shareLabel: 'Share offer',
};

export const ShareNoLabel = Template.bind({});
ShareNoLabel.args = {
  shareDetails: {
    name: 'Save with SEAT',
    description:
      'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
    url: 'https://www.dummy-link.com',
  },
  showShareLabel: false,
};

export default componentMeta;
