import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacySettingsPage from '@/pages/privacy-settings';
import { NextRouter } from 'next/router';
import InvokeNativeNavigation from '@/invoke/navigation';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/invoke/navigation', () => {
  return jest.fn().mockImplementation(() => ({
    navigate: jest.fn(),
  }));
});

const invokeNavigation = new InvokeNativeNavigation();

describe('PrivacySettingsPage', () => {
  beforeEach(() => {
    render(<PrivacySettingsPage />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Back button with correct icon and text', () => {
    const backButton = screen.getByText('Back');
    const backIcon = screen.getByTestId('back-icon');

    expect(backButton).toBeInTheDocument();
    expect(backIcon).toBeInTheDocument();
  });

  test('renders section headings and descriptions correctly', () => {
    const headings = [
      'Permissions and mobile data',
      'Request your data access',
      'Terms and conditions',
      'Privacy notice',
      'Legal and regulatory',
      'Delete your account',
    ];

    headings.forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });

    expect(
      screen.getByText('Details on required permissions and your mobile data usage.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Access all the data we hold on you anytime you wish.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Understand the rules and conditions when using Blue Light Card app.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Learn what information we collect and how we use it to protect your data.'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Discover how we offer savings to our community and build partnerships with brands.',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'You can delete your account anytime. This will remove your personal data and end your access to the Blue Light Card community and its exclusive offers.',
      ),
    ).toBeInTheDocument();
  });

  test('renders all buttons with correct text', () => {
    const buttonTexts = ['Manage permissions', 'Request your data', 'Delete account'];

    buttonTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    const readDetailsButtons = screen.getAllByText('Read details');
    expect(readDetailsButtons).toHaveLength(3);
  });

  test('navigates to the correct URL when "Read details" button is clicked', () => {
    const readDetailsButton = screen.getAllByText('Read details')[0];

    fireEvent.click(readDetailsButton);

    invokeNavigation.navigate('/terms_and_conditions.php', true);
  });

  test('navigates to the correct URL when "Read details" button is clicked', () => {
    const readDetailsButton = screen.getAllByText('Read details')[1];

    fireEvent.click(readDetailsButton);

    invokeNavigation.navigate('/privacy-notice.php', true);
  });

  test('Back button triggers window.history.back on click', () => {
    const backButton = screen.getByText('Back');
    const mockGoBack = jest.spyOn(window.history, 'back').mockImplementation(() => {});

    fireEvent.click(backButton);
    expect(mockGoBack).toHaveBeenCalledTimes(1);

    mockGoBack.mockRestore();
  });
});
