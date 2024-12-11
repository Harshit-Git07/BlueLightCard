import { NextRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import {
  PlatformAdapterProvider,
  useMockPlatformAdapter,
} from '../../../../shared-ui/src/adapters';
import ValidateEmailPage from '@/pages/validate-email';
import { ValidateEmailRequest } from '../../common/hooks/useValidateEmailPost';

const mockRouter: Partial<NextRouter> = {};

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const typeParam = 'test-type';
const tokenParam = 'test-token';

describe('ValidateEmail Page', () => {
  beforeEach(() => {
    const mockUseSearchParams = mocked(useSearchParams);

    mockUseSearchParams.mockImplementation(() => {
      const params = new URLSearchParams();
      params.set('type', typeParam);
      params.set('token', tokenParam);

      return new ReadonlyURLSearchParams(params);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const mockPlatformAdapter = useMockPlatformAdapter();

  const whenPageIsRendered = (platformAdapter = mockPlatformAdapter) => {
    return render(
      <QueryClientProvider client={new QueryClient()}>
        <PlatformAdapterProvider adapter={platformAdapter}>
          <RouterContext.Provider value={mockRouter as NextRouter}>
            <ValidateEmailPage />
          </RouterContext.Provider>
        </PlatformAdapterProvider>
      </QueryClientProvider>
    );
  };

  it('should validate email successfully', async () => {
    const mockValidateEmailData = {
      messages: [
        {
          code: 'test-code',
          detail: 'test details',
        },
      ],
      requestId: 'test-request-id',
    };

    mockPlatformAdapter.invokeV5Api.mockImplementation(() => {
      return Promise.resolve({
        status: 200,
        data: JSON.stringify({
          data: mockValidateEmailData,
        }),
      });
    });

    const request: ValidateEmailRequest = {
      emailType: typeParam,
      emailPayload: tokenParam,
    };

    whenPageIsRendered();

    await waitFor(() => {
      expect(mockPlatformAdapter.invokeV5Api).toHaveBeenCalledWith('/members/emailhandler', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      screen.getByText('Your email has been verified');
      screen.getByText(
        'Use your new email to log in and continue enjoying thousands of discounts.'
      );
    });
  });

  it('should fail to validate the email', async () => {
    mockPlatformAdapter.invokeV5Api.mockImplementation(() => {
      return Promise.resolve({
        status: 400,
      });
    });

    whenPageIsRendered();

    await waitFor(() => {
      screen.getByText('Your email couldn’t be verified');
      screen.getByText(
        'Go back to the verification email in your inbox and click ‘Activate My Account’ to try again.'
      );
    });
  });
});
