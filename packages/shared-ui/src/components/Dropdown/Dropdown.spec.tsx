import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownOptions, DropdownProps } from './types';
import Dropdown from '.';
import { act } from 'react';

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
  jest.resetAllMocks();
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('Dropdown Component', () => {
  const setup = (props?: Partial<DropdownProps>) => {
    const defaultArgs: DropdownProps = {
      label: 'Label',
      description: 'helptext',
      tooltip: 'tooltip',
      validationMessage: 'message',
      isValid: true,
      value: options[0],
      maxItemsShown: 3,
      options,
      placeholder: 'Placeholder',
      onChange: onSelectMock,
      isDisabled: false,
    };

    return render(<Dropdown {...defaultArgs} {...props} />);
  };

  describe('Default Dropdown', () => {
    it('renders successfully with all props', () => {
      setup();

      expect(screen.getByTestId('combobox')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
      expect(screen.getByText('helptext')).toBeInTheDocument();
      expect(screen.getByText('Placeholder')).toBeInTheDocument();
    });

    it('does not render options initially', () => {
      setup();

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    describe('when clicking the dropdown', () => {
      it('displays options', async () => {
        setup();

        await userEvent.click(screen.getByTestId('combobox'));

        const dropdownList = screen.getByRole('listbox');
        expect(dropdownList).toBeInTheDocument();
        expect(within(dropdownList).getByText('Option One')).toBeInTheDocument();
      });

      it('closes when clicking outside', async () => {
        setup();

        await userEvent.click(screen.getByTestId('combobox'));
        await userEvent.click(document.body);

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });

      it('calls onSelect when an option is clicked', async () => {
        setup();

        await userEvent.click(screen.getByTestId('combobox'));
        const option = screen.getByText('Option Two');
        await userEvent.click(option);

        expect(onSelectMock).toHaveBeenCalledWith(expect.objectContaining(options[1]));
      });
    });

    describe('keyboard navigation', () => {
      it('opens dropdown with Enter key when focused', async () => {
        setup();
        const combobox = screen.getByTestId('combobox');

        combobox.focus();
        await userEvent.keyboard('{Enter}');

        await waitFor(() => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        });
      });

      it('navigates options with ArrowDown and ArrowUp', async () => {
        setup();

        const combobox = screen.getByTestId('combobox');
        await userEvent.click(combobox);

        const options = screen.getAllByRole('option');

        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(options[0]);

        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(options[1]);

        await userEvent.keyboard('{ArrowUp}');
        expect(document.activeElement).toBe(options[0]);
      });

      it('selects an option with Enter', async () => {
        setup();

        const combobox = screen.getByTestId('combobox');
        await userEvent.click(combobox);
        await userEvent.keyboard('{ArrowDown}');
        await userEvent.keyboard('{Enter}');

        expect(onSelectMock).toHaveBeenCalledWith(expect.objectContaining(options[0]));
      });

      it('closes the dropdown with Escape', async () => {
        setup();

        const combobox = screen.getByTestId('combobox');
        await userEvent.type(combobox, '{Enter}');
        await userEvent.keyboard('{Escape}');

        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('Searchable Dropdown', () => {
    it('renders successfully with search functionality', () => {
      setup({ searchable: true });

      expect(screen.getByTestId('combobox')).toHaveAttribute('type', 'text');
    });

    describe('when typing in the search box', () => {
      it('filters options based on search term', async () => {
        setup({ searchable: true });

        const combobox = screen.getByTestId('combobox');
        await act(async () => {
          await userEvent.clear(combobox);
          await userEvent.type(combobox, 'Option T');
        });

        const dropdownList = screen.getByRole('listbox');
        expect(dropdownList).toBeInTheDocument();

        expect(within(dropdownList).queryByText('Option One')).not.toBeInTheDocument();
        expect(within(dropdownList).getByText('Option Two')).toBeInTheDocument();
        expect(within(dropdownList).getByText('Option Three')).toBeInTheDocument();
      });

      it('clears the filter when the search term is erased', async () => {
        setup({ searchable: true });

        const combobox = screen.getByTestId('combobox');
        await act(async () => {
          await userEvent.type(combobox, 'Option T');
          await userEvent.clear(combobox);
          await userEvent.click(combobox); // Ensure dropdown opens after clearing
        });
        const dropdownList = screen.getByRole('listbox');
        expect(within(dropdownList).getByText('Option One')).toBeInTheDocument();
      });
    });

    describe('keyboard navigation in search mode', () => {
      it('navigates filtered options and selects with Enter', async () => {
        setup({ searchable: true });

        const combobox = screen.getByTestId('combobox');
        await act(async () => {
          await userEvent.clear(combobox);
          await userEvent.type(combobox, 'Option');
          await userEvent.keyboard('{ArrowDown}');
          await userEvent.keyboard('{Enter}');
        });
        expect(onSelectMock).toHaveBeenCalledWith(expect.objectContaining(options[0]));
      });
    });
  });

  describe('Disabled Dropdown', () => {
    it('does not open or allow interaction when disabled', async () => {
      setup({ isDisabled: true });

      const combobox = screen.getByTestId('combobox');
      expect(combobox).toBeDisabled();

      await userEvent.click(combobox);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Tooltip functionality', () => {
    it('renders tooltip when configured', async () => {
      setup({ tooltip: 'Tooltip test' });

      const trigger = screen.getByLabelText('information');

      await userEvent.hover(trigger);

      expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip test');
    });
  });
});
