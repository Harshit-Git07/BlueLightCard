import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileNavToggleButton from '../../../components/atoms/MobileNavToggleButton';

describe('MobileNavToggleButton', () => {
  it('renders', () => {
    const { container } = render(<MobileNavToggleButton isMenuOpen onIconClick={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });
  it('should render the xicon when the menu is open', () => {
    const { container } = render(<MobileNavToggleButton isMenuOpen onIconClick={jest.fn()} />);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('data-icon')).toStrictEqual('xmark');
  });
  it('should render the hamburger menu when the menu isnt open', () => {
    const { container } = render(<MobileNavToggleButton onIconClick={jest.fn()} />);
    const icon = container.querySelector('svg');
    expect(icon?.getAttribute('data-icon')).toStrictEqual('bars');
  });
  it('should call the onClick function when clicked', async () => {
    const mockOnClick = jest.fn();
    const { container } = render(<MobileNavToggleButton onIconClick={mockOnClick} />);
    const button = container.querySelector('button');
    await userEvent.click(button as HTMLButtonElement);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
