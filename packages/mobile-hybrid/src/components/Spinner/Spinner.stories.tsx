import { Meta, StoryFn } from '@storybook/react';
import Spinner from './Spinner';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';

const componentMeta: Meta<typeof Spinner> = {
  title: 'Spinner',
  component: Spinner,
  decorators: [tokenMigrationDecorator],
};

const DefaultTemplate: StoryFn<typeof Spinner> = (args) => <Spinner {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {};

export default componentMeta;
