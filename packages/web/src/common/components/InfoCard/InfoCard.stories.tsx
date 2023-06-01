import { StoryFn, Meta } from '@storybook/react';
import InfoCard from './InfoCard';

const componentMeta: Meta<typeof InfoCard> = {
  title: 'Component System/Info Card',
  component: InfoCard,
  argTypes: {
    assetPrefix: {
      table: {
        disable: true,
      },
    },
  },
};

const Template: StoryFn<typeof InfoCard> = (args) => <InfoCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  title: 'Card Title',
  text: 'This is the text of the card',
  imageSrc: 'assets/card_test_img.jpg',
};

export default componentMeta;
