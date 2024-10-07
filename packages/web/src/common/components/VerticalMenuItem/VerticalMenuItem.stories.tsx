import { Meta, StoryFn } from '@storybook/react';
import VerticalMenuItem from './';

const componentMeta: Meta<typeof VerticalMenuItem> = {
  title: 'Component System/VerticalMenuItem',
  component: VerticalMenuItem,
};

const DefaultTemplate: StoryFn<typeof VerticalMenuItem> = (args) => (
  <ul>
    <VerticalMenuItem {...args} />
  </ul>
);

export const OnClick = DefaultTemplate.bind({});

OnClick.args = {
  label: 'Default Menu Item',
  onClick: () => "I've been Clicked!",
};

export const HRef = DefaultTemplate.bind({});

HRef.args = {
  label: 'Default Menu Item',
  href: '/',
};

export const Selected = DefaultTemplate.bind({});

Selected.args = {
  label: 'Selected Menu Item',
  onClick: () => "I've been Clicked!",
  selected: true,
};

export default componentMeta;
