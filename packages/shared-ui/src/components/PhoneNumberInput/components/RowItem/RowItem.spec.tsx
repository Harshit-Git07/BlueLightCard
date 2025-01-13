import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RowItem, { Props } from '.';
import { defaultCountries, parseCountry } from 'react-international-phone';

jest.mock('react-international-phone', () => ({
  ...jest.requireActual('react-international-phone'),
  FlagImage: () => <div data-testid="flag-image" />,
}));

const ukCountry = defaultCountries.map(parseCountry).find((country) => country.iso2 === 'gb')!;

describe('RowItem component', () => {
  const defaultProps: Props = {
    iso2: ukCountry.iso2,
    name: ukCountry.name,
    dialCode: ukCountry.dialCode,
  };

  it('should render component without error', () => {
    const { baseElement } = render(<RowItem {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches snapshots', () => {
    const { container } = render(<RowItem {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('has correct accessibility attributes', () => {
    render(<RowItem {...defaultProps} />);
    const rowItem = screen.getByRole('button');
    expect(rowItem).toHaveAttribute('aria-label', `${defaultProps.iso2} ${defaultProps.dialCode}`);
  });

  it('handles missing onClick gracefully', () => {
    render(<RowItem {...defaultProps} />);
    const rowItem = screen.getByRole('button');
    expect(() => rowItem.click()).not.toThrow();
  });

  it('triggers callback when clicked', () => {
    const rowOnClick = jest.fn();
    render(<RowItem {...defaultProps} onClick={rowOnClick} />);
    const rowItem = screen.getByRole('button');
    fireEvent.click(rowItem);
    expect(rowOnClick).toHaveBeenCalledTimes(1);
  });

  it('triggers callback when Enter or Space key is pressed', () => {
    const rowOnClick = jest.fn();
    render(<RowItem {...defaultProps} onClick={rowOnClick} />);
    const rowItem = screen.getByRole('button');

    fireEvent.keyDown(rowItem, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(rowOnClick).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(rowItem, { key: ' ', code: 'Space', charCode: 32 });
    expect(rowOnClick).toHaveBeenCalledTimes(2);
  });

  it('renders the FlagImage correctly', () => {
    render(<RowItem {...defaultProps} />);
    const flagImage = screen.getByTestId('flag-image');
    expect(flagImage).toBeInTheDocument();
  });
});
