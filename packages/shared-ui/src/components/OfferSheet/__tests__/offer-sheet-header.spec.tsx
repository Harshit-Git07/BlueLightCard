import { render } from '@testing-library/react';
import OfferSheetHeader from '../offer-sheet-header';
import { PlatformAdapterProvider } from '../../../adapters';
import { getMockPlatformAdapter } from '../__mocks__/platformAdapter';
import renderer from 'react-test-renderer';
import { SharedUIConfigProvider } from '@bluelightcard/shared-ui';
import { MockSharedUiConfig } from 'src/test';
import { RedemptionType } from '../../../utils/redemptionTypes';
import { LoadingSkeleton } from '../offer-sheet';

describe('New Offer Sheet component', () => {
  it('should render offer sheet header component without error', () => {
    const offerData = {
      id: 1,
      companyId: 20541,
      companyLogo: 'Logo',
      description: 'Description',
      expiry: '2025441820000',
      name: 'Name',
      terms: '',
      type: RedemptionType.VAULT,
    };

    const props = {
      offerData: offerData,
      companyName: 'test',
    };

    const Component: React.FC = () => (
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={getMockPlatformAdapter(RedemptionType.VAULT)}>
          <OfferSheetHeader {...props}></OfferSheetHeader>
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    );

    render(<Component />);
  });

  test.each([
    [RedemptionType.VAULT],
    [RedemptionType.PRE_APPLIED],
    [RedemptionType.GENERIC],
    [RedemptionType.VAULT_QR],
    [RedemptionType.SHOW_CARD],
    ['unknown'],
  ])('should render offer sheet header component without error', (redemptionType) => {
    const offerData = {
      id: 1,
      companyId: 20541,
      companyLogo: 'Logo',
      description: 'Description',
      expiry: '2025441820000',
      name: 'Name',
      terms: '',
      type: redemptionType,
    };

    const props = {
      offerData: offerData,
      companyName: 'test',
    };

    const Component: React.FC = () => (
      <SharedUIConfigProvider value={MockSharedUiConfig}>
        <PlatformAdapterProvider adapter={getMockPlatformAdapter(redemptionType)}>
          <OfferSheetHeader {...props}></OfferSheetHeader>
        </PlatformAdapterProvider>
      </SharedUIConfigProvider>
    );

    render(<Component />);

    const component = renderer.create(<Component />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render offer sheet LoadingSkeleton component without error', () => {
    render(<LoadingSkeleton />);
  });
});
