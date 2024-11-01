import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchRowItem, { Props } from './SearchRowItem';

describe('SearchRowItem component', () => {
  const defaultProps: Props = {
    iso2: 'gb',
    placeholderName: 'United Kingdom',
    dialCode: '44',
    searchText: '',
    onChange: jest.fn(),
  };

  it('renders without crashing', () => {
    const { baseElement } = render(<SearchRowItem {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('displays the correct placeholder name', () => {
    render(<SearchRowItem {...defaultProps} />);
    const input = screen.getByPlaceholderText('United Kingdom');
    expect(input).toBeInTheDocument();
  });

  it('displays the correct dial code', () => {
    render(<SearchRowItem {...defaultProps} />);
    expect(screen.getByText('+44')).toBeInTheDocument();
  });

  it('renders the flag image with correct iso2', () => {
    render(<SearchRowItem {...defaultProps} />);
    const flagImage = screen.getByRole('img', { hidden: true });
    expect(flagImage).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    render(<SearchRowItem {...defaultProps} />);
    const input = screen.getByLabelText('country-search');
    fireEvent.change(input, { target: { value: 'UK' } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  it('displays the current search text', () => {
    const updatedProps = { ...defaultProps, searchText: 'UK' };
    render(<SearchRowItem {...updatedProps} />);
    expect(screen.getByDisplayValue('UK')).toBeInTheDocument();
  });
});
