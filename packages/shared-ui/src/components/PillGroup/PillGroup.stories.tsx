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
    { id: 1, label: 'Beauty and Fragrance' },
    { id: 2, label: 'Food and drink' },
    { id: 3, label: 'Electrical' },
    { id: 4, label: 'Phone' },
    { id: 5, label: 'Fashion' },
    { id: 6, label: 'Children and toys' },
    { id: 7, label: 'Financial and insurance' },
    { id: 8, label: 'Gifts and flowers' },
    { id: 9, label: 'Holiday and travel' },
    { id: 10, label: 'Home' },
    { id: 11, label: 'Jewellery and watches' },
    { id: 12, label: 'Leisure and entertainment' },
    { id: 13, label: 'Motor' },
    { id: 14, label: 'Pets' },
    { id: 15, label: 'Sports and fitness' },
  ],
};

export default componentMeta;
