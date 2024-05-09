import { Meta, StoryFn } from '@storybook/react';
import CampaignCard from '.';

const componentMeta: Meta<typeof CampaignCard> = {
  title: 'Component System/Campaign Card',
  component: CampaignCard,
  argTypes: {},
};

const CampaignCardTemplate: StoryFn<typeof CampaignCard> = (args) => <CampaignCard {...args} />;

export const Default = CampaignCardTemplate.bind({});

Default.args = {
  linkUrl: '',
  name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
  image: '/assets/forest.jpeg',
};

export default componentMeta;
