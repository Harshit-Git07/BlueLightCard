import { render } from '@testing-library/react';
import SearchButton from '../../../../Navigation/NavBarV2/components/atoms/SearchButton';
import userEvent from '@testing-library/user-event';

describe('SearchButton', () => {
  it('renders', () => {
    const { container } = render(<SearchButton onIconClick={jest.fn()} />);
    expect(container).toMatchSnapshot();
  });

  it('should call the onClick function when the icon is clicked', async () => {
    const mockOnClick = jest.fn();
    const { container } = render(<SearchButton onIconClick={mockOnClick} />);
    const button = container.querySelector('button');
    await userEvent.click(button as HTMLButtonElement);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
