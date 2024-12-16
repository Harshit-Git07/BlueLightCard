import { Meta, StoryFn } from '@storybook/react';
import DealsTimer from '.';

const componentMeta: Meta<typeof DealsTimer> = {
  title: 'Experiments/DealsTimer',
  component: DealsTimer,
};

const DefaultTemplate: StoryFn<typeof DealsTimer> = (args) => <DealsTimer {...args} />;

export const ExpiredDeal = DefaultTemplate.bind({});
ExpiredDeal.args = {
  expiry: '2023-09-30T00:00:00.000Z',
};

export const ActiveDeal = DefaultTemplate.bind({});
ActiveDeal.args = {
  expiry: '2024-10-29T00:00:00.000Z',
};

export const ExpiringSoonDeal = DefaultTemplate.bind({});
ExpiringSoonDeal.args = {
  expiry: '2024-10-25T23:59:00.000Z',
};

export default componentMeta;
