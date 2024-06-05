import { Meta, StoryFn } from '@storybook/react';
import Search from './Search';
import tokenMigrationDecorator from '@storybook/tokenMigrationDecorator';

const componentMeta: Meta<typeof Search> = {
  title: 'Search',
  component: Search,
  decorators: [tokenMigrationDecorator],
};

const DefaultTemplate: StoryFn<typeof Search> = (args) => <Search {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  labelText: 'Search',
  placeholderText: 'Search...',
  showBackArrow: false,
};

export default componentMeta;
