/* eslint-disable jsx-a11y/alt-text */
import { Meta, StoryFn } from '@storybook/react';
import Image from './Image';

const componentMeta: Meta<typeof Image> = {
  title: 'Image',
  component: Image,
};

const DefaultTemplate: StoryFn<typeof Image> = (args) => (
  <div className="relative h-[200px] w-full">
    <Image {...args} />
  </div>
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  src: 'card_test_img.jpg',
  alt: 'Image',
};

export default componentMeta;
