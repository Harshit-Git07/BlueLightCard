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
  pills: [
    { text: 'Pill 1', value: 'first-pill' },
    { text: 'Pill 2', value: 'second-pill' },
    { text: 'Pill 3', value: 'third-pill' },
  ],
};

export default ComponentMeta;
