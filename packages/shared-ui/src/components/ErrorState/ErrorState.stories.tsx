import { Meta, StoryFn } from '@storybook/react';
import ErrorState from './';

const componentMeta: Meta<typeof ErrorState> = {
  title: 'Molecules/Error State',
  component: ErrorState,
  argTypes: {
    messageText: {
      type: 'string',
    },
    buttonText: {
      type: 'string',
    },
    onButtonClick: {
      type: 'function',
    },
  },
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/12c2snituzWzDVy8oVfrZb/Empty-Views?node-id=2-1043&m=dev',
    },
  },
};

const DefaultTemplate: StoryFn<typeof ErrorState> = (args) => <ErrorState {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  onButtonClick: () => window.location.reload(),
};

export const Customised = DefaultTemplate.bind({});
Customised.args = {
  messageText: 'An unexpected error has occurred.',
  buttonText: 'Go back',
};
Customised.argTypes = {
  onButtonClick: { action: 'Button clicked' },
};

export default componentMeta;
