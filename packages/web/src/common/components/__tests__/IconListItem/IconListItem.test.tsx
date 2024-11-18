import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import IconListItem from '@/components/IconListItem/IconListItem';
import { IconListItemProps } from '@/components/IconListItem/types';

const mockOnClickLink = jest.fn();

describe('IconListItem component', () => {
  it('should render IconListItem link with onClick function', () => {
    const props: IconListItemProps = {
      iconSrc: '/assets/box-open-light-slash.svg',
      title: 'Not valid on certain item(s)',
      link: 'View details',
      onClickLink: mockOnClickLink,
    };

    render(<IconListItem {...props} />);
    expect(screen.getByRole('img', { name: /not valid on certain item\(s\)/i })).toBeTruthy();
    expect(screen.getByText('Not valid on certain item(s)')).toBeTruthy();
    expect(screen.getByText('View details')).toBeTruthy();
    expect(screen.queryByRole('link', { name: /view details/i })).toBeNull();
    fireEvent.click(screen.getByText('View details'));
    expect(mockOnClickLink).toHaveBeenCalledTimes(1);
  });

  it('should render IconListItem link with href', () => {
    const props: IconListItemProps = {
      iconSrc: '/assets/box-open-light-slash.svg',
      title: 'Not valid on certain item(s)',
      link: 'View details',
      href: '/',
    };

    render(<IconListItem {...props} />);
    expect(screen.getByRole('img', { name: /not valid on certain item\(s\)/i })).toBeTruthy();
    expect(screen.getByText('Not valid on certain item(s)')).toBeTruthy();
    expect(screen.getByRole('link', { name: /view details/i })).toBeTruthy();
  });

  it('should render IconListItem with no link', () => {
    const props = {
      iconSrc: '/assets/box-open-light-slash.svg',
      title: 'Not valid on certain item(s)',
    };

    render(<IconListItem {...props} />);
    expect(screen.getByRole('img', { name: /not valid on certain item\(s\)/i })).toBeTruthy();
    expect(screen.getByText('Not valid on certain item(s)')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('should render IconListItem with no link', () => {
    const props: IconListItemProps = {
      emoji: '🚫',
      title: 'Not valid on certain item(s)',
    };

    render(<IconListItem {...props} />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText('Not valid on certain item(s)')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByText('🚫')).toBeTruthy();
  });
});
