import '@testing-library/jest-dom';
import { act, render, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../Dropdown.stories';

const { Default, Searchable } = composeStories(stories);

describe('Dropdown', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the dropdown', async () => {
    const { container } = render(<Default />);

    const combobox = within(container).getByText('Select company');

    expect(combobox).toBeInTheDocument();

    await act(() => userEvent.click(combobox));

    const selectOptionOne = within(container).getByText('Option One');
    expect(selectOptionOne).toBeInTheDocument();
  });

  it('is searchable', async () => {
    const onSelect = jest.fn();

    const { container } = render(<Searchable onSelect={onSelect} />);

    const combobox = within(container).getByPlaceholderText('Select company');
    await act(() => userEvent.type(combobox, 'Option T'));

    // option one should NOT be included
    const listboxOptionOne = within(container).queryByText('Option One');
    expect(listboxOptionOne).not.toBeInTheDocument();

    // option two should be included
    const listboxOptionTwo = within(container).getByText('Option Two');
    expect(listboxOptionTwo).toBeInTheDocument();

    // option three should be included
    const listboxOptionThree = within(container).getByText('Option Three');
    expect(listboxOptionThree).toBeInTheDocument();

    await userEvent.keyboard('{ArrowDown}');
    await act(() => userEvent.keyboard('{Enter}'));
    expect(onSelect).toHaveBeenCalledWith({ id: '2', label: 'Option Two' });
  });

  describe('keyboard accessibility', () => {
    let onSelect: jest.Mock;
    let container: HTMLElement;

    const focusCombobox = async () => {
      await userEvent.keyboard('{Tab}');
      const combobox = within(container).getByText('Select company');

      return combobox;
    };

    const openCombobox = async (combobox: HTMLElement) => {
      await act(() => userEvent.keyboard('{Enter}'));
    };

    beforeEach(() => {
      onSelect = jest.fn();

      container = render(<Default onSelect={onSelect} />).container;
    });

    it('can be tabbed to', async () => {
      const combobox = await focusCombobox();
      expect(combobox).toHaveFocus();
    });

    it('can open the listbox by pressing enter', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionOne = await within(container).findByText('Option One');

      expect(selectOptionOne).toBeInTheDocument();
    });

    it('can enter the listbox by pressing down', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionOne = await within(container).findByText('Option One');
      await userEvent.keyboard('{ArrowDown}');

      expect(selectOptionOne).toHaveFocus();
    });

    it('can focus the next listbox option by pressing down twice', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionTwo = within(container).getByText('Option Two');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowDown}');
      expect(selectOptionTwo).toHaveFocus();
    });

    it('can focus the previous listbox option by pressing up', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionOne = await within(container).findByText('Option One');
      await userEvent.keyboard('{ArrowDown}');
      await userEvent.keyboard('{ArrowUp}');

      expect(selectOptionOne).toHaveFocus();
    });

    it('can close the listbox by pressing escape', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionOne = await within(container).findByText('Option One');
      await userEvent.keyboard('{ArrowDown}');
      await act(() => userEvent.keyboard('{Escape}'));

      expect(selectOptionOne).not.toBeInTheDocument();
      expect(combobox).toHaveFocus();
    });

    it('can select a listbox option and close the listbox by pressing enter', async () => {
      const combobox = await focusCombobox();
      await openCombobox(combobox);

      const selectOptionOne = await within(container).findByText('Option One');
      await userEvent.keyboard('{ArrowDown}');
      await act(() => userEvent.keyboard('{Enter}'));

      expect(onSelect).toHaveBeenCalledWith({ id: '1', label: 'Option One' });
      expect(selectOptionOne).not.toBeInTheDocument();
    });
  });
});
