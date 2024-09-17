import { Meta, StoryFn } from '@storybook/react';

const componentMeta: Meta = {
  title: 'Organisms/Offer Card List',
  args: {
    status: 'success',
    variant: 'vertical',
    columns: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    offers: [
      {
        id: 123,
        companyId: 4016,
        companyName: 'Samsung',
        type: 'Online',
        name: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        image: '/assets/forest.jpeg',
      },
    ],
  },
  argTypes: {
    status: {
      description: 'Status of the list, can be: loading, error, or success',
      control: 'radio',
      options: ['loading', 'error', 'success'],
      defaultValue: 'success',
    },
    variant: {
      description:
        'Controls which variant of offer card to render, either vertical or horizontal, defaults to vertical',
      control: 'radio',
      options: ['vertical', 'horizontal'],
      defaultValue: 'vertical',
    },
    columns: {
      description: 'Specifies how many columns to show for each screen size',
      control: 'object',
      defaultValue: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
    },
    offers: {
      description: 'Array of offers to render',
      control: 'object',
      defaultValue: [],
    },
    onOfferClick: {
      description: 'Callback function for when an offer has been clicked',
      action: 'Offer clicked',
    },
  },
  parameters: {
    status: 'unimplemented',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/OHV7qGPnjsPLs5aTcYwSoB/Blue-Print-(WIP)?node-id=3804-8507&t=tBej1y20VbhdJpKu-4',
    },
  },
};

const DefaultTemplate: StoryFn = (args) => <div {...args} />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
