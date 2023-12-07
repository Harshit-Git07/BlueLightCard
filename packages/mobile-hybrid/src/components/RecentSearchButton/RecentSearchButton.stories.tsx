import { Meta, StoryFn } from '@storybook/react';
import RecentSearchButton from './RecentSearchButton';

const componentMeta: Meta<typeof RecentSearchButton> = {
  title: 'RecentSearchButton',
  component: RecentSearchButton,
};

const DefaultTemplate: StoryFn<typeof RecentSearchButton> = (args) => (
  <RecentSearchButton {...args} />
);

export const Default = DefaultTemplate.bind({});

Default.args = {
  text: 'Hello World',
};

export default componentMeta;
