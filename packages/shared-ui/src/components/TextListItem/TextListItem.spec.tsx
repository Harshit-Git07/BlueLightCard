import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextListItem from './index';

describe('TextListItem Component', () => {
  it('Should render the component without error', () => {
    render(<TextListItem text="Item 2" variant="default" />);
  });

  it('renders the icon if provided', () => {
    const icon = <span data-testid="icon">Icon</span>;
    render(<TextListItem text="Item 1" icon={icon} variant="default" />);

    const iconElement = screen.getByTestId('icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('fires onClick event if onClick exists', () => {
    const handleClick = jest.fn();
    render(<TextListItem text="Item 2" icon={null} variant="clickable" onClick={handleClick} />);

    const listItem = screen.getByText('Item 2');
    fireEvent.click(listItem);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
