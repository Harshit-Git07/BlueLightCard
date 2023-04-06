import { ComponentMeta, ComponentStory } from '@storybook/react';
import FileListItem from '@/components/FileListItem/FileListItem';
import { FileListItemStatus } from './types';
import styled from 'styled-components';

const StyledStoryComponentWrapper = styled.div`
  max-width: 700px;
`;

const componentMeta: ComponentMeta<typeof FileListItem> = {
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

const FileListViewTemplate: ComponentStory<typeof FileListItem> = (args) => (
  <StyledStoryComponentWrapper>
    <FileListItem {...args} />
  </StyledStoryComponentWrapper>
);

export const Default = FileListViewTemplate.bind({});

Default.args = {
  status: FileListItemStatus.NONE,
  name: 'file_name.pdf',
  fileLink: 'http://localhost:6006/',
  showReUpload: true,
};

export const Success = FileListViewTemplate.bind({});

Success.args = {
  status: FileListItemStatus.SUCCESS,
  name: 'file_name.pdf',
  fileLink: 'http://localhost:6006/',
  showReUpload: true,
};

export const Error = FileListViewTemplate.bind({});

Error.args = {
  status: FileListItemStatus.ERROR,
  name: 'file_name.pdf',
  fileLink: 'http://localhost:6006/',
  showReUpload: true,
};

export const Image = FileListViewTemplate.bind({});

Image.args = {
  status: FileListItemStatus.SUCCESS,
  name: 'file_name.pdf',
  fileLink: '',
  imageSrc: '/test_id_card.jpeg',
  imageLoader: ({ src }) => `http://localhost:6006${src}`,
  showReUpload: true,
};

export default componentMeta;
