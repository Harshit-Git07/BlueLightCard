import { Meta, StoryFn } from '@storybook/react';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';
import Button from './Button';

const componentMeta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  decorators: [tokenMigrationDecorator],
};

const DefaultTemplate: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  text: 'Button',
};

export default componentMeta;
