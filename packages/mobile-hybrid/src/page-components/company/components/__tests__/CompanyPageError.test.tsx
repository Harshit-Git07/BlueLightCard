import { fireEvent, render, screen } from '@testing-library/react';
import CompanyPageError from '../CompanyPageError';
import InvokeNativeLifecycle from '@/invoke/lifecycle';

// Mock the necessary components and functions
jest.mock('../../../../invoke/lifecycle.ts');

describe('Company Page Error Component', () => {
  beforeEach(() => {
    jest.spyOn(InvokeNativeLifecycle.prototype, 'lifecycleEvent');
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { container, getByRole } = render(<CompanyPageError message="Failed to load" />);
    expect(container).toMatchSnapshot();
    expect(getByRole('heading', { name: /failed to load/i })).toBeTruthy();
    expect(getByRole('button', { name: /return home/i })).toBeTruthy();
  });

  it('handles the click event on the button', () => {
    render(<CompanyPageError message="Failed to load" />);

    const button = screen.getByRole('button', { name: /return home/i });
    fireEvent.click(button);

    expect(InvokeNativeLifecycle.prototype.lifecycleEvent).toHaveBeenCalledWith('onBackPressed');
  });
});
