import { render, screen } from '@testing-library/react';
import PasswordRequirements, { Props } from './';
import '@testing-library/jest-dom';

// Mocking FontAwesome icons
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: ({ icon, className }: { icon: any; className?: string }) => (
    <span data-testid="font-awesome-icon" data-icon={icon.iconName} className={className}>
      FontAwesomeIcon
    </span>
  ),
}));

describe('PasswordRequirements', () => {
  const defaultProps: Props = {
    validatedRequirements: {
      'At least 8 characters': true,
      'At least 1 special character': false,
    },
    isPasswordValid: undefined,
  };

  it('renders the requirements section with the correct title', () => {
    render(<PasswordRequirements {...defaultProps} />);

    const sectionTitle = screen.getByText('Your password must contain:');
    expect(sectionTitle).toBeInTheDocument();
  });

  it('renders each password requirement', () => {
    render(<PasswordRequirements {...defaultProps} />);

    const firstRequirement = screen.getByText('At least 8 characters');
    const secondRequirement = screen.getByText('At least 1 special character');

    expect(firstRequirement).toBeInTheDocument();
    expect(secondRequirement).toBeInTheDocument();
  });

  it('does not render icons when isPasswordValid is undefined', () => {
    render(<PasswordRequirements {...defaultProps} />);

    const icons = screen.queryByTestId('font-awesome-icon');
    expect(icons).toBeNull();
  });

  it('renders a check icon when the requirement is satisfied and isPasswordValid is not undefined', () => {
    render(<PasswordRequirements {...defaultProps} isPasswordValid={true} />);

    const checkIcon = screen.getAllByTestId('font-awesome-icon')[0];
    expect(checkIcon).toBeInTheDocument();
    expect(checkIcon).toHaveAttribute('data-icon', 'check');
  });

  it('renders an xmark icon when the requirement is not satisfied and isPasswordValid is not undefined', () => {
    render(<PasswordRequirements {...defaultProps} isPasswordValid={false} />);

    const xmarkIcon = screen.getAllByTestId('font-awesome-icon')[1];
    expect(xmarkIcon).toBeInTheDocument();
    expect(xmarkIcon).toHaveAttribute('data-icon', 'xmark');
  });

  it('renders the correct styles for satisfied requirements', () => {
    render(<PasswordRequirements {...defaultProps} isPasswordValid={true} />);

    const listItems = screen.getAllByRole('listitem');
    const paragraph = listItems[0].querySelector('p');
    const icon = listItems[0].querySelector('[data-testid="font-awesome-icon"]');
    expect(paragraph).toHaveClass('text-colour-success');
    expect(icon).toHaveAttribute('data-icon', 'check');
  });

  it('renders the correct styles for unsatisfied requirements', () => {
    render(<PasswordRequirements {...defaultProps} isPasswordValid={false} />);

    const listItems = screen.getAllByRole('listitem');
    const paragraph = listItems[1].querySelector('p');
    const icon = listItems[1].querySelector('[data-testid="font-awesome-icon"]');
    expect(paragraph).toHaveClass('text-colour-error');
    expect(icon).toHaveAttribute('data-icon', 'xmark');
  });

  it('renders the correct margin when isPasswordValid is undefined', () => {
    render(<PasswordRequirements {...defaultProps} isPasswordValid={undefined} />);

    const listItems = screen.getAllByRole('listitem');
    const paragraph = listItems[0].querySelector('p');
    expect(paragraph).toHaveClass('ml-[-4px]');
  });
});
