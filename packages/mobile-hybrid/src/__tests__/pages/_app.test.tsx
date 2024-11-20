import '@testing-library/jest-dom/extend-expect';
import { Router } from 'next/router';
import { render, screen } from '@testing-library/react';
import AppTemplate from '../../pages/_app';
import * as globals from '@/globals';

const mockGlobals = globals as {
  IS_SSR: boolean;
  USE_NATIVE_MOCK: boolean;
  USE_DEV_TOOLS: boolean;
};
jest.mock('@/globals', () => ({
  ...jest.requireActual('@/globals'),
  __esModule: true,
  IS_SSR: false,
  USE_NATIVE_MOCK: true,
  USE_DEV_TOOLS: false,
}));

const mockRouter: Router = {
  route: '/',
  pathname: '',
  query: {},
  asPath: '',
  push: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  beforePopState: jest.fn(() => null),
  prefetch: jest.fn(async () => {}),
} as unknown as Router;
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

describe('App template', () => {
  beforeEach(() => {
    mockGlobals.IS_SSR = false;
    mockGlobals.USE_NATIVE_MOCK = true;
  });

  it('renders the given component', () => {
    render(
      <AppTemplate Component={() => <p>Hello World!</p>} pageProps={{}} router={mockRouter} />,
    );

    const element = screen.getByText('Hello World!');

    expect(element).toBeInTheDocument();
  });

  describe('dev tools drawer', () => {
    it('does not render when disabled', () => {
      mockGlobals.USE_DEV_TOOLS = false;
      render(
        <AppTemplate Component={() => <p>Hello World!</p>} pageProps={{}} router={mockRouter} />,
      );

      const devToolsButton = screen.queryByText('Open Dev Tools');

      expect(devToolsButton).not.toBeInTheDocument();
    });

    it('renders when enabled', () => {
      mockGlobals.USE_DEV_TOOLS = true;
      render(
        <AppTemplate Component={() => <p>Hello World!</p>} pageProps={{}} router={mockRouter} />,
      );

      const devToolsButton = screen.getByText('Open Dev Tools');

      expect(devToolsButton).toBeInTheDocument();
    });
  });
});
