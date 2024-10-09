import { Meta, StoryFn } from '@storybook/react';
import Tooltip, { Props } from './';
import Label from '../Label';

export default {
  title: 'Component System/Tooltip',
  component: Tooltip,
  decorators: [
    (Story) => (
      <div className={'bg-colour-surface dark:bg-colour-surface-dark'}>
        <Story />
      </div>
    ),
  ],
} as Meta;

const Template: StoryFn<Props> = (args) => {
  return (
    <div className="h-56 flex items-center justify-center">
      <Tooltip {...args} />
    </div>
  );
};

export const TooltipDisplayRightOnHover = Template.bind({});
TooltipDisplayRightOnHover.args = {
  children: <Label text="Display the tooltip on hover to the right" type="normal" />,
  text: 'Tooltip Text',
  position: 'right',
  isMaxWidth: false,
};

export const TooltipDisplayLeftOnHover = Template.bind({});
TooltipDisplayLeftOnHover.args = {
  children: <Label text="Display the tooltip on hover to the left" type="normal" />,
  text: 'Tooltip Text',
  position: 'left',
  isMaxWidth: false,
};

export const TooltipDisplayTopOnHover = Template.bind({});
TooltipDisplayTopOnHover.args = {
  children: <Label text="Display the tooltip on hover to the top" type="normal" />,
  text: 'Tooltip Text',
  position: 'top',
  isMaxWidth: false,
};

export const TooltipDisplayBottomOnHover = Template.bind({});
TooltipDisplayBottomOnHover.args = {
  children: <Label text="Display the tooltip on hover to the bottom" type="normal" />,
  text: 'Tooltip Text',
  position: 'bottom',
  isMaxWidth: false,
};

export const TooltipMaxWidthWithSpace = Template.bind({});
TooltipMaxWidthWithSpace.args = {
  children: (
    <Label text="Display the tooltip with max width, so white space around" type="normal" />
  ),
  text: 'Less than maximum',
  position: 'top',
  isMaxWidth: true,
};

export const TooltipMultiline = Template.bind({});
TooltipMultiline.args = {
  children: <Label text="Display the tooltip with multiline" type="normal" />,
  text: 'Text length is more than the max, so wraps in new lines. Keeps on wrapping to new lines ...',
  position: 'top',
  isMaxWidth: false,
};

export const TooltipDisplayIsOpen = Template.bind({});
TooltipDisplayIsOpen.args = {
  children: <Label text="My tooltip is displayed by default" type="normal" />,
  text: 'Tooltip Text',
  position: 'right',
  isMaxWidth: false,
  isOpen: true,
};
