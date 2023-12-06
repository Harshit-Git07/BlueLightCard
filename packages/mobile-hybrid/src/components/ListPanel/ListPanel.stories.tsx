import { Meta, StoryFn } from '@storybook/react';
import ListPanel from './ListPanel';

const componentMeta: Meta<typeof ListPanel> = {
  title: 'ListPanel',
  component: ListPanel,
};

const DefaultTemplate: StoryFn<typeof ListPanel> = (args) => <ListPanel {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  visible: true,
  children: [
    <ul key={0} className="p-2">
      <li>Element 1</li>
      <li>Element 2</li>
    </ul>,
  ],
};

Default.parameters = {
  layout: 'fullscreen',
};

export default componentMeta;
