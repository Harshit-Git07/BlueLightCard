import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';
import PillButtons from './PillButtons';

const componentMeta: ComponentMeta<typeof PillButtons> = {
  title: 'Component System/Pill Component',
  component: PillButtons,
  decorators: [withDesign],
  argTypes: {},
};

const Template: ComponentStory<typeof PillButtons> = (args) => <PillButtons {...args} />;

export const PillStory = Template.bind({});

PillStory.args = {
  pills: ['Pill 1', 'Pill 2', 'Pill 3'],
};

export default componentMeta;
