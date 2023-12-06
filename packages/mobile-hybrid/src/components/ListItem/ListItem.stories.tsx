import { Meta, StoryFn } from '@storybook/react';
import ListItem from './ListItem';

const componentMeta: Meta<typeof ListItem> = {
  title: 'ListItem',
  component: ListItem,
};

const DefaultTemplate: StoryFn<typeof ListItem> = (args) => <ListItem {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  title: 'List Item',
  text: 'List item text',
  imageSrc: 'news1.jpg',
  imageAlt: 'News',
};

export default componentMeta;
