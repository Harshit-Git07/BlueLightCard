/* eslint-disable @typescript-eslint/no-explicit-any */
import OfferSheet, { Props } from '.';
import { render } from '@testing-library/react';
import { PlatformAdapterProvider, useMockPlatformAdapter } from '../../adapters';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SharedUIConfigProvider } from 'src/providers';
import { MockSharedUiConfig } from 'src/test';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';

const mockPlatformAdapter = useMockPlatformAdapter(200, { data: { redemptionType: 'vault' } });
const mockQueryClient = new QueryClient();

const props: Props = {
  height: '90%',
};

const mockedUseQuery = jest.mocked(useQuery);
jest.mock('@tanstack/react-query', () => {
  const actualReactQuery = jest.requireActual('@tanstack/react-query');
  return {
    ...actualReactQuery,
    useQuery: jest.fn(),
  };
});

function renderComponent() {
  return render(
    <QueryClientProvider client={mockQueryClient}>
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={mockPlatformAdapter}>
          <OfferSheet {...props} />
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    </QueryClientProvider>,
  );
}

describe('smoke test', () => {
  beforeEach(() => {
    mockedUseQuery.mockImplementation(({ queryKey }) => {
      if (queryKey[0] === 'offer') {
        return {
          data: {
            id: '1',
            companyId: '1',
            description: convertStringToRichtextModule('text'),
            expires: 'text',
            name: 'text',
            termsAndConditions: convertStringToRichtextModule('text'),
            type: 'text',
            image: 'text',
          },
          status: 'success',
        } as ReturnType<typeof useQuery>;
      } else if (queryKey[0] === 'user') {
        return {
          data: {
            canRedeemOffer: true,
          },
        } as ReturnType<typeof useQuery>;
      }
      return { data: null, status: 'idle' } as unknown as ReturnType<typeof useQuery>;
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should render component without error', () => {
    renderComponent();
  });

  it('should render close button', () => {
    const { container } = renderComponent();

    const closeButton = container.querySelector(
      'div > div > div > div:nth-child(2) > div:nth-child(1)',
    );

    expect(closeButton).toBeTruthy();
  });

  it('should render offer details', () => {
    const { getAllByRole } = renderComponent();

    expect(getAllByRole('button', { name: /get discount/i })).toBeTruthy();
  });
});
