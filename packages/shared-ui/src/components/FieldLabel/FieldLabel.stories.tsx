import { Meta, StoryFn } from '@storybook/react';
import FieldLabel from '.';

const componentMeta: Meta<typeof FieldLabel> = {
  title: 'Component System/FieldLabel',
  component: FieldLabel,
  argTypes: {
    label: {
      description: 'Optional heading style label to be display name to the children',
      control: 'string',
    },
    description: {
      description: 'Optional text to describe the children',
      control: 'string',
    },
    tooltip: {
      description: 'Optional help text to be displayed in tooltip',
      control: 'string',
    },
    tooltipPosition: {
      description: 'Optional position of the tooltip - defaults to "right"',
      control: 'select',
    },
    htmlFor: {
      description: 'Optional HtmlFor of the label, to match id of the children element',
      control: 'string',
    },
  },
};

const DefaultTemplate: StoryFn<typeof FieldLabel> = (args) => <FieldLabel {...args} />;
const PaddedTemplate: StoryFn<typeof FieldLabel> = (args) => (
  <div className="pt-10">
    {' '}
    <FieldLabel {...args} />
  </div>
);

export const AllProps = DefaultTemplate.bind({});
AllProps.args = {
  label: 'Example Info Wrapper',
  description: 'This is a description',
  tooltip: 'This is help text',
};

export const Label = DefaultTemplate.bind({});
Label.args = {
  label: 'Example Info Wrapper',
};

export const Description = DefaultTemplate.bind({});
Description.args = {
  description: 'This is a description',
};

export const LabelAndHelp = DefaultTemplate.bind({});
LabelAndHelp.args = {
  label: 'Example Info Wrapper',
  tooltip: 'This is a help text',
};

export const LabelAndHelpOnTop = PaddedTemplate.bind({});
LabelAndHelpOnTop.args = {
  label: 'Example Info Wrapper',
  tooltip: 'This is a help text',
  tooltipPosition: 'top',
};

export const LabelAndDescription = DefaultTemplate.bind({});
LabelAndDescription.args = {
  label: 'Example Info Wrapper',
  description: 'This is a description',
};

export const ExampleUsage: StoryFn<typeof FieldLabel> = () => {
  return (
    <div className="flex flex-col">
      <FieldLabel
        label="Username"
        htmlFor="username"
        description="You cannot change this later"
        tooltip="Remember this as you will use it to login"
      />
      <input
        className="max-w-[356px] h-8 px-2 rounded-md outline outline-1 outline-colour-onSurface-outline dark:outline-colour-onSurface-outline-dark"
        id="username"
        type="text"
        placeholder="Username"
      />
    </div>
  );
};

export default componentMeta;
