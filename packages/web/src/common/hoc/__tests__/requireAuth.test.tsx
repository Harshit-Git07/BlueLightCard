import { render, screen, waitFor } from '@/root/test-utils';
import AuthProvider from '@/context/Auth/AuthProvider';
import AuthContext from '@/context/Auth/AuthContext';
import requireAuth from '@/hoc/requireAuth';
import { NextPage } from 'next';
import React, { FC, useContext, useEffect } from 'react';

const futureJWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDAwMDAwMDAwMDAwMDAwfQ.SM2xcm771CPS2CqOCUS91SF9ntftQl6cvoOCA11qSJA';

jest.mock('../../utils/amplitude/AmplitudeDeviceExperimentClient', () => ({
  __esModule: true,
  default: {
    Instance: () =>
      Promise.resolve({
        variant: () => ({
          value: 'treatment',
        }),
      }),
  },
}));

jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));

describe('withAuth HOC', () => {
  const originalEnv = process.env;
  const replaceMock = jest.fn();
  const originWindow = window;

  afterEach(() => {
    localStorage.clear();
    window = originWindow;
  });

  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_LOGIN_ROUTE: '/login',
      NEXT_PUBLIC_COGNITO_CLIENT_REGION: 'eu-west-2',
    };
  });

  afterAll(() => {
    process.env = originalEnv; // Restore old environment
  });

  it('should fail to authenticate due to no token, therefore failing to show the component', () => {
    const text = 'Hello World';
    const Comp: NextPage<any> = (props: any) => {
      return <h1>{text}</h1>;
    };

    const PageWithAuth = requireAuth(Comp);

    render(
      <AuthProvider>
        <PageWithAuth />
      </AuthProvider>
    );

    const displayText = screen.queryByText(text);
    expect(displayText).toBeNull();
  });

  it('should continue with expired token as refresh token authed, therefore not failing to show the component', () => {
    const text = 'Hello World';
    const Comp: NextPage<any> = (props: any) => {
      return <h1>{text}</h1>;
    };

    const PageWithAuth = requireAuth(Comp);
    const pastJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjF9.5o2DmuhVcwInco2_YNzqMKLk-NGH44HoSQqX0CSzoaA';

    localStorage.setItem('accessToken', pastJWT);
    localStorage.setItem('idToken', pastJWT);

    render(
      <AuthProvider isUserAuthenticated={() => true}>
        <PageWithAuth />
      </AuthProvider>
    );

    expect(screen.queryByText(text)).toBeTruthy();
  });

  // Success Cases
  it('should authenticate due to valid and in date JWT, therefore showing the component', () => {
    const text = 'Hello World';
    const Comp: NextPage<any> = (props: any) => {
      return <h1>{text}</h1>;
    };

    const PageWithAuth = requireAuth(Comp);
    localStorage.setItem('accessToken', futureJWT);
    localStorage.setItem('idToken', futureJWT);

    render(
      <AuthProvider>
        <PageWithAuth />
      </AuthProvider>
    );

    screen.getByText(text);
  });

  it('Should update the localstorage accessToken and idToken values', () => {
    const TestComp: FC = (props: any) => {
      const ctx = useContext(AuthContext);

      useEffect(() => {
        ctx.updateAuthTokens({
          accessToken: 'test',
          idToken: 'test',
          refreshToken: 'test',
          username: 'test',
        });
        // Linting disabled because it causes an infinite loop
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return <div>Test</div>;
    };

    render(
      <AuthProvider>
        <TestComp />
      </AuthProvider>
    );

    const accessToken = localStorage.getItem('accessToken');
    const idToken = localStorage.getItem('idToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const username = localStorage.getItem('username');

    expect(accessToken).toBe('test');
    expect(idToken).toBe('test');
    expect(refreshToken).toBe('test');
    expect(username).toBe('test');
  });

  it('should attempt to redirect using window.location.replace due to domain name', async () => {
    // Mock window location
    Object.defineProperty(window, 'location', {
      value: {
        replace: replaceMock,
      },
    });

    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
    };

    // Page comp to be located behind auth
    const text = 'Hello World';
    const Comp: NextPage<any> = (props: any) => {
      return <h1>{text}</h1>;
    };

    const PageWithAuth = requireAuth(Comp);
    localStorage.setItem('accessToken', futureJWT);
    localStorage.setItem('idToken', futureJWT);

    // Mock window.location
    render(
      <AuthProvider isReady isUserAuthenticated={() => false}>
        <PageWithAuth />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalled();
    });
  });
});
