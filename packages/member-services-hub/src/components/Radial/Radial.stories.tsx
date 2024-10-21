import { Meta, StoryFn } from '@storybook/react';
import Radial from './Radial';

const componentMeta: Meta<typeof Radial> = {
  title: 'member-services-hub/Radial',
  component: Radial,
};

const Template: StoryFn<typeof Radial> = (args) => <Radial {...args} />;

export const Default = Template.bind({});

Default.args = {
  options: ['hello', 'its me'],
};

export const RadialLots = Template.bind({});

RadialLots.args = {
  options: ['choice1', 'choice2', 'choice3', 'choice4', 'choice5', 'choice6', 'choice7'],
};

export default componentMeta;
