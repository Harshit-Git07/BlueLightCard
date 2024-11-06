import { Meta, StoryFn } from '@storybook/react';
import FileUploadCounter from '.';

// Meta data of the component to build the story
const componentMeta: Meta<typeof FileUploadCounter> = {
  title: 'Component System/FileUpload/Counter',
  component: FileUploadCounter,
  argTypes: {
    currentNumberOfUploads: {
      control: {
        type: 'number',
      },
    },
    expectedNumberOfUploads: {
      control: {
        type: 'number',
      },
    },
  },
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof FileUploadCounter> = (args) => (
  <FileUploadCounter {...args} />
);

export const Default = DefaultTemplate.bind({});
Default.args = {
  currentNumberOfUploads: 0,
  expectedNumberOfUploads: 3,
};

export default componentMeta;
