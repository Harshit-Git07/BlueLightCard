import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import LoadingSpinner from '.';

const componentMeta: Meta<typeof LoadingSpinner> = {
  title: 'Component System/LoadingSpinner',
  component: LoadingSpinner,
  argTypes: {},
};

const DefaultTemplate: StoryFn<typeof LoadingSpinner> = () => <LoadingSpinner />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
