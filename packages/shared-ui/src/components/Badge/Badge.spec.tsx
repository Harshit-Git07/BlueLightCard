import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge, { Props } from '.';

describe('Badge component', () => {
  it('Should render Badge component without error', () => {
    const args: Props = {
      label: 'Online',
      color: 'bg-badge-online-bg-colour-light',
      size: 'large',
    };

    render(<Badge {...args} />);
    expect(screen.getByText('Online')).toBeTruthy();
  });

  it('Should render Badge component with no color class if color has unexpected value', () => {
    const args: Props = {
      label: 'In-store',
      color: 'bg-badge-instore-bg-colour-light',
      size: 'large',
    };
    render(<Badge {...args} />);
    expect(screen.getByText('In-store')).toBeTruthy();
  });

  it('Should render Badge with round corners', () => {
    const args: Props = {
      label: 'Gift card',
      color: 'bg-badge-giftcard-bg-colour-light',
      size: 'large',
    };
    render(<Badge {...args} />);
    const badge = screen.getByText('Gift card');
    expect(badge).toHaveClass('rounded-tl-lg');
    expect(badge).toHaveClass('rounded-br-lg');
  });
});
