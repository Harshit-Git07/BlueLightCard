import { Meta, StoryFn } from '@storybook/react';
import VerticalMenuItem from './index';
import { faArrowUpRightFromSquare, faCoffee, faHome } from '@fortawesome/pro-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';

const icons = { faArrowUpRightFromSquare, faCoffee, faHome };
library.add(...Object.values(icons));

const iconArgSelect = {
  options: ['none'].concat(...Object.keys(icons)),
  mapping: { none: undefined, ...icons },
  control: {
    type: 'select',
    labels: {
      none: 'No Icon',
      faArrowUpRightFromSquare: 'Link',
      faCoffee: 'Coffee',
      faHome: 'Home',
    },
  },
};

const componentMeta: Meta<typeof VerticalMenuItem> = {
  title: 'Component System/VerticalMenuItem',
  component: VerticalMenuItem,
  argTypes: {
    icon: { description: 'Icon name from FontAwesomeSolidIcons (Optional)', ...iconArgSelect },
  },
};

const DefaultTemplate: StoryFn<typeof VerticalMenuItem> = (args) => (
  <ul>
    <VerticalMenuItem {...args} />
  </ul>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  label: 'Default Menu Item',
  onClick: () => "I've been Clicked!",
};

export const Hover = DefaultTemplate.bind({});

Hover.args = {
  label: 'Default Menu Item',
  href: '/',
};

export const Selected = DefaultTemplate.bind({});

Selected.args = {
  label: 'Selected Menu Item',
  onClick: () => "I've been Clicked!",
  selected: true,
};

export const Icon = DefaultTemplate.bind({});

Icon.args = {
  label: 'Selected Menu Item',
  onClick: () => "I've been Clicked!",
  icon: faArrowUpRightFromSquare,
};
export default componentMeta;
