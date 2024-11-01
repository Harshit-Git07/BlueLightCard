import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClickableFlag, { Props } from './ClickableFlag';
import { defaultCountries, parseCountry } from 'react-international-phone';

const ukCountry = defaultCountries.map(parseCountry).find((country) => country.iso2 === 'gb')!;

describe('ClickableFlag component', () => {
  const mockToggleDropdown = jest.fn();
  const defaultProps: Props = {
    country: ukCountry,
    isOpen: false,
    toggleDropdown: mockToggleDropdown,
    disabled: false,
    className: '',
    isSelectable: true,
    controlsId: 'countryDropdown',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    const { baseElement } = render(<ClickableFlag {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('matches open and closed snapshots', () => {
    const { container: closedContainer } = render(
      <ClickableFlag {...defaultProps} isOpen={false} />,
    );
    expect(closedContainer).toMatchSnapshot('ClickableFlag - closed state');

    const { container: openContainer } = render(<ClickableFlag {...defaultProps} isOpen={true} />);
    expect(openContainer).toMatchSnapshot('ClickableFlag - open state');
  });

  it('triggers callback when clicked and isSelectable is true', () => {
    render(<ClickableFlag {...defaultProps} isSelectable={true} />);
    screen.getByRole('button').click();
    expect(mockToggleDropdown).toHaveBeenCalled();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<ClickableFlag {...defaultProps} disabled={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('does not trigger callback when isSelectable is false', () => {
    render(<ClickableFlag {...defaultProps} isSelectable={false} />);
    screen.getByRole('button').click();
    expect(mockToggleDropdown).not.toHaveBeenCalled();
  });

  it('applies custom className correctly', () => {
    const customClassName = 'custom-class';
    render(<ClickableFlag {...defaultProps} className={customClassName} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClassName);
  });

  it('has correct accessibility attributes', () => {
    render(<ClickableFlag {...defaultProps} />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('aria-controls', 'countryDropdown');
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });
});
