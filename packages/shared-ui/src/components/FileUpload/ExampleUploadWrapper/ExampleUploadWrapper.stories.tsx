import { Meta, StoryFn } from '@storybook/react';
import ExampleUploadWrapper from '.';
import { defaultFileTypes, defaultMaxFileSize, defaultMaxUploads } from '../FileSelectionBody';

// Meta data of the component to build the story
const componentMeta: Meta<typeof ExampleUploadWrapper> = {
  title: 'Component System/FileUpload/Example',
  component: ExampleUploadWrapper,
  argTypes: {
    labelText: {
      description: 'Label text displayed at the top of the component',
    },
    allowedFileTypes: {
      description:
        'An array of [unique file type specifiers](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept#unique_file_type_specifiers) that the upload selector allows.',
    },
    expectedNumberOfUploads: {
      description:
        'The number of files a user is expected to upload, determined by their employer etc..',
    },
    maxFileSize: {
      description: 'The max size a file can be before it can no longer be selected by the user.',
    },
    validatePasswordProtectedPdfs: {
      description: 'Enable / disable filtering of files that are password protected.',
    },
  },
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof ExampleUploadWrapper> = (args) => (
  <ExampleUploadWrapper {...args} />
);

// Must always have at least a default story variant
export const Default = DefaultTemplate.bind({});
Default.args = {
  labelText: 'LABEL',
  allowedFileTypes: defaultFileTypes,
  maxFileSize: defaultMaxFileSize,
  expectedNumberOfUploads: defaultMaxUploads,
  validatePasswordProtectedPdfs: true,
};

export default componentMeta;
