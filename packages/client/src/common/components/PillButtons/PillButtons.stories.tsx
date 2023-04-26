import { Meta, StoryFn } from '@storybook/react';
import PillButtons from './PillButtons';

const ComponentMeta: Meta<typeof PillButtons> = {
  title: 'Component System/Pill Component',
  component: PillButtons,
  argTypes: {},
};

const Template: StoryFn<typeof PillButtons> = (args) => <PillButtons {...args} />;

export const PillStory = Template.bind({});

PillStory.args = {
  pills: ['Pill 1', 'Pill 2', 'Pill 3'],
  disabled: false,
};

export default ComponentMeta;
