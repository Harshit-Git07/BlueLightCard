import { Meta, StoryFn } from '@storybook/react';
import PillGroup from '.';

const componentMeta: Meta<typeof PillGroup> = {
  title: 'Component System/PillGroup',
  component: PillGroup,
  argTypes: {},
};

const PillGroupTemplate: StoryFn<typeof PillGroup> = (args) => <PillGroup {...args} />;

export const Default = PillGroupTemplate.bind({});

Default.args = {
  title: 'Browse Categories',
  pillGroup: [
    { id: 1, label: 'Beauty and Fragrance', selected: false },
    { id: 2, label: 'Food and drink', selected: false },
    { id: 3, label: 'Electrical', selected: false },
    { id: 4, label: 'Phone', selected: false },
    { id: 5, label: 'Fashion', selected: false },
    { id: 6, label: 'Children and toys', selected: false },
    { id: 7, label: 'Financial and insurance', selected: false },
    { id: 8, label: 'Gifts and flowers', selected: false },
    { id: 9, label: 'Holiday and travel', selected: false },
    { id: 10, label: 'Home', selected: false },
    { id: 11, label: 'Jewellery and watches', selected: false },
    { id: 12, label: 'Leisure and entertainment', selected: false },
    { id: 13, label: 'Motor', selected: false },
    { id: 14, label: 'Pets', selected: false },
    { id: 15, label: 'Sports and fitness', selected: false },
  ],
};

export default componentMeta;
