import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthContext, { AuthContextType, AuthState } from '@/context/Auth/AuthContext';
import { useRouter } from 'next/router';
import { useAmplitudeExperiment } from '@/context/AmplitudeExperiment';
import '@testing-library/jest-dom';
import MockLogin from '@/pages/mock-login';
import { Auth0Service } from '@/root/src/common/services/auth0Service';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/root/src/common/services/auth0Service');
jest.mock('@/context/AmplitudeExperiment');
jest.mock('axios');
jest.mock('@/utils/secret_hash');
jest.mock('@/global-vars', () => ({
  AUTH0_LOGIN_URL: '/auth0/login',
  AMPLITUDE_DEPLOYMENT_KEY: 'AMPLITUDE_DEPLOYMENT_KEY',
  COGNITO_CLIENT_ID: 'COGNITO_CLIENT_ID',
  COGNITO_CLIENT_REGION: 'COGNITO_CLIENT_REGION',
}));

describe('MockLogin Component', () => {
  const mockRouterPush = jest.fn();
  const mockUpdateAuthTokens: (tokens: AuthState) => void = jest.fn();
  const mockAuthContext = { updateAuthTokens: mockUpdateAuthTokens };
  const mockAmplitudeExperiment = { data: { variantName: 'on' } };
  const code = 'test-auth-code';

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      query: { code },
      push: mockRouterPush,
    });
    (useAmplitudeExperiment as jest.Mock).mockReturnValue(mockAmplitudeExperiment);
  });

  function renderComponent() {
    return render(
      <AuthContext.Provider value={mockAuthContext as AuthContextType}>
        <MockLogin requireAuth={false} />
      </AuthContext.Provider>
    );
  }

  it('should render auth0 redirect button and cognito login form elements', () => {
    renderComponent();

    expect(screen.getByText('Login with Auth0')).toBeInTheDocument();
    expect(screen.getByText('Login with Cognito')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should redirect to Auth0 login when "Login with Auth0" button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Login with Auth0'));

    expect(mockRouterPush).toHaveBeenCalledWith('/auth0/login');
  });

  it('should call getTokensUsingCode with query param code and redirects on success', async () => {
    (Auth0Service.getTokensUsingCode as jest.Mock).mockResolvedValueOnce(true);

    renderComponent();

    await waitFor(() => {
      expect(Auth0Service.getTokensUsingCode).toHaveBeenCalledWith(code, mockUpdateAuthTokens);
      expect(mockRouterPush).toHaveBeenCalledWith('/members-home');
    });
  });

  it('should not redirect if getTokensUsingCode fails', async () => {
    (Auth0Service.getTokensUsingCode as jest.Mock).mockResolvedValueOnce(false);

    renderComponent();

    await waitFor(() => {
      expect(Auth0Service.getTokensUsingCode).toHaveBeenCalledWith(code, mockUpdateAuthTokens);
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });
});
