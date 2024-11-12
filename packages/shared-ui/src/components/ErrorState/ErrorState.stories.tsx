import { Meta, StoryFn } from '@storybook/react';
import { StorybookPlatformAdapterDecorator } from '../../adapters/StorybookPlatformAdapter';
import { StorybookSharedUIConfigDecorator } from '../../providers/StorybookSharedUIConfigDecorator';
import ErrorState from './';

const componentMeta: Meta<typeof ErrorState> = {
  title: 'Molecules/Error State',
  component: ErrorState,
  args: {
    page: 'storybook',
  },
  argTypes: {
    page: {
      type: 'string',
      description: 'Page that is triggering the error state, used for Amplitude analytics events',
    },
    messageText: {
      type: 'string',
      description: 'Optional override for the message shown in the error state',
    },
    buttonText: {
      type: 'string',
      description: 'Optional override for the text shown in the error state call to action button',
    },
    onButtonClick: {
      type: 'function',
      description: 'Optional override for the behaviour of the error state call to action button',
    },
  },
  parameters: {
    status: 'done',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/12c2snituzWzDVy8oVfrZb/Empty-Views?node-id=2-1043&m=dev',
    },
  },
  decorators: [StorybookSharedUIConfigDecorator, StorybookPlatformAdapterDecorator],
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
