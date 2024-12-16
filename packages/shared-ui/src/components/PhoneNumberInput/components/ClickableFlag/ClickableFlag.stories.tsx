import { Meta, StoryFn } from '@storybook/react';
import ClickableFlag from '.';

const componentMeta: Meta<typeof ClickableFlag> = {
  title: 'Component System/PhoneNumberInput/ClickableFlag',
  component: ClickableFlag,
};

const DefaultTemplate: StoryFn<typeof ClickableFlag> = (args) => <ClickableFlag {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  iso2: 'gb',
  name: 'UK',
  isOpen: false,
  toggleDropdown: () => undefined,
};

export const IsOpen = DefaultTemplate.bind({});

IsOpen.args = {
  iso2: 'gb',
  name: 'UK',
  isOpen: true,
  toggleDropdown: () => undefined,
};

export default componentMeta;
