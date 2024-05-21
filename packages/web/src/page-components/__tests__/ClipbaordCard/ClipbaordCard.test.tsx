import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { ClipboardCard } from '@/page-components/ClipbaordCard/ClipboardCard';
import '@testing-library/jest-dom/extend-expect';
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';
import { NextRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import { mocked } from 'jest-mock';
import { ReadonlyURLSearchParams } from 'next/dist/client/components/navigation';
import { redirectAndDecodeURL } from '@/utils/redirectAndDecode';
import { decodeBase64 } from '@/utils/base64';
const mockRouter: Partial<NextRouter> = {
  push: jest.fn(),
  replace: jest.fn(),
  pathname: '',
};

jest.mock('@/utils/base64');
jest.mock('@/utils/redirectAndDecode');
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('ClipboardCard', () => {
  const originalNavigator = { ...navigator };

  beforeAll(() => {
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  afterAll(() => {
    Object.assign(navigator, originalNavigator);
    jest.resetAllMocks();
  });

  it('should render without any issues.', async () => {
    const mockUseSearchParams = mocked(useSearchParams);
    mockUseSearchParams.mockImplementation(() => {
      const params = new URLSearchParams();
      params.set('code', '123');
      params.set('redirect', 'http://example.com');
      params.set('userId', '124');
      params.set('amplitudeData', 'ewogImNvbXBhbnlfaWQiOiAidGVzdCIgCn0');
      return new ReadonlyURLSearchParams(params);
    });

    const handleCopy = jest.fn();
    const error = false;
    const buttonText = 'Copy and continue to website';
    const copied = false;

    const mockDecodeBase64 = mocked(decodeBase64);
    mockDecodeBase64.mockReturnValue('{}');
    const page = render(
      <RouterContext.Provider value={mockRouter as NextRouter}>
        <ClipboardCard
          handleCopy={handleCopy}
          error={error}
          copied={copied}
          buttonText={buttonText}
        />
      </RouterContext.Provider>
    );
    expect(page).toMatchSnapshot();
  });

  describe('when the user clicks the copy button', () => {
    it('should fire an event to copy code to clipboard and redirect user', async () => {
      const mockUseSearchParams = mocked(useSearchParams);
      const mockedRedirect = mocked(redirectAndDecodeURL);
      const mockDecodeBase64 = mocked(decodeBase64);

      const handleCopy = jest
        .fn()
        .mockImplementation(() => mockedRedirect('blah', 100, mockRouter as NextRouter));
      const error = false;
      const buttonText = 'Copied';
      const copied = true;

      mockDecodeBase64.mockReturnValue('BLC10');
      mockDecodeBase64.mockReturnValue('{}');

      mockUseSearchParams.mockImplementation(() => {
        const params = new URLSearchParams();
        params.set('code', '123');
        params.set('redirect', 'http://example.com');
        params.set('userId', '124');
        params.set('amplitudeData', '{}');
        return new ReadonlyURLSearchParams(params);
      });
      const { getByText } = render(
        <RouterContext.Provider value={mockRouter as NextRouter}>
          <ClipboardCard
            handleCopy={handleCopy}
            error={error}
            copied={copied}
            buttonText={buttonText}
          />
        </RouterContext.Provider>
      );

      const button = getByText('Copied');
      await act(async () => {
        fireEvent.click(button);
      });
      expect(handleCopy).toBeCalled();
      expect(mockedRedirect).toBeCalled();
    });

    it('should not fire an event to copy code to clipboard and redirect user when search params are set.', async () => {
      const mockUseSearchParams = mocked(useSearchParams);
      mockUseSearchParams.mockImplementation(() => {
        const params = new URLSearchParams();
        params.set('code', '');
        params.set('redirect', '');
        return new ReadonlyURLSearchParams(params);
      });

      const handleCopy = jest.fn();

      const error = true;
      const buttonText = 'Copy and continue to website';
      const copied = false;

      const { getByText, queryByText } = render(
        <RouterContext.Provider value={mockRouter as NextRouter}>
          <ClipboardCard
            handleCopy={handleCopy}
            error={error}
            copied={copied}
            buttonText={buttonText}
          />
        </RouterContext.Provider>
      );

      const button = getByText('Copy and continue to website');
      await act(async () => {
        fireEvent.click(button);
      });
      const errorMessage = queryByText('failed to redirect or get code');
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
