import { Meta, StoryFn } from '@storybook/react';
import FileListItem from '@/components/FileListItem/FileListItem';
import { FileListItemStatus } from './types';

const componentMeta: Meta<typeof FileListItem> = {
  title: 'Component System/File List Item',
  argTypes: {
    status: {
      options: Object.values(FileListItemStatus),
      control: {
        type: 'select',
      },
    },
    imageSrc: {
      control: {
        type: null,
      },
    },
  },
};

const FileListViewTemplate: StoryFn<typeof FileListItem> = (args) => (
  <div>
    <FileListItem {...args} />
  </div>
);

export const Default = FileListViewTemplate.bind({});

const host = window.location.origin;

Default.args = {
  status: FileListItemStatus.NONE,
  name: 'file_name.pdf',
  fileLink: host,
  showReUpload: true,
};

export const Success = FileListViewTemplate.bind({});

Success.args = {
  status: FileListItemStatus.SUCCESS,
  name: 'file_name.pdf',
  fileLink: host,
  showReUpload: true,
};

export const Error = FileListViewTemplate.bind({});

Error.args = {
  status: FileListItemStatus.ERROR,
  name: 'file_name.pdf',
  fileLink: host,
  showReUpload: true,
};

export const Image = FileListViewTemplate.bind({});

Image.args = {
  status: FileListItemStatus.SUCCESS,
  name: 'file_name.pdf',
  fileLink: '',
  imageSrc: 'assets/test_id_card_blue.jpeg',
  showReUpload: true,
};

export default componentMeta;
