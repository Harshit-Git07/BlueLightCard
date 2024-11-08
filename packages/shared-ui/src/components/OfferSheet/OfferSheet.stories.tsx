import { Meta, StoryFn } from '@storybook/react';
import OfferSheet from '.';
import { PlatformVariant } from '../../types';
import { useSetAtom } from 'jotai';
import { offerSheetAtom } from './store';
import { useEffect } from 'react';
import { IPlatformAdapter, PlatformAdapterProvider } from '../../adapters';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import OfferSheetDetailsPage from './components/OfferSheetDetailsPage';
import { SharedUIConfigProvider } from 'src/providers';
import OfferDetailsErrorPage from './components/OfferDetailsErrorPage';
import LoadingSpinner from '../LoadingSpinner';
import { convertStringToRichtextModule } from 'src/utils/rich-text-utils';

const componentMeta: Meta<typeof OfferSheet> = {
  title: 'Component System/Offer Sheet',
  component: OfferSheet,
};

const mockQueryClient = new QueryClient();
const mockPlatformAdapter = {
  getAmplitudeFeatureFlag: () => 'control',
  invokeV5Api: () =>
    Promise.resolve({ status: 200, data: "{ data: { redemptionType: 'vault' } }" }),
  logAnalyticsEvent: () => {},
  navigate: () => {},
  navigateExternal: () => ({
    isOpen: () => true,
  }),
  writeTextToClipboard: () => Promise.resolve(),
  getBrandURL: () => 'https://bluelightcard.co.uk',
  platform: PlatformVariant.MobileHybrid,
} satisfies IPlatformAdapter;

type OfferSheetProps = {
  status: 'success' | 'pending' | 'error';
};
const DefaultTemplate: StoryFn<OfferSheetProps> = (args) => {
  const setOfferSheetAtom = useSetAtom(offerSheetAtom);
  useEffect(() => {
    setOfferSheetAtom((prev) => ({
      ...prev,
      isOpen: true,
      onClose: () => {},
      platform: PlatformVariant.Web,
      cdnUrl: 'https://cdn.bluelightcard.co.uk',
      isMobileHybrid: false,
      offerMeta: { offerId: 3802, companyId: 4016, companyName: 'SEAT' },
      offerDetails: {
        id: '3802',
        name: 'Save with SEAT',
        companyId: '4016',
        description: convertStringToRichtextModule(
          'SEAT have put together a discount on the price of a new car.  Visit the link to see some example pricing and your enquiry will be passed to a SEAT approved agent.',
        ),
        expires: '2030-06-30T23:59:59.000Z',
        termsAndConditions: convertStringToRichtextModule(
          'Must be a Blue Light Card member in order to receive the discount.',
        ),
        image: 'companyimages/complarge/retina/',
        type: 'online',
      },
    }));
  }, [setOfferSheetAtom]);

  return (
    <div style={{ minHeight: 250 }}>
      <SharedUIConfigProvider
        value={{
          globalConfig: {
            brand: 'blc-uk',
            cdnUrl: 'https://cdn.bluelightcard.co.uk',
          },
        }}
      >
        <QueryClientProvider client={mockQueryClient}>
          <PlatformAdapterProvider adapter={mockPlatformAdapter}>
            {args.status === 'success' && <OfferSheetDetailsPage />}
            {args.status === 'pending' && (
              <LoadingSpinner
                containerClassName="text-palette-primary"
                spinnerClassName="text-[5em]"
              />
            )}
            {args.status === 'error' && <OfferDetailsErrorPage />}
          </PlatformAdapterProvider>
        </QueryClientProvider>
      </SharedUIConfigProvider>
    </div>
  );
};

export const PendingStatus = DefaultTemplate.bind({});
PendingStatus.args = {
  status: 'pending',
};

export const ErrorStatus = DefaultTemplate.bind({});
ErrorStatus.args = {
  status: 'error',
};

export const SuccessStatus = DefaultTemplate.bind({});
SuccessStatus.args = {
  status: 'success',
};

export default componentMeta;
