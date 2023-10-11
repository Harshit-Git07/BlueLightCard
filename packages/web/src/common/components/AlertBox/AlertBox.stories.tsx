import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import AlertBox from './AlertBox';
import { AlertBoxProps } from './types';

export default {
  title: 'Component System/AlertBox',
  component: AlertBox,
} as Meta;

const Template: StoryFn<AlertBoxProps> = (args) => <AlertBox {...args} />;

export const SuccessAlert = Template.bind({});
SuccessAlert.args = {
  alertType: 'success',
  title: 'Success Alert',
  description: 'This is a success message.',
};

export const WarningAlert = Template.bind({});
WarningAlert.args = {
  alertType: 'warning',
  title: 'Warning Alert',
  description: 'This is a warning message.',
};

export const ErrorAlert = Template.bind({});
ErrorAlert.args = {
  alertType: 'danger',
  title: 'Error Alert',
  description: 'This is an error message.',
};

export const InfoAlert = Template.bind({});
InfoAlert.args = {
  alertType: 'info',
  title: 'Info Alert',
  description: 'This is an info message.',
};
