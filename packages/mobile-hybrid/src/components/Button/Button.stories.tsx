import { Meta, StoryFn } from '@storybook/react';
import { env } from '@bluelightcard/shared-ui/env';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';
import _Button from './Button';
import _ButtonV2 from './v2';

const Button = env.FLAG_NEW_TOKENS ? _ButtonV2 : _Button;

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
