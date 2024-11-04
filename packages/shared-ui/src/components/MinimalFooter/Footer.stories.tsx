import { Meta, StoryFn } from '@storybook/react';
import MainContainer from '.';

const meta: Meta<typeof MainContainer> = {
  title: 'MER/Minimal Footer',
  component: MainContainer,
};

const MainContainerTemplate: StoryFn<typeof MainContainer> = (args) => <MainContainer />;
export const Default = MainContainerTemplate.bind({});
Default.args = {};

export default meta;
