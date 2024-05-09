import { Meta, StoryObj } from '@storybook/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/pro-regular-svg-icons';
import PillButtons from '.';

const meta: Meta<typeof PillButtons> = {
  title: 'Component System/Pill Component',
  component: PillButtons,
};

type Story = StoryObj<typeof PillButtons>;

export const PillDefault: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
  },
};

export const PillActive: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
    isSelected: true,
  },
};

export const PillDisabled: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    disabled: true,
    onSelected: () => void 0,
  },
};

export const PillWithIconLeft: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
    iconLeft: <FontAwesomeIcon size="sm" icon={faCog} />,
  },
};

export const PillWithIconRight: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
    iconRight: <FontAwesomeIcon size="sm" icon={faCog} />,
  },
};

export const PillWithIconLeftDisabled: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
    disabled: true,
    iconLeft: <FontAwesomeIcon size="sm" icon={faCog} />,
  },
};

export const PillWithIconRightDisabled: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    onSelected: () => void 0,
    disabled: true,
    iconRight: <FontAwesomeIcon size="sm" icon={faCog} />,
  },
};

export const PillOutlineWithIconRight: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    outline: true,
    iconRight: <FontAwesomeIcon size="sm" icon={faCog} />,
    onSelected: () => void 0,
  },
};

export const PillOutlineWithIconLeft: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    iconLeft: <FontAwesomeIcon size="sm" icon={faCog} />,
    outline: true,
    onSelected: () => void 0,
  },
};

export const PillOutline: Story = {
  render: (args) => <PillButtons {...args}>Pill</PillButtons>,
  args: {
    text: 'Pill',
    outline: true,
    onSelected: () => void 0,
  },
};

export default meta;
