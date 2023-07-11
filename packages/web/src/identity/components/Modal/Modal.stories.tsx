import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import Modal from './Modal';
import { ModalTypes } from './Types';

const componentMeta: Meta<typeof Modal> = {
  title: 'Component System/identity/Modal',
  component: Modal,
  argTypes: {},
};

const ModalTemplate: StoryFn<typeof Modal> = (args) => {
  return <Modal {...args} />;
};

export const Default = ModalTemplate.bind({});

Default.args = {
  isVisible: true,
  type: ModalTypes.QuitEligibility,
};

export default componentMeta;
