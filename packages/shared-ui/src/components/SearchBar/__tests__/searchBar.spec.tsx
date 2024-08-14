import { act, render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../SearchBar.stories';

const { Default, Edited, Submitted, Cleared, Reset } = composeStories(stories);

it('renders the search bar', () => {
  const { container } = render(<Default />);

  expect(container).toMatchSnapshot();
});

it('edits the search bar', async () => {
  const onFocus = jest.fn();
  const { container } = render(<Edited onFocus={onFocus} />);

  await act(() => Edited.play({ canvasElement: container }));

  expect(onFocus).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});

it('submits the search bar', async () => {
  const onSearch = jest.fn();

  const { container } = render(<Submitted onSearch={onSearch} />);

  await act(() => Submitted.play({ canvasElement: container }));

  expect(onSearch).toHaveBeenCalledWith('Nike');
  expect(container).toMatchSnapshot();
});

it('clears the search bar', async () => {
  const onClear = jest.fn();

  const { container } = render(<Cleared onClear={onClear} />);

  await act(() => Cleared.play({ canvasElement: container }));

  expect(onClear).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});

it('resets the search bar', async () => {
  const onBackButtonClick = jest.fn();

  const { container } = render(<Reset onBackButtonClick={onBackButtonClick} />);

  await act(() => Reset.play({ canvasElement: container }));

  expect(onBackButtonClick).toHaveBeenCalled();
  expect(container).toMatchSnapshot();
});
