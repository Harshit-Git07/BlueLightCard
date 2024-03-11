import { Meta, StoryFn } from '@storybook/react';
import PillButtons from './PillButtons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/pro-regular-svg-icons';

const ComponentMeta: Meta<typeof PillButtons> = {
  title: 'Component System/Pill Component',
  component: PillButtons,
  argTypes: {},
};

const Template: StoryFn<typeof PillButtons> = (args) => <PillButtons {...args} />;

export const PillActive = Template.bind({});

PillActive.args = {
  text: 'Pill',
  onSelected: () => void 0,
};

export const PillDisabled = Template.bind({});

PillDisabled.args = {
  text: 'Pill',
  disabled: true,
  onSelected: () => void 0,
};

export const PillWithIconLeft = Template.bind({});

PillWithIconLeft.args = {
  text: 'Pill',
  onSelected: () => void 0,
  iconLeft: <FontAwesomeIcon size="sm" icon={faCog} />,
};

export const PillWithIconRight = Template.bind({});

PillWithIconRight.args = {
  text: 'Pill',
  onSelected: () => void 0,
  iconRight: <FontAwesomeIcon size="sm" icon={faCog} />,
};

export const PillOutline = Template.bind({});

PillOutline.args = {
  text: 'Pill',
  outline: true,
  onSelected: () => void 0,
};

export default ComponentMeta;
