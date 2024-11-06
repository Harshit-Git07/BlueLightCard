import { Meta, StoryFn } from '@storybook/react';
import FileSelectionBody, { defaultFileTypes, defaultMaxFileSize } from '.';

const MaxWidthWrapper: typeof FileSelectionBody = (args) => (
  <div className="max-w-[350px]">
    <FileSelectionBody {...args} />
  </div>
);

// Meta data of the component to build the story
const componentMeta: Meta<typeof FileSelectionBody> = {
  title: 'Component System/FileUpload/Selector',
  component: FileSelectionBody,
  argTypes: {
    allowedFileTypes: {
      description:
        'An array of [unique file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers) that the upload selector allows.',
    },
    disabled: {
      description: 'Blocks user interaction',
    },
    maxFileSize: {
      description: 'The max size a file can be before it can no longer be selected by the user.',
    },
  },
  parameters: {
    controls: {
      exclude: ['onFilesSelected'],
    },
  },
};

const DefaultTemplate: StoryFn<typeof FileSelectionBody> = (args) => <MaxWidthWrapper {...args} />;

export const Enabled = DefaultTemplate.bind({});
Enabled.args = {
  disabled: false,
  allowedFileTypes: defaultFileTypes,
  maxFileSize: defaultMaxFileSize,
};

export const Disabled = DefaultTemplate.bind({});
Disabled.args = {
  disabled: true,
  allowedFileTypes: defaultFileTypes,
  maxFileSize: defaultMaxFileSize,
};

export default componentMeta;
