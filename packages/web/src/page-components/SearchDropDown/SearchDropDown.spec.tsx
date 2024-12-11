import { render, fireEvent, within, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from './SearchDropDown.stories';
import '@testing-library/jest-dom';

const { Default, Interaction } = composeStories(stories);

import { act } from 'react';

jest.mock('@/hooks/useFetchCompaniesOrCategories');

describe('SearchDropDown Component', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  afterEach(() => {
    cleanup();
    document.body.classList.remove('no-scroll');
  });

  describe('Basic Rendering', () => {
    it('renders the dropdown correctly', () => {
      const { container } = render(<Default />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('Interactivity', () => {
    it('handles user interactions correctly', async () => {
      const onSearchCategoryChange = jest.fn();
      const onSearchCompanyChange = jest.fn();
      const onClose = jest.fn();

      const { container } = render(
        <Interaction
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onClose={onClose}
        />
      );

      const category = within(container).getByText('Children and toys');
      fireEvent.click(category);

      const companySearch = within(container).getByRole('combobox', {
        name: 'Search for a company',
        hidden: true,
      });
      await act(() => userEvent.type(companySearch, 'you'));

      const company = await within(container).findByText('Youth & Earth');
      fireEvent.click(company);

      // Close dropdown by clicking the overlay
      const overlay = within(container).getByTestId('search-dropdown-overlay');
      fireEvent.click(overlay);

      expect(onSearchCategoryChange).toHaveBeenCalledWith('11', 'Children and toys');
      expect(onSearchCompanyChange).toHaveBeenCalledWith('26529', 'Youth & Earth');
      expect(onClose).toHaveBeenCalled();
    });

    it('closes the dropdown when a category is clicked', () => {
      const onSearchCategoryChange = jest.fn();

      const { container } = render(
        <Interaction
          isOpen={true}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={jest.fn()}
          onClose={jest.fn()}
        />
      );

      const category = within(container).getByText('Children and toys');
      fireEvent.click(category);

      expect(onSearchCategoryChange).toHaveBeenCalledWith('11', 'Children and toys');
      const optionsListbox = container.querySelector('[role="listbox"]');
      expect(optionsListbox).not.toBeInTheDocument();
    });

    it('closes the dropdown when a company is clicked', async () => {
      const onSearchCompanyChange = jest.fn();

      const { container } = render(
        <Interaction
          onSearchCategoryChange={jest.fn()}
          onSearchCompanyChange={onSearchCompanyChange}
          onClose={jest.fn()}
        />
      );

      const companySearch = within(container).getByRole('combobox', {
        name: 'Search for a company',
        hidden: true,
      });

      await act(() => userEvent.type(companySearch, 'you'));
      const optionsListbox = container.querySelector('[role="listbox"]');
      expect(optionsListbox).toBeInTheDocument();

      const company = await within(container).findByText('Youth & Earth');
      fireEvent.click(company);

      expect(onSearchCompanyChange).toHaveBeenCalledWith('26529', 'Youth & Earth');
      expect(optionsListbox).not.toBeInTheDocument();
    });
  });

  describe('Scroll Behavior', () => {
    const onSearchCategoryChange = jest.fn();
    const onSearchCompanyChange = jest.fn();
    const onClose = jest.fn();

    it('adds the no-scroll class to the body when isOpen is true', () => {
      render(
        <Default
          isOpen={true}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onClose={onClose}
        />
      );

      expect(document.body.classList.contains('no-scroll')).toBe(true);
    });

    it('removes the no-scroll class from the body when isOpen is false', () => {
      render(
        <Default
          isOpen={false}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onClose={onClose}
        />
      );

      expect(document.body.classList.contains('no-scroll')).toBe(false);
    });

    it('removes the no-scroll class from the body when the component unmounts', () => {
      const { unmount } = render(
        <Default
          isOpen={true}
          onSearchCategoryChange={onSearchCategoryChange}
          onSearchCompanyChange={onSearchCompanyChange}
          onClose={onClose}
        />
      );

      expect(document.body.classList.contains('no-scroll')).toBe(true);

      unmount();

      expect(document.body.classList.contains('no-scroll')).toBe(false);
    });
  });
});
