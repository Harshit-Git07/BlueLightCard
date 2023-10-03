import { Meta, StoryFn } from '@storybook/react';

import EligibilityCard from './EligibilityCard';

const componentMeta: Meta<typeof EligibilityCard> = {
  title: 'EligibilityCard',
  component: EligibilityCard,
};

const FooterTemplate: StoryFn<typeof EligibilityCard> = (args) => <EligibilityCard {...args} />;
export const Default = FooterTemplate.bind({});

Default.args = {};

export default componentMeta;
