import { Meta, StoryFn } from '@storybook/react';
import Card from './Card';

const componentMeta: Meta<typeof Card> = {
  title: 'Card',
  component: Card,
};

const DefaultTemplate: StoryFn<typeof Card> = (args) => <Card {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'Card Title',
  text: 'Card text appears here',
  imageSrc: 'card_test_img.jpg',
};

export default componentMeta;
