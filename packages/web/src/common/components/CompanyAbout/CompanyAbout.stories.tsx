import React from 'react';
import { Meta, StoryFn } from '@storybook/react';

import CompanyAbout from './CompanyAbout';
import { CompanyAboutProps } from './types';

export default {
  title: 'Component System/CompanyAbout',
  component: CompanyAbout,
} as Meta;

const Template: StoryFn<CompanyAboutProps> = (args) => <CompanyAbout {...args} />;

export const NormalCompanyAbout = Template.bind({});
NormalCompanyAbout.args = {
  CompanyName: 'Lorem Ipsum',
  CompanyDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};

export const DescriptionOnlyCompanyAbout = Template.bind({});
DescriptionOnlyCompanyAbout.args = {
  CompanyName: '',
  CompanyDescription:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
};
