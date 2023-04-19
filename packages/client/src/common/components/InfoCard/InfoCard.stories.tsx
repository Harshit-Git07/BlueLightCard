import { ComponentMeta, ComponentStory } from '@storybook/react';
import InfoCard from './InfoCard';

const componentMeta: ComponentMeta<typeof InfoCard> = {
  title: 'Component System/Info Card',
  component: InfoCard,
  argTypes: {},
};

const Template: ComponentStory<typeof InfoCard> = (args) => <InfoCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'Card T',
  text: 'This is the text of the card.',
};

export default componentMeta;
