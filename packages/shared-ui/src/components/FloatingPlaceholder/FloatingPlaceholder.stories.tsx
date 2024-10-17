import { Meta, StoryFn } from '@storybook/react';
import FloatingPlaceholder from './';

const componentMeta: Meta<typeof FloatingPlaceholder> = {
  title: 'Component System/FloatingPlaceholder',
  component: FloatingPlaceholder,
};

const DefaultTemplate: StoryFn<typeof FloatingPlaceholder> = (args) => (
  <FloatingPlaceholder {...args} />
);

export const Default = DefaultTemplate.bind({});
export const Disabled = DefaultTemplate.bind({});

const getMockChild = (isDisabled: boolean) => (
  <input
    id="fieldId"
    type="text"
    disabled={isDisabled}
    className="w-full px-[16px] py-[12px] border border-colour-primary rounded-md border outline-none"
  />
);

Default.args = {
  text: 'Placeholder',
  targetId: 'fieldId',
  children: getMockChild(false),
  isFieldDisabled: false,
};
Disabled.args = {
  ...Default.args,
  isFieldDisabled: true,
  children: getMockChild(true),
};

export default componentMeta;
