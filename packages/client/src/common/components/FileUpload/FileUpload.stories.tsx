import { ComponentMeta, ComponentStory } from '@storybook/react';
import FileUpload from '@/components/FileUpload/FileUpload';

const componentMeta: ComponentMeta<typeof FileUpload> = {
  title: 'Component System/File Upload',
};

const FileUploadTemplate: ComponentStory<typeof FileUpload> = (args) => <FileUpload {...args} />;

export const FileUploadStory = FileUploadTemplate.bind({});

FileUploadStory.args = {};

export default componentMeta;
