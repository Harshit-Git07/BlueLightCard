import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Badge, { Props } from '.';

describe('Badge component', () => {
  it('Should render Badge component without error', () => {
    const args: Props = {
      label: 'Online',
      color: 'bg-[#BCA5F7]',
      size: 'large',
    };

    render(<Badge {...args} />);
    expect(screen.getByText('Online')).toBeTruthy();
    expect(screen.getByText('Online')).toHaveStyle('background-color: #BCA5F7');
  });

  it('Should render Badge component with no color class if color has unexpected value', () => {
    const args: Props = {
      label: 'Online',
      color: 'bg-[#BCA5F7]',
      size: 'large',
    };
    render(<Badge {...args} />);
    expect(screen.getByText('Online')).toBeTruthy();
    expect(screen.getByText('Online')).not.toHaveClass('#BCA5F7');
  });

  it('Should render Badge component with small size', () => {
    const args: Props = {
      label: 'In-store',
      color: 'bg-[#BCA5F7]',
      size: 'small',
    };
    render(<Badge {...args} />);
    expect(screen.getByText('In-store')).toBeTruthy();
    expect(screen.getByText('In-store')).toHaveClass('text-xs');
  });

  it('Should render Badge component with large size', () => {
    const args: Props = {
      label: 'Gift card',
      color: 'bg-[#BCA5F7]',
      size: 'large',
    };
    render(<Badge {...args} />);
    expect(screen.getByText('Gift card')).toBeTruthy();
    expect(screen.getByText('Gift card')).toHaveClass('text-base');
  });

  it('Should render Badge with round corners', () => {
    const args: Props = {
      label: 'Gift card',
      color: 'bg-[#BCA5F7]',
      size: 'large',
    };
    render(<Badge {...args} />);
    const badge = screen.getByText('Gift card');
    expect(badge).toHaveClass('badge-rounded-corners');
  });
});
