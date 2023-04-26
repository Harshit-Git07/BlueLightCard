import { Meta, StoryFn } from '@storybook/react';
import FileUpload from '@/components/FileUpload/FileUpload';
import { FileUploadMimeTypes } from './types';

const componentMeta: Meta<typeof FileUpload> = {
  title: 'Component System/File Upload',
  argTypes: {
    description: {
      description: 'Description that appears at the bottom of the component',
    },
    maxUploadSizeMb: {
      description: 'Max file size in Mbs per file',
    },
    allowMultiple: {
      description: 'Allow multiple file uploads',
    },
    onError: {
      table: {
        disable: true,
      },
    },
    onUpload: {
      table: {
        disable: true,
      },
    },
  },
};

const FileUploadTemplate: StoryFn<typeof FileUpload> = (args) => (
  <FileUpload
    {...args}
    onError={(files) => console.error('Failed files', files)}
    onUpload={(files) => console.info('Successful files', files)}
  />
);

export const Default = FileUploadTemplate.bind({});

Default.args = {
  description: 'Place on a plain, well lit surface with no obstructions, blur or glare',
  mimeTypes: [FileUploadMimeTypes.PNG, FileUploadMimeTypes.JPEG, FileUploadMimeTypes.PDF],
  maxUploadSizeMb: 2,
  allowMultiple: false,
};

export default componentMeta;
