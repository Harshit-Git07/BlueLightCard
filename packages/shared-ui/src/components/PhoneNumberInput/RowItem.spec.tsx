import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RowItem, { Props } from './RowItem';
import { defaultCountries, parseCountry } from 'react-international-phone';

jest.mock('react-international-phone', () => ({
  ...jest.requireActual('react-international-phone'),
  FlagImage: () => <div data-testid="flag-image"></div>,
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

  it('applies correct styles', () => {
    render(<RowItem {...defaultProps} />);
    const rowItem = screen.getByRole('button');
    expect(rowItem).toHaveClass(
      'flex w-full bg-colour-surface dark:bg-colour-surface-dark hover:bg-colour-surface-container hover:dark:bg-colour-surface-container-dark',
    );

    const innerSpan = rowItem.querySelector('span');
    expect(innerSpan).toHaveClass(
      ' py-2 pl-5 pr-3 flex w-full gap-2 items-center cursor-pointer font-typography-body text-typography-body font-typography-body-weight group',
    );

    const countryName = screen.getByText(defaultProps.name);
    expect(countryName).toHaveClass(
      'text-colour-onSurface dark:text-colour-onSurface-dark group-hover:text-colour-primary-hover group-hover:dark:text-colour-primary-hover-dark',
    );

    const dialCodeText = screen.getByText(`+${defaultProps.dialCode}`);
    expect(dialCodeText).toHaveClass('text-colour-primary dark:text-colour-primary-dark');
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
