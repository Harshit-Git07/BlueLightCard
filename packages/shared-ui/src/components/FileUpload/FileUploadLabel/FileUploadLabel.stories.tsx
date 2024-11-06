import { Meta, StoryFn } from '@storybook/react';
import FileUploadLabel from '.';

// Meta data of the component to build the story
const componentMeta: Meta<typeof FileUploadLabel> = {
  title: 'Component System/FileUpload/Label',
  component: FileUploadLabel,
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof FileUploadLabel> = (args) => <FileUploadLabel {...args} />;

export const Default = DefaultTemplate.bind({});
Default.args = {
  labelText: 'label',
};

export default componentMeta;
