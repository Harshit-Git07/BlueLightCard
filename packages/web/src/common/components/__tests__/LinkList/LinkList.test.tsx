import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { LinkItem } from '../../LinkList/types';
import LinkList from '../../LinkList/LinkList';

describe('LinkList', () => {
  const mockItems: LinkItem[] = [
    { id: 'buttonOne', label: 'One', onClick: jest.fn() },
    { id: 'buttonTwo', label: 'Two', onClick: jest.fn() },
  ];
  it('renders', () => {
    const { container } = render(<LinkList items={mockItems} />);
    expect(container).toMatchSnapshot();
  });
  it('should call the onClick if defined when the button is clicked', async () => {
    const mockOnClick = jest.fn();
    const mockItems: LinkItem[] = [
      { id: 'buttonOne', label: 'One', onClick: mockOnClick },
      { id: 'buttonTwo', label: 'Two', onClick: jest.fn() },
    ];
    render(<LinkList items={mockItems} />);
    const button = await screen.getByText(mockItems[0].label);
    await userEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
