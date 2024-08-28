import { act, render, fireEvent, within } from '@testing-library/react';
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
});
