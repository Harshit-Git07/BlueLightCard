import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PrivacySettingsPage from '@/pages/privacy-settings';
import { NextRouter } from 'next/router';
import InvokeNativeNavigation from '@/invoke/navigation';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
};

jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock('@/invoke/navigation', () => {
  const navigateMock = jest.fn();
  return jest.fn().mockImplementation(() => ({
    navigate: navigateMock,
  }));
});

const { navigate: mockNavigate } = new (jest.requireMock('@/invoke/navigation'))();

const invokeNavigation = new InvokeNativeNavigation();

describe('PrivacySettingsPage', () => {
  beforeEach(() => {
    const queryClient = new QueryClient();
    const mockPlatformAdapter = useMockPlatformAdapter();

    render(
      <QueryClientProvider client={queryClient}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <PrivacySettingsPage />
        </PlatformAdapterProvider>
      </QueryClientProvider>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all section headings, descriptions, and buttons correctly', () => {
    const headings = [
      'Permissions and mobile data',
      'Request your data access',
      'Terms and conditions',
      'Privacy notice',
      'Legal and regulatory',
      'Delete your account',
    ];

    const descriptions = [
      'Details on required permissions and your mobile data usage.',
      'Access all the data we hold on you anytime you wish.',
      'Understand the rules and conditions when using Blue Light Card app.',
      'Learn what information we collect and how we use it to protect your data.',
      'Discover how we offer savings to our community and build partnerships with brands.',
      'You can delete your account anytime. This will remove your personal data and end your access to the Blue Light Card community and its exclusive offers.',
    ];

    headings.forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });

    descriptions.forEach((description) => {
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    const buttonTexts = ['Manage permissions', 'Request your data', 'Delete account'];
    buttonTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    const readDetailsButtons = screen.getAllByText('Read details');
    expect(readDetailsButtons).toHaveLength(3);
  });

  test('navigates to the correct URL when links are clicked', () => {
    const links = [
      { buttonText: 'Read details', link: '/terms_and_conditions.php', index: 0 },
      { buttonText: 'Read details', link: '/privacy-notice.php', index: 1 },
      { buttonText: 'Read details', link: '/legal-and-regulatory.php', index: 2 },
    ];

    links.forEach(({ buttonText, link, index }) => {
      const button = screen.getAllByText(buttonText)[index];
      fireEvent.click(button);
      expect(mockNavigate).toHaveBeenCalledWith(link);
    });
  });

  test('triggers "Manage permissions" navigation correctly', () => {
    const managePermissionsButton = screen.getByText('Manage permissions');
    fireEvent.click(managePermissionsButton);
    expect(invokeNavigation.navigate).toHaveBeenCalledWith('/permissions.php');
  });

  test('triggers "Request your data" navigation correctly', () => {
    const requestDataButton = screen.getByText('Request your data');
    fireEvent.click(requestDataButton);
    expect(invokeNavigation.navigate).toHaveBeenCalledWith('/chat');
  });

  test('triggers "Delete account" navigation correctly', () => {
    const deleteAccountButton = screen.getByText('Delete account');
    fireEvent.click(deleteAccountButton);
    expect(invokeNavigation.navigate).toHaveBeenCalledWith('/chat');
  });
});
