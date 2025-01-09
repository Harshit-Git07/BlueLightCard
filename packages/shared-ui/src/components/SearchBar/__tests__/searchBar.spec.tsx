import { act, render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../SearchBar.stories';

const { Default, Edited, Submitted, Cleared, Reset, Error, ExperimentalDark, ExperimentalLight } =
  composeStories(stories);

it('renders the search bar', () => {
  const { container } = render(<Default />);

  expect(container).toMatchSnapshot();
});

it('renders the search bar with active experiments `dark`', async () => {
  const { container } = render(<ExperimentalDark />);

  const forms = container.getElementsByTagName('form');
  const searchForm = forms[0];
  const searchInput = await within(searchForm).findByLabelText('Search bar');

  expect(searchForm).toHaveClass('bg-colour-primary-light');
  expect(searchForm).toHaveClass('shadow-[0_4px_4px_4px_rgba(42,42,42,0.16)]');
  expect(searchInput).toHaveClass('border-searchBar-outline-colour-light');
  expect(container).toMatchSnapshot();
});

it('renders the search bar with active experiments `light`', async () => {
  const { container } = render(<ExperimentalLight />);

  const forms = container.getElementsByTagName('form');
  const searchForm = forms[0];
  const searchInput = await within(searchForm).findByLabelText('Search bar');

  expect(searchForm).toHaveClass('bg-[#F6F9FF]');
  expect(searchForm).toHaveClass('shadow-[0_4px_4px_4px_rgba(42,42,42,0.16)]');
  expect(searchInput).toHaveClass('border-colour-primary-light');
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

describe('displays an error', () => {
  jest.restoreAllMocks();

  it('shows the given error message', async () => {
    const onSearch = jest.fn();

    const { container } = render(<Error onSearch={onSearch} />);

    const errorMessage = screen.getByText('Enter 3 or more characters to search.');
    expect(errorMessage).toHaveClass('error-message');

    expect(container).toMatchSnapshot();
  });
});
