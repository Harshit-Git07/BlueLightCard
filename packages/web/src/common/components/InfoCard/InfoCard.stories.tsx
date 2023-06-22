import { StoryFn, Meta } from '@storybook/react';
import { ArgTypes, Markdown, Primary, Stories, Title } from '@storybook/addon-docs';
import InfoCard from './InfoCard';
import { InfoCardLayout } from './types';
import Docs from './Docs.md?raw';

const Template: StoryFn<typeof InfoCard> = (args) => (
  <div className="max-w-[300px]">
    <InfoCard {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  onClick: undefined,
};

export const Selected = Template.bind({});

Selected.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  selected: true,
  onClick: () => {},
};

const ImageTemplate: StoryFn<typeof InfoCard> = (args) => (
  <div className="max-w-[300px]">
    <InfoCard {...args} />
  </div>
);

export const Image = ImageTemplate.bind({});

Image.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  imageSrc: '/assets/card_test_img.jpg',
  onClick: undefined,
};

const ImageFixedSizeTemplate: StoryFn<typeof InfoCard> = (args) => (
  <div className="max-w-[400px]">
    <InfoCard {...args} />
  </div>
);

export const ImageFixedSize = ImageFixedSizeTemplate.bind({});

ImageFixedSize.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  imageSrc: '/assets/card_test_img.jpg',
  imageWidth: 400,
  imageHeight: 400,
  onClick: undefined,
};

const ImageLeftTemplate: StoryFn<typeof InfoCard> = (args) => (
  <InfoCard {...args} className="min-h-[100px]" />
);

export const ImageLeft = ImageLeftTemplate.bind({});

ImageLeft.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  textAlign: 'text-left',
  imageSrc: '/assets/card_test_img.jpg',
  layout: InfoCardLayout.ImageLeft,
  onClick: undefined,
};

const componentMeta: Meta<typeof InfoCard> = {
  title: 'Component System/Info Card',
  component: InfoCard,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Markdown>{Docs}</Markdown>
          <Primary />
          <ArgTypes />
          <Stories />
        </>
      ),
    },
  },
};

export default componentMeta;
