import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelpPage from '@/pages/help';
import { NextRouter } from 'next/router';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '@bluelightcard/shared-ui/adapters';
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

describe('HelpPage', () => {
  beforeEach(() => {
    const queryClient = new QueryClient();
    const mockPlatformAdapter = useMockPlatformAdapter();
    render(
      <QueryClientProvider client={queryClient}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <HelpPage />
        </PlatformAdapterProvider>
      </QueryClientProvider>,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders HelpPage correctly', () => {
    expect(screen.getByText('Help')).toBeInTheDocument();
    const backButton = screen.getByText('Back');
    expect(backButton).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Chat with our support team or submit a request')).toBeInTheDocument();
    expect(screen.getByText('Find quick answers to common issues')).toBeInTheDocument();
  });

  test('navigates to the correct URL when cards are clicked', () => {
    const links = [
      { cardText: 'FAQs', link: '/faq' },
      { cardText: 'Get in Touch', link: '/chat' },
    ];

    links.forEach(({ cardText, link }) => {
      const card = screen.getByText(cardText);
      fireEvent.click(card);
      expect(mockNavigate).toHaveBeenCalledWith(link);
    });
  });
});
