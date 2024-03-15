import { Meta, StoryFn } from '@storybook/react';
import OfferExclusions from './OfferExclusions';

const componentMeta: Meta<typeof OfferExclusions> = {
  title: 'Component System/Offer Exclusions',
  component: OfferExclusions,
};

const DefaultTemplate: StoryFn<typeof OfferExclusions> = (args) => <OfferExclusions {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  exclusionsArr: ['Galaxy S24', 'Galaxy S24+', 'Galaxy Z Flip 5', 'Galaxy S24 Ultra'],
  navigateBack: () => void 0,
};

export default componentMeta;
