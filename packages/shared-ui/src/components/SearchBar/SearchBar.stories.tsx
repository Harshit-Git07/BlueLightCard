// components/SearchBar/SearchBar.stories.js (or .tsx)
import { Meta, StoryFn } from '@storybook/react';
import { fireEvent, userEvent, within } from '@storybook/testing-library';
import SearchBar from './index';

const componentMeta: Meta<typeof SearchBar> = {
  title: 'SearchBar',
  component: SearchBar,
  argTypes: {
    onSearch: { action: 'Search submitted' },
  },
};

const DefaultTemplate: StoryFn<typeof SearchBar> = (args) => <SearchBar {...args} />;

export const Default = DefaultTemplate.bind({});

Default.args = {
  labelText: 'Search bar',
  placeholderText: 'Search for offers or companies',
  showBackArrow: false,
};

export const Edited = DefaultTemplate.bind({});

Edited.args = {
  ...Default.args,
};
Edited.play = async ({ canvasElement }) => {
  const screen = within(canvasElement);

  const searchBar = screen.getByLabelText('Search bar');

  fireEvent.focusIn(searchBar);
  await userEvent.type(searchBar, 'Nike');
};

export const Error = DefaultTemplate.bind({});

Error.args = {
  ...Default.args,
  errorMessage: 'Enter 3 or more characters to search.',
};

export const Submitted = DefaultTemplate.bind({});

Submitted.args = {
  ...Default.args,
};
Submitted.play = async (props) => {
  if (Edited.play) {
    await Edited.play(props);
  }

  const { canvasElement } = props;
  const screen = within(canvasElement);

  const searchBar = screen.getByLabelText('Search bar');

  fireEvent.keyDown(searchBar, { key: 'Enter' });
};

export const SubmittedAndCleared = DefaultTemplate.bind({});
SubmittedAndCleared.args = {
  ...Default.args,
  clearOnSubmit: true,
};
SubmittedAndCleared.play = async (props) => {
  if (Submitted.play) {
    await Submitted.play(props);
  }
};

export const Cleared = DefaultTemplate.bind({});

Cleared.args = {
  ...Default.args,
};
Cleared.play = async (props) => {
  if (Edited.play) {
    await Edited.play(props);
  }

  const { canvasElement } = props;
  const screen = within(canvasElement);

  const clearButton = screen.getByLabelText('Clear button');

  await userEvent.click(clearButton.children[0]);
};

export const Reset = DefaultTemplate.bind({});

Reset.args = {
  ...Default.args,
};
Reset.play = async (props) => {
  if (Edited.play) {
    await Edited.play(props);
  }

  const { canvasElement } = props;
  const screen = within(canvasElement);

  const backButton = screen.getByLabelText('Back button');

  await userEvent.click(backButton.children[0]);
};

export const ExperimentalDark = DefaultTemplate.bind({});

ExperimentalDark.args = {
  ...Default.args,
  experimentalSearchVariant: 'background-variant-dark',
};

export const ExperimentalLight = DefaultTemplate.bind({});

ExperimentalLight.args = {
  ...Default.args,
  experimentalSearchVariant: 'background-variant-light',
};

export default componentMeta;
