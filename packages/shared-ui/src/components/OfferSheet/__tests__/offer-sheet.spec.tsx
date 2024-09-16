import { act, render, screen, waitFor } from '@testing-library/react';
import OfferSheet, { LoadingSkeleton } from '../offer-sheet';
import { PlatformAdapterProvider, V5Response } from '../../../adapters';
import { getMockPlatformAdapter } from '../__mocks__/platformAdapter';
import renderer from 'react-test-renderer';
import { RedemptionType } from '../../../utils/redemptionTypes';
import { AmplitudeVariant } from '../../../utils/amplitude/variants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SharedUIConfigProvider } from '../../../providers';
import { MockSharedUiConfig } from '../../../test';
import userEvent from '@testing-library/user-event';

describe('New Offer Sheet component', () => {
  it('Should display an error page when an error occurs', async () => {
    const props = {
      companyId: 12345678,
      offerId: 3456789,
      companyName: 'Timberland',
      amplitude: undefined,
      drawer: {
        close: () => {},
      },
    };

    const queryClient = new QueryClient();
    const mockAdapter = getMockPlatformAdapter('unknown', 'control');
    mockAdapter.invokeV5Api = jest.fn(() => Promise.resolve<V5Response>({ status: 404, data: '' }));

    const Component: React.FC = () => (
      <PlatformAdapterProvider adapter={mockAdapter}>
        <SharedUIConfigProvider value={MockSharedUiConfig}>
          <QueryClientProvider client={queryClient}>
            <OfferSheet {...props} />
          </QueryClientProvider>
        </SharedUIConfigProvider>
      </PlatformAdapterProvider>
    );

    render(<Component />);

    const button = await screen.findByTestId('_error_sheet_button');

    await act(async () => {
      const user = userEvent.setup();
      button && (await user.click(button));
    });

    expect(mockAdapter.navigate).toHaveBeenCalledWith('/offerdetails.php?cid=12345678');
  });

  test.each([
    [RedemptionType.VAULT, AmplitudeVariant.TREATMENT],
    [RedemptionType.PRE_APPLIED, AmplitudeVariant.TREATMENT],
    [RedemptionType.GENERIC, AmplitudeVariant.TREATMENT],
    [RedemptionType.VAULT_QR, AmplitudeVariant.TREATMENT],
    [RedemptionType.SHOW_CARD, AmplitudeVariant.TREATMENT],
    ['unknown', AmplitudeVariant.TREATMENT],
    // Only need vault and one non-vault flow since they are the only 2 cases handled differently
    [RedemptionType.VAULT, AmplitudeVariant.CONTROL],
    [RedemptionType.GENERIC, AmplitudeVariant.CONTROL],
  ])(
    'should render new offer sheet component for various redemption types',
    async (redemptionType, experimentBucket) => {
      const props = {
        companyId: 123,
        offerId: 123,
        companyName: 'Timberland',
        amplitude: undefined,
        drawer: {
          close: () => {},
        },
      };

      const queryClient = new QueryClient();
      const mockAdapter = getMockPlatformAdapter(redemptionType, experimentBucket);
      const Component: React.FC = () => (
        <PlatformAdapterProvider adapter={mockAdapter}>
          <SharedUIConfigProvider value={MockSharedUiConfig}>
            <QueryClientProvider client={queryClient}>
              <OfferSheet {...props} />
            </QueryClientProvider>
          </SharedUIConfigProvider>
        </PlatformAdapterProvider>
      );

      render(<Component />);

      const component = renderer.create(<Component />);
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();

      if (experimentBucket === AmplitudeVariant.TREATMENT && redemptionType !== 'unknown') {
        const button = await screen.findByTestId('_sheet_redeem_button');

        await act(async () => {
          const user = userEvent.setup();
          button && (await user.click(button));
        });

        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      }
    },
  );

  it('should render offer sheet LoadingSkeleton component without error', () => {
    render(<LoadingSkeleton />);
  });
});
