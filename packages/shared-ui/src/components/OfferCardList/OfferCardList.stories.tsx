import { Meta, StoryFn } from '@storybook/react';
import OfferCardList from '.';

const componentMeta: Meta<typeof OfferCardList> = {
  title: 'Organisms/Offer Card List',
  component: OfferCardList,
  args: {
    status: 'success',
    variant: 'vertical',
    columns: 1 | 2 | 3,
    offers: [
      {
        id: 123,
        CompID: 4016,
        CompanyName: 'Samsung',
        OfferType: 1,
        OfferName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        imageSrc: '/assets/forest.jpeg',
      },
      {
        id: 123,
        CompID: 2016,
        CompanyName: 'JD Sports',
        OfferType: 1,
        OfferName: 'Get 10% off and free pair of Nike air',
        imageSrc: '/assets/forest.jpeg',
      },
      {
        id: 123,
        CompID: 1012,
        CompanyName: 'Apple',
        OfferType: 1,
        OfferName: 'Get 10% off iPhone PRO 16 120gb',
        imageSrc: '/assets/forest.jpeg',
      },
      {
        id: 123,
        CompID: 4016,
        CompanyName: 'Samsung',
        OfferType: 1,
        OfferName: 'Get 10% off and free Galaxy Buds2 with any Galaxy Tab S9 Series tablet',
        imageSrc: '/assets/forest.jpeg',
      },
      {
        id: 123,
        CompID: 2016,
        CompanyName: 'JD Sports',
        OfferType: 1,
        OfferName: 'Get 10% off and free pair of Nike air',
        imageSrc: '/assets/forest.jpeg',
      },
      {
        id: 123,
        CompID: 1012,
        CompanyName: 'Apple',
        OfferType: 2,
        OfferName: 'Get 10% off iPhone PRO 16 120gb',
        imageSrc: '/assets/forest.jpeg',
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
      defaultValue: 3,
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
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/OHV7qGPnjsPLs5aTcYwSoB/Blue-Print-(WIP)?node-id=3804-8507&t=tBej1y20VbhdJpKu-4',
    },
  },
};

const DefaultTemplate: StoryFn = (args) => (
  <OfferCardList
    status={args.status}
    onOfferClick={args.onOfferClick}
    offers={args.offers}
    {...args}
  />
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  columns: 3,
};

export const Tablet = DefaultTemplate.bind({});

Tablet.args = {
  columns: 2,
};

export const MobileVertical = DefaultTemplate.bind({});

MobileVertical.args = {
  columns: 1,
};

export const MobileHorizontal = DefaultTemplate.bind({});

MobileHorizontal.args = {
  columns: 1,
  variant: 'horizontal',
};

export default componentMeta;
