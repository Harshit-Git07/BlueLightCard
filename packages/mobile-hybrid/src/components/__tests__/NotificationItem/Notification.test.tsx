import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NotificationItem from '@/components/NotificationItem/NotificationItem';
import { faBell as faBellRegular } from '@fortawesome/pro-regular-svg-icons';
import { faBell as faBellSolid } from '@fortawesome/pro-solid-svg-icons';

describe('NotificationItem', () => {
  const mockProps = {
    title: 'Test Title',
    subtext: 'Test Subtext',
    onClick: jest.fn(),
  };

  it('renders the title and subtext', () => {
    render(<NotificationItem {...mockProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtext')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    render(<NotificationItem {...mockProps} />);

    fireEvent.click(screen.getByRole('button'));

    expect(mockProps.onClick).toHaveBeenCalled();
  });

  it('renders the correct icon based on isClicked state', () => {
    const { rerender } = render(<NotificationItem {...mockProps} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'data-icon',
      faBellRegular.iconName,
    );

    fireEvent.click(screen.getByRole('button'));

    rerender(<NotificationItem {...mockProps} />);
    expect(screen.getByRole('img', { hidden: true })).toHaveAttribute(
      'data-icon',
      faBellSolid.iconName,
    );
  });
});
