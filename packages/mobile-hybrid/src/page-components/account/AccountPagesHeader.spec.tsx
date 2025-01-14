import InvokeNativeLifecycle from '@/invoke/lifecycle';
import AccountPagesHeader from './AccountPagesHeader';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

describe('Company Page Error Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText, getByRole } = render(<AccountPagesHeader title="Account Tests" />);
    expect(getByText('Account Tests')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('should not render button if hasBackButton is false', () => {
    const { getByText, queryByRole } = render(
      <AccountPagesHeader title={'Account Tests'} hasBackButton={false} />,
    );
    expect(getByText('Account Tests')).toBeInTheDocument();
    expect(queryByRole('button', { name: 'Back' })).not.toBeInTheDocument();
  });

  it('should not render button if hasBackButton is false', async () => {
    const onNavSpy = jest.spyOn(InvokeNativeLifecycle.prototype, 'lifecycleEvent');
    const { getByRole } = render(<AccountPagesHeader title={'Account Tests'} />);

    const btn = getByRole('button', { name: 'Back' });
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(onNavSpy).toHaveBeenCalled();
  });
});
