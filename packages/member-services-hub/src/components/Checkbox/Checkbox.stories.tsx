import { Meta, StoryFn } from '@storybook/react';
import Checkbox from './Checkbox';
import React from 'react';

const componentMeta: Meta<typeof Checkbox> = {
  title: 'member-services-hub/Checkbox',
  component: Checkbox,
};

const Template: StoryFn<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: 'heres an option',
};

export const DefaultPrechecked = Template.bind({});

DefaultPrechecked.args = {
  label: 'heres an option',
  prechecked: true,
};

export const CheckboxRadial = Template.bind({});

CheckboxRadial.args = {
  label: 'heres an option',
  style: 'radial',
};

export const CheckboxRadialPrechecked = Template.bind({});

CheckboxRadialPrechecked.args = {
  label: 'heres an option',
  style: 'radial',
  prechecked: true,
};

export default componentMeta;
