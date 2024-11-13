import { Meta, StoryFn } from '@storybook/react';
import Footer from './Footer';

const componentMeta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  component: Footer,
};

const DefaultTemplate: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  isAuthenticated: true,
};

export default componentMeta;
