import { act, render, fireEvent, within, cleanup } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../../SearchDropDown/SearchDropDown.stories';

const { Default, Interaction } = composeStories(stories);

describe('SearchDropDown', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the dropdown', () => {
    const { container } = render(<Default />);

    expect(container).toMatchSnapshot();
  });

  it('is interactive', async () => {
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

    const companySearch = within(container).getByPlaceholderText('Search for a company');
    await act(() => userEvent.type(companySearch, 'you'));

    const company = await within(container).findByText('Youth & Earth');
    fireEvent.click(company);

    const overlay = within(container).getByTestId('search-dropdown-overlay');
    fireEvent.click(overlay);

    expect(onSearchCategoryChange).toHaveBeenCalledWith('11', 'Children and toys');
    expect(onSearchCompanyChange).toHaveBeenCalledWith('26529', 'Youth & Earth');
    expect(onClose).toHaveBeenCalled();
  });

  it('closes the SearchDropDown when clicking on a Category', async () => {
    const onSearchCategoryChange = jest.fn();
    const mockOnClose = jest.fn();

    const { container } = render(
      <Interaction
        isOpen={true}
        onSearchCategoryChange={onSearchCategoryChange}
        onSearchCompanyChange={() => {}}
        onClose={mockOnClose}
      />
    );

    const category = within(container).getByText('Children and toys');
    fireEvent.click(category);

    const overlay = within(container).getByTestId('search-dropdown-overlay');
    fireEvent.click(overlay);

    expect(onSearchCategoryChange).toHaveBeenCalledWith('11', 'Children and toys');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('closes the SearchDropDown when clicking on a Company', async () => {
    const onSearchCompanyChange = jest.fn();
    const mockOnClose = jest.fn();

    const { container } = render(
      <Interaction
        onSearchCategoryChange={() => {}}
        onSearchCompanyChange={onSearchCompanyChange}
        onClose={mockOnClose}
      />
    );

    const companySearch = within(container).getByPlaceholderText('Search for a company');
    await act(() => userEvent.type(companySearch, 'you'));

    const company = await within(container).findByText('Youth & Earth');
    fireEvent.click(company);

    const overlay = within(container).getByTestId('search-dropdown-overlay');
    fireEvent.click(overlay);

    expect(onSearchCompanyChange).toHaveBeenCalledWith('26529', 'Youth & Earth');
    expect(mockOnClose).toHaveBeenCalled();
  });
});

describe('SearchDropDown scroll behavior', () => {
  const onSearchCategoryChange = jest.fn();
  const onSearchCompanyChange = jest.fn();
  const onClose = jest.fn();

  afterEach(() => {
    cleanup();
    document.body.classList.remove('no-scroll');
  });

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

  it('removes the no-scroll class from the body when component unmounts', () => {
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
