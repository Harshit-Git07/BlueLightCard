import { Meta, StoryFn } from '@storybook/react';
import { FC, useState } from 'react';
import VerticalMenuItem, { Props as VerticalMenuItemProps } from './';
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

const componentMeta: Meta = {
  title: 'Component System/ExampleVerticalMenu',
  component: ExampleVerticalMenu,
  argTypes: {
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

export const OnClickVariant = DefaultTemplate.bind({});
OnClickVariant.args = {
  numberOfItems: 2,
  label: 'MenuItem',
  onClick: () => 'Item Clicked!',
  href: undefined,
};

export const HrefVariant = DefaultTemplate.bind({});
HrefVariant.args = {
  numberOfItems: 2,
  label: 'MenuItem',
  onClick: undefined,
  href: '/',
};

export default componentMeta;
