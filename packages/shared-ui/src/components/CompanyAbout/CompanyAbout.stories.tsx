import { Meta, StoryObj } from '@storybook/react';
import CompanyAbout from './';

const meta: Meta<typeof CompanyAbout> = {
  title: 'Component System/CompanyAbout',
  component: CompanyAbout,
};

type Story = StoryObj<typeof CompanyAbout>;

export const Default: Story = {
  render: (args) => <CompanyAbout {...args}></CompanyAbout>,
  args: {
    CompanyName: 'Lorem Ipsum',
    CompanyDescription:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  },
};

export default meta;
