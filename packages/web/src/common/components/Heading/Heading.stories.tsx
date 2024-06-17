import { Meta, StoryFn } from '@storybook/react';
import Heading from './Heading';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';

const componentMeta: Meta<typeof Heading> = {
  title: 'Component System/Common/Heading',
  component: Heading,
  argTypes: {},
  decorators: [tokenMigrationDecorator],
};

const HeadingTemplate: StoryFn<typeof Heading> = (args) => {
  return <Heading {...args}>Storyboard Heading</Heading>;
};

export const H1 = HeadingTemplate.bind({});

H1.args = {
  headingLevel: 'h1',
};

export const H2 = HeadingTemplate.bind({});

H2.args = {
  headingLevel: 'h2',
};

export const H3 = HeadingTemplate.bind({});

H3.args = {
  headingLevel: 'h3',
};

export const H4 = HeadingTemplate.bind({});

H4.args = {
  headingLevel: 'h4',
};

export const H5 = HeadingTemplate.bind({});

H5.args = {
  headingLevel: 'h5',
};

export const H6 = HeadingTemplate.bind({});

H6.args = {
  headingLevel: 'h6',
};

export default componentMeta;
