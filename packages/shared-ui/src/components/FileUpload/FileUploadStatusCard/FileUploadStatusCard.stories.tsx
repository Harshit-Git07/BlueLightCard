import { Meta, StoryFn } from '@storybook/react';
import FileUploadStatusCard from '.';
import { UploadStatus } from '../types';

const MaxWidthWrapper: typeof FileUploadStatusCard = (args) => (
  <div className="max-w-[350px]">
    <FileUploadStatusCard {...args} />
  </div>
);

// Meta data of the component to build the story
const componentMeta: Meta<typeof FileUploadStatusCard> = {
  title: 'Component System/FileUpload/StatusCard',
  component: FileUploadStatusCard,
  args: {
    fileName: 'filename.ext',
  },
  parameters: {
    controls: {
      exclude: ['removeFile'],
    },
  },
};

// Define the template which uses the component
const DefaultTemplate: StoryFn<typeof FileUploadStatusCard> = (args) => (
  <MaxWidthWrapper {...args} />
);

export const Loading = DefaultTemplate.bind({});
Loading.args = {
  uploadStatus: UploadStatus.Loading,
};

export const Success = DefaultTemplate.bind({});
Success.args = {
  uploadStatus: UploadStatus.Success,
};

export const ErrorWithoutMessage = DefaultTemplate.bind({});
ErrorWithoutMessage.args = {
  uploadStatus: UploadStatus.Error,
};

export const ErrorWithMessage = DefaultTemplate.bind({});
ErrorWithMessage.args = {
  uploadStatus: UploadStatus.Error,
  message: 'Upload Failed.',
};
ErrorWithMessage.parameters = {
  controls: {
    include: 'message',
  },
};

export const ErrorWithLongMessage = DefaultTemplate.bind({});
ErrorWithLongMessage.args = {
  uploadStatus: UploadStatus.Error,
  message: 'Upload Failed. Upload Failed. Upload Failed. Upload Failed.',
};
ErrorWithLongMessage.parameters = {
  controls: {
    include: 'message',
  },
};

export const LongFileName = DefaultTemplate.bind({});
LongFileName.args = {
  fileName: 'SuperLongFileName.longextension',
  uploadStatus: UploadStatus.Loading,
};
LongFileName.parameters = {
  controls: {
    include: 'fileName',
  },
};

export default componentMeta;
