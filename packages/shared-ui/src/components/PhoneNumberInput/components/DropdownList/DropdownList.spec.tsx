import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownList, { Props } from '.';
import { defaultCountries, parseCountry } from 'react-international-phone';

const countryList = defaultCountries.slice(0, 5);
const mockItemOnClick = jest.fn();
const defaultProps: Props = {
  dropdownOpen: true,
  listOfCountries: countryList,
  selectedCountryCode: countryList[0][1],
  itemOnClick: mockItemOnClick,
};

describe('DropdownList component', () => {
  it('should render component without error', () => {
    const { baseElement } = render(<DropdownList {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches open/closed snapshots', () => {
    const { container: closedContainer } = render(
      <DropdownList {...defaultProps} dropdownOpen={false} />,
    );
    const { container: openContainer } = render(<DropdownList {...defaultProps} />);

    expect(closedContainer).toMatchSnapshot();
    expect(openContainer).toMatchSnapshot();
  });

  it('renders a search input and many options when passed in a populated country list', () => {
    render(<DropdownList {...defaultProps} />);

    const searchItem = screen.queryByLabelText('country-search');
    const listItems = screen.queryAllByRole('listitem');

    expect(searchItem).toBeTruthy();
    expect(listItems.length).toBe(countryList.length - 1);
  });

  it('renders a search input and no options when passed a list with only one country', () => {
    render(<DropdownList {...defaultProps} listOfCountries={[countryList[0]]} />);

    const searchItem = screen.queryByLabelText('country-search');
    const listItems = screen.queryAllByRole('listitem');

    expect(searchItem).toBeTruthy();
    expect(listItems.length).toBe(0);
  });
});

describe('DropdownList filtering', () => {
  it('filters out list items when content in input field', () => {
    render(<DropdownList {...defaultProps} listOfCountries={defaultCountries} />);

    const searchItem = screen.getByLabelText('country-search');
    const initialListItems = screen.queryAllByRole('listitem');
    const initialListLength = initialListItems.length;

    const firstCountry = parseCountry(countryList[0]);
    const firstCharOfCountry = firstCountry.name[0];
    fireEvent.change(searchItem, { target: { value: firstCharOfCountry } });

    const listItemsAfterFirstSearch = screen.queryAllByRole('listitem');
    const listLengthAfterFirstSearch = listItemsAfterFirstSearch.length;

    expect(listLengthAfterFirstSearch).toBeLessThan(initialListLength);
  });

  it('returns only one result when exact input match', () => {
    render(<DropdownList {...defaultProps} listOfCountries={defaultCountries} />);

    const searchItem = screen.getByLabelText('country-search');

    const firstCountry = parseCountry(countryList[0]);
    fireEvent.change(searchItem, { target: { value: firstCountry.name } });

    const listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(1);
  });

  it('can filter in lowercase', () => {
    render(<DropdownList {...defaultProps} listOfCountries={defaultCountries} />);

    const searchItem = screen.getByLabelText('country-search');

    const firstCountry = parseCountry(countryList[0]);
    fireEvent.change(searchItem, { target: { value: firstCountry.name.toLocaleLowerCase() } });

    const listItems = screen.queryAllByRole('listitem');

    expect(listItems).toHaveLength(1);
  });

  it('updates flag and dial code to match first search result', () => {
    render(<DropdownList {...defaultProps} listOfCountries={defaultCountries} />);

    const searchItem = screen.getByLabelText('country-search');

    const firstCountry = parseCountry(countryList[0]);
    fireEvent.change(searchItem, { target: { value: firstCountry.name[0] } });

    const filteredCountries = defaultCountries
      .map(parseCountry)
      .filter((c) => c.name.toLowerCase().startsWith(firstCountry.name[0].toLowerCase()));

    if (filteredCountries.length > 0) {
      const expectedCountry = filteredCountries[0];

      expect(screen.getByAltText(`Flag of ${expectedCountry.name}`)).toBeInTheDocument();
      expect(
        screen.getByLabelText(`${expectedCountry.iso2} ${expectedCountry.dialCode}`),
      ).toBeInTheDocument();
    } else {
      throw new Error('No countries found after filtering.');
    }
  });

  it('removing input field content returns list back to original', () => {
    render(<DropdownList {...defaultProps} listOfCountries={defaultCountries} />);

    const searchItem = screen.getByLabelText('country-search');

    const firstCountry = parseCountry(countryList[0]);
    const firstCharOfCountry = firstCountry.name[0];
    fireEvent.change(searchItem, { target: { value: firstCharOfCountry } });

    const listItemsAfterSearch = screen.queryAllByRole('listitem');
    const listLengthAfterSearch = listItemsAfterSearch.length;

    fireEvent.change(searchItem, { target: { value: '' } });

    const listItemsAfterSearchRemoved = screen.queryAllByRole('listitem');
    const listLengthAfterSearchRemoved = listItemsAfterSearchRemoved.length;

    expect(listLengthAfterSearchRemoved).toBeGreaterThan(listLengthAfterSearch);
  });
});
