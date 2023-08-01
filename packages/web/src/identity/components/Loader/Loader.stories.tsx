import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import Loader from './Loader';

const componentMeta: Meta<typeof Loader> = {
  title: 'Component System/identity/Loader',
  component: Loader,
  argTypes: {},
};

const LoaderTemplate: StoryFn<typeof Loader> = (args) => {
  return <Loader {...args} />;
};

export const Default = LoaderTemplate.bind({});

export default componentMeta;
