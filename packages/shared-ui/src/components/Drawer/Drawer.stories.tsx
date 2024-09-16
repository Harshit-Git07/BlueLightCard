import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Drawer } from '.';
import Button from '../Button';

const componentMeta: Meta<typeof Drawer> = {
  title: 'Component System/Drawer',
  component: Drawer,
  argTypes: {},
};

const DrawerTemplate: StoryFn<typeof Drawer> = (args) => {
  return (
    <Drawer {...args}>
      <Button>Open Drawer 1</Button>
    </Drawer>
  );
};

export const Default = DrawerTemplate.bind({});

Default.args = {
  drawer: () => (
    <div className="w-full h-full">
      <p className="text-center">Drawer Component 1</p>
      <Drawer
        drawer={() => (
          <div className="w-full h-full">
            <p className="text-center">Drawer Component 2</p>
          </div>
        )}
      >
        <Button>Open Drawer 2</Button>
      </Drawer>
    </div>
  ),
};

export const ErrorDrawer = DrawerTemplate.bind({});

ErrorDrawer.args = {
  drawer: () => {
    throw Error('Error Message displayed here.');
  },
};

export default componentMeta;
