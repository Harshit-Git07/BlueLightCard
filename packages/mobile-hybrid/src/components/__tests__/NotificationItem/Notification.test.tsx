import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotificationItem from '@/components/NotificationItem/NotificationItem';
import { faBell as faBellRegular } from '@fortawesome/pro-regular-svg-icons';
import { faBell as faBellSolid } from '@fortawesome/pro-solid-svg-icons';

describe('NotificationItem', () => {
  const mockProps = {
    id: 'test-notification-one',
    title: 'Test Title',
    subtext: 'Test Subtext',
    isClicked: false,
    onClick: jest.fn(),
  };

  it('renders the title and subtext', () => {
    render(<NotificationItem {...mockProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtext')).toBeInTheDocument();
  });

  it('calls onClick with the given ID when clicked', async () => {
    render(<NotificationItem {...mockProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockProps.onClick).toHaveBeenCalledWith('test-notification-one');
  });

  it('renders the correct icon when notification is clicked', () => {
    render(<NotificationItem {...mockProps} isClicked={true} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'data-icon',
      faBellRegular.iconName,
    );
  });

  it('renders the correct icon when notification is not clicked', () => {
    render(<NotificationItem {...mockProps} isClicked={false} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'data-icon',
      faBellSolid.iconName,
    );
  });
});
