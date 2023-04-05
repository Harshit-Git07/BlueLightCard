import { ComponentMeta, ComponentStory } from '@storybook/react';
import FileListItem from '@/components/FileListItem/FileListItem';
import { FileListItemStatus } from './types';

const componentMeta: ComponentMeta<typeof FileListItem> = {
  title: 'Component System/File List Item',
  argTypes: {
    status: {
      options: Object.values(FileListItemStatus),
      control: {
        type: 'select',
      },
    },
  },
};

const FileListViewTemplate: ComponentStory<typeof FileListItem> = (args) => (
  <FileListItem {...args} />
);

export const Default = FileListViewTemplate.bind({});

Default.args = {
  status: FileListItemStatus.NONE,
  name: 'file_name.pdf',
  fileLink: window.location.href,
  imageSrc: '/test_id_card.jpeg',
  showReUpload: true,
};

export default componentMeta;
