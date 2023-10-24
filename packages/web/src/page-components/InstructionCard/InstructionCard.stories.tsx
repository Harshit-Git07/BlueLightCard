import { Meta, StoryFn } from '@storybook/react';
import InstructionCard from './InstructionCard';

const componentMeta: Meta<typeof InstructionCard> = {
  title: 'Component System/Verify/InstructionCard',
  component: InstructionCard,
  argTypes: { title: { control: 'text' } },
};

const DefaultTemplate: StoryFn<typeof InstructionCard> = (args) => (
  <InstructionCard {...args}></InstructionCard>
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  title: '1',
  children: (
    <p>
      Integrate your app, website or till point with <b>Verify</b> using the ready-to-use API
      supplied by Blue Light Card.
    </p>
  ),
  imageAlt: 'Acquire new members image',
  imageSrc: '/assets/verify/verify-tick.svg',
};

export default componentMeta;
