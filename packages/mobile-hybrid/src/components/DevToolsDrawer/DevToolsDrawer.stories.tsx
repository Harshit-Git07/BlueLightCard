import { Meta, StoryFn } from '@storybook/react';
import DevToolsDrawer from '.';

const componentMeta: Meta<typeof DevToolsDrawer> = {
  title: 'Organisms/Dev Tools Drawer',
  component: DevToolsDrawer,
  parameters: {
    status: 'done',
  },
  decorators: [],
};

const DefaultTemplate: StoryFn<typeof DevToolsDrawer> = (args) => <DevToolsDrawer {...args} />;

export const Default = DefaultTemplate.bind({});

export default componentMeta;
