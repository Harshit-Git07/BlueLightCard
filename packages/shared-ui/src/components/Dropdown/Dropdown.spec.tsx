import '@testing-library/jest-dom';
import { act, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './Dropdown.stories';
import { DropdownOptions, DropdownProps } from './types';

const { Default, Searchable } = composeStories(stories);

const onSelectMock = jest.fn();

const options: DropdownOptions = [
  {
    id: '1',
    label: 'Option One',
  },
  {
    id: '2',
    label: 'Option Two',
  },
  {
    id: '3',
    label: 'Option Three',
  },
  {
    id: '4',
    label: 'Option Four',
  },
  {
    id: '5',
    label: 'Option Five',
  },
  {
    id: '6',
    label: 'Option Six',
  },
  {
    id: '7',
    label: 'Option Seven',
  },
];

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('given initial render of default component', () => {
  let combobox: HTMLElement;

  beforeEach(async () => {
    const args: DropdownProps = {
      label: 'label',
      helpText: 'helptext',
      tooltipText: 'tooltip',
      message: 'message',
      error: true,
      selectedValue: '1',
      maxItemsShown: 3,
      options,
      placeholder: 'placeholder',
      onSelect: onSelectMock,
      disabled: false,
    };
    render(<Default {...args} />);

    combobox = screen.getByTestId('combobox');
  });

  it('should render successfully', async () => {
    expect(combobox).toBeInTheDocument();
  });

  describe('on clicking on the dropdown', () => {
    let dropdownList: HTMLElement;

    beforeEach(async () => {
      await act(() => userEvent.click(combobox));
      dropdownList = screen.getByTestId('dropdownList');
    });

    it('should render the options', async () => {
      const selectOptionOne = await within(dropdownList).getByText('Option One');
      expect(selectOptionOne).toBeInTheDocument();
    });

    describe('on clicking on an option', () => {
      beforeEach(async () => {
        await act(async () => {
          await userEvent.click(await within(dropdownList).getByText('Option One'));
        });
      });

      it('then the dropdown will close and the selected option will be submitted to the on select callback', async () => {
        const optionOne = await within(dropdownList).findByText('Option One');
        expect(onSelectMock).toHaveBeenCalledWith({ id: '1', label: 'Option One' });
        expect(optionOne).not.toBeInTheDocument();
      });
    });
  });

  describe('when tab key is pressed', () => {
    beforeEach(async () => {
      await userEvent.keyboard('{Tab}');
    });

    it('then the combobox should be focused', async () => {
      expect(combobox).toHaveFocus();
    });

    describe('when enter key is pressed on focused combobox', () => {
      let dropdownList: HTMLElement;

      beforeEach(async () => {
        await act(() => userEvent.keyboard('{Enter}'));
        dropdownList = screen.getByTestId('dropdownList');
      });

      it('then the options will be shown', async () => {
        const optionOne = await within(dropdownList).findByText('Option One');
        expect(optionOne).toBeInTheDocument();
      });

      it('then first option can be focused via a down keyboard button press', async () => {
        await userEvent.keyboard('{ArrowDown}');

        const optionOne = await within(dropdownList).findByText('Option One');
        expect(optionOne).toHaveFocus();
      });

      it('then second option can be focused via two down keyboard button presses', async () => {
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{ArrowDown}');

        const optionTwo = await within(dropdownList).findByText('Option Two');
        expect(optionTwo).toHaveFocus();
      });

      it('then the up arrow button will navigate up the list of options', async () => {
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{ArrowUp}');

        const optionOne = await within(dropdownList).findByText('Option One');
        expect(optionOne).toHaveFocus();
      });

      describe('when the escape button is pressed', () => {
        beforeEach(async () => {
          await userEvent.keyboard('{ArrowDown}');
          await act(() => userEvent.keyboard('{Escape}'));
        });

        it('then the dropdown will close and the combobox will be focused again', async () => {
          const optionOne = await within(dropdownList).findByText('Option One');
          expect(optionOne).not.toBeInTheDocument();
          expect(combobox).toHaveFocus();
        });
      });

      describe('when an option is selected via the enter key', () => {
        beforeEach(async () => {
          await userEvent.keyboard('{ArrowDown}');
          await act(() => userEvent.keyboard('{Enter}'));
        });

        it('then the dropdown will close and the selected option will be submitted to the on select callback', async () => {
          const optionOne = await within(dropdownList).findByText('Option One');
          expect(onSelectMock).toHaveBeenCalledWith({ id: '1', label: 'Option One' });
          expect(optionOne).not.toBeInTheDocument();
        });
      });
    });
  });
});

describe('given initial render of searchable component', () => {
  beforeEach(() => {
    render(<Searchable onSelect={onSelectMock} />);
  });

  describe('when text is typed into the search box', () => {
    let dropdownList: HTMLElement;

    beforeEach(async () => {
      const combobox = await screen.getByTestId('combobox');
      await act(() => userEvent.type(combobox, 'Option T'));

      dropdownList = screen.getByTestId('dropdownList');
    });

    it('should filter options that do not match the search query', async () => {
      const optionOne = await within(dropdownList).queryByText('Option One');

      expect(optionOne).not.toBeInTheDocument();
    });

    it('should display options that match the filter', async () => {
      const optionTwo = await within(dropdownList).queryByText('Option Two');
      const optionThree = await within(dropdownList).queryByText('Option Three');

      expect(optionTwo).toBeInTheDocument();
      expect(optionThree).toBeInTheDocument();
    });

    describe('when the keyboard controls are used to select the second option', () => {
      beforeEach(async () => {
        await userEvent.keyboard('{ArrowDown}');
        await act(() => userEvent.keyboard('{Enter}'));
      });

      it('should call the onSelect function with the selected option', () => {
        expect(onSelectMock).toHaveBeenCalledWith({ id: '2', label: 'Option Two' });
      });
    });

    describe('when the combo box is cleared', () => {
      beforeEach(async () => {
        const combobox = await screen.getByTestId('combobox');
        await act(() => userEvent.type(combobox, '{Backspace}'.repeat(8)));
      });

      it('then the full options list will be shown', async () => {
        const optionThree = await within(dropdownList).queryByText('Option Three');

        expect(optionThree).toBeInTheDocument();
      });
    });
  });

  describe('when the expand button is clicked', () => {
    beforeEach(async () => {
      const expandIcon = await screen.getByTestId('dropdown-expand-icon');
      await act(() => userEvent.click(expandIcon));
    });

    it('should focus the text field', async () => {
      const combobox = await screen.getByTestId('combobox');
      expect(combobox).toHaveFocus();
    });
  });
});

describe('given a tooltip has been configured', () => {
  beforeEach(() => {
    const args: DropdownProps = {
      label: 'label',
      helpText: 'helptext',
      showTooltipIcon: true,
      tooltipText: 'tooltip',
      message: 'message',
      error: true,
      selectedValue: '1',
      maxItemsShown: 3,
      options,
      placeholder: 'placeholder',
      onSelect: onSelectMock,
      disabled: false,
    };
    render(<Default {...args} />);
  });

  it('should render the tooltip', async () => {
    expect(await screen.getByTestId('tooltip')).toBeInTheDocument();
  });
});
