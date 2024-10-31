import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Card from './';
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';

const componentMeta: Meta<typeof Card> = {
  title: 'Component System/Card',
  component: Card,
  parameters: {
    status: 'done',
  },
  argTypes: {
    initialCardState: {
      control: {
        type: 'select',
        options: ['default', 'selected', 'hover'],
      },
    },
    showImage: { control: 'boolean' },
    showDescription: { control: 'boolean' },
    showButton: { control: 'boolean' },
  },
};

const ConstrainedDecorator = (Story: any) => (
  <div style={{ width: '288px' }}>
    <Story />
  </div>
);

const FullWidthDecorator = (Story: any) => (
  <div
    style={{
      width: '100%',
    }}
  >
    <Story />
  </div>
);

const DefaultTemplate: StoryFn<typeof Card> = (args) => <Card {...args} />;

// Constrained width stories
export const Default = DefaultTemplate.bind({});
Default.args = {
  initialCardState: 'default',
  cardTitle: 'Card Title',
  description: 'Card description limited to two lines or less.',
  buttonTitle: 'Start',
  imageSrc: 'https://www.kurin.com/wp-content/uploads/placeholder-square.jpg',
  imageAlt: 'Placeholder Image',
  iconRight: faArrowRight,
  showImage: true,
  showDescription: true,
  showButton: true,
};
Default.decorators = [ConstrainedDecorator];

export const Selected = DefaultTemplate.bind({});
Selected.args = {
  ...Default.args,
  initialCardState: 'selected',
};
Selected.decorators = [ConstrainedDecorator];

export const Hover = DefaultTemplate.bind({});
Hover.args = {
  ...Default.args,
  initialCardState: 'hover',
};
Hover.decorators = [ConstrainedDecorator];

export const HiddenImage = DefaultTemplate.bind({});
HiddenImage.args = {
  ...Default.args,
  showImage: false,
};
HiddenImage.decorators = [ConstrainedDecorator];

export const HiddenDescription = DefaultTemplate.bind({});
HiddenDescription.args = {
  ...Default.args,
  showDescription: false,
};
HiddenDescription.decorators = [ConstrainedDecorator];

export const CenterAligned = DefaultTemplate.bind({});
CenterAligned.args = {
  ...Default.args,
  showImage: false,
  description: 'Center aligned card with no image.',
};
CenterAligned.decorators = [ConstrainedDecorator];

export const TitleOnly = DefaultTemplate.bind({});
TitleOnly.args = {
  ...Default.args,
  showImage: false,
  showDescription: false,
  showButton: false,
};
TitleOnly.decorators = [ConstrainedDecorator];

export const TitleAndDescription = DefaultTemplate.bind({});
TitleAndDescription.args = {
  ...Default.args,
  showImage: false,
  showButton: false,
};
TitleAndDescription.decorators = [ConstrainedDecorator];

// Full width variants
export const FullWidthDefault = DefaultTemplate.bind({});
FullWidthDefault.args = {
  ...Default.args,
  description:
    'A longer description will take up a available space. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum efficitur condimentum est, eu semper nisl lobortis ac.',
};
FullWidthDefault.decorators = [FullWidthDecorator];

export default componentMeta;
