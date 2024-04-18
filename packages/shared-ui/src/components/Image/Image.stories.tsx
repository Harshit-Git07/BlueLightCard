import { Meta, StoryFn } from '@storybook/react';
import Image from './';
import { disableProps } from '../../utils/storyUtils';
import { ArgTypes, Primary, Stories, Title } from '@storybook/addon-docs';

const disableArgTypes = disableProps([
  'loading',
  'fill',
  'quality',
  'priority',
  'unoptimized',
  'layout',
  'objectFit',
  'objectPosition',
  'lazyBoundary',
  'lazyRoot',
]);

const componentMeta: Meta<typeof Image> = {
  title: 'Component System/Image',
  component: Image,
  argTypes: {
    ...disableArgTypes,
  },
};

const ImageTemplate: StoryFn<typeof Image> = (args) => (
  <div className="max-w-[400px] h-[400px] relative">
    <Image {...args} />
  </div>
);

export const Default = ImageTemplate.bind({});

Default.args = {
  alt: 'Image',
  src: '/assets/card_test_img.jpg',
  responsive: true,
};

const FixedSizeImageTemplate: StoryFn<typeof Image> = (args) => <Image {...args} />;

export const FixedSizes = FixedSizeImageTemplate.bind({});

FixedSizes.args = {
  alt: 'Image',
  src: '/assets/card_test_img.jpg',
  responsive: false,
  width: 500,
  height: 300,
};

export default componentMeta;
