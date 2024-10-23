import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import DetectDevice from './index';

const componentMeta: Meta<typeof DetectDevice> = {
  title: 'Reference code/MobileDetection',
  component: DetectDevice,
  parameters: {
    layout: 'centered',
    status: 'unimplemented',
  },
};

const Template: StoryFn<typeof DetectDevice> = () => <DetectDevice />;

export const Default = Template.bind({});

export default componentMeta;
