import { Meta, StoryFn } from '@storybook/react';
import InfoWrapper from '.';

const componentMeta: Meta<typeof InfoWrapper> = {
  title: 'Component System/InfoWrapper',
  component: InfoWrapper,
  argTypes: {
    label: {
      description:
        'Optional heading style label to be display name to the children (required when helpIcon is True)',
      control: 'string',
    },
    description: { description: 'Optional text to describe the children', control: 'string' },
    helpIcon: {
      description: 'Optional help icon from which a tooltip will appear',
      control: 'boolean',
    },
    helpText: {
      description: 'Optional help text to be displayed in tooltip (required when helpIcon is True)',
      control: 'string',
    },
    helpPosition: {
      description: 'Optional position of the tooltip - defaults to "right"',
      control: 'select',
    },
    htmlFor: {
      description: 'Optional HtmlFor of the label, to match id of the children element',
      control: 'string',
    },
    children: {
      description: 'Children element to be wrapped by this component',
      control: 'element',
    },
  },
};

const DefaultTemplate: StoryFn<typeof InfoWrapper> = (args) => <InfoWrapper {...args} />;
const PaddedTemplate: StoryFn<typeof InfoWrapper> = (args) => (
  <div className="pt-10">
    {' '}
    <InfoWrapper {...args} />
  </div>
);

export const AllProps = DefaultTemplate.bind({});
AllProps.args = {
  label: 'Example Info Wrapper',
  description: 'This is a description',
  helpIcon: true,
  helpText: 'This is help text',
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
  helpIcon: true,
  helpText: 'This is a help text',
};

export const LabelAndHelpOnTop = PaddedTemplate.bind({});
LabelAndHelpOnTop.args = {
  label: 'Example Info Wrapper',
  helpIcon: true,
  helpText: 'This is a help text',
  helpPosition: 'top',
};

export const LabelAndDescription = DefaultTemplate.bind({});
LabelAndDescription.args = {
  label: 'Example Info Wrapper',
  description: 'This is a description',
};

export const ExampleUsage: StoryFn<typeof InfoWrapper> = () => {
  return (
    <div className="flex items-center">
      <InfoWrapper
        label="Username"
        htmlFor="username"
        description="You cannot change this later"
        helpIcon
        helpText="Cannot contain spaces"
      >
        <input
          className="h-8 px-2 rounded-md outline outline-1 outline-colour-onSurface-outline dark:outline-colour-onSurface-outline-dark"
          id="username"
          type="text"
          placeholder="Username"
        />
      </InfoWrapper>
    </div>
  );
};

export default componentMeta;
