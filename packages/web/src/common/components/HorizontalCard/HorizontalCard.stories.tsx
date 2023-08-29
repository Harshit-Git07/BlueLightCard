import { Meta, StoryFn } from '@storybook/react';
import HorizontalCard from './HorizontalCard';

const componentMeta: Meta<typeof HorizontalCard> = {
  title: 'Component System/HortizontalCard',
  component: HorizontalCard,
};

const DefaultList: StoryFn = (args) => (
  <HorizontalCard
    img={'https://placehold.co/600x400'}
    title={'Shop name'}
    description={'Lorem ipsum dolor sit amet. '}
    link={'www.google.com'}
  />
);

export const Default = DefaultList.bind({});

export default componentMeta;
