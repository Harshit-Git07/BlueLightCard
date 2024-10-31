import { Meta, StoryFn } from '@storybook/react';
import { FC, useState } from 'react';
import VerticalMenuItem, { Props as VerticalMenuItemProps } from './';
import { faArrowUpRightFromSquare, faCoffee, faHome } from '@fortawesome/pro-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import _L from 'lodash';

type ExampleVerticalMenuProps = {
  numberOfItems: number;
} & VerticalMenuItemProps;
const ExampleVerticalMenu: FC<ExampleVerticalMenuProps> = ({
  numberOfItems,
  ...verticalItemProps
}) => {
  const [selectedItems, setSelectedItems] = useState<number | null>(null);

  const itemOnClick = (itemIndex: number) =>
    setSelectedItems((currentItem) => (currentItem === itemIndex ? null : itemIndex));

  return (
    <ul className="w-[263px]">
      {Array(numberOfItems)
        .fill(0)
        .map((_, index) => (
          <VerticalMenuItem
            key={_L.uniqueId()}
            {...verticalItemProps}
            selected={selectedItems === index}
            onClick={() => itemOnClick(index)}
          />
        ))}
    </ul>
  );
};

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

const componentMeta: Meta = {
  title: 'Component System/ExampleVerticalMenu',
  component: ExampleVerticalMenu,
  argTypes: {
    icon: { description: 'Icon name from FontAwesomeSolidIcons (Optional)', ...iconArgSelect },
    href: { description: 'Link to navigate to', type: 'string' },
    numberOfItems: {
      name: 'Number of Items',
      control: {
        type: 'range',
        min: 2,
        step: 1,
      },
    },
  },
};

const DefaultTemplate: StoryFn<ExampleVerticalMenuProps> = (args) => (
  <ExampleVerticalMenu {...args} />
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  numberOfItems: 2,
  label: 'MenuItem',
  onClick: () => 'Item Clicked!',
  href: undefined,
};

export const Hover = DefaultTemplate.bind({});
Hover.args = {
  numberOfItems: 2,
  label: 'MenuItem',
  onClick: undefined,
  href: '/',
};

export const Icon = DefaultTemplate.bind({});
Icon.args = {
  numberOfItems: 2,
  label: 'MenuItem',
  onClick: undefined,
  href: '/',
  icon: faArrowUpRightFromSquare,
};

export default componentMeta;
